import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as authorizers from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import * as path from 'path';

export interface CanopyStackProps extends cdk.StackProps {
  useLabRole?: boolean;
}

export class CanopyServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: CanopyStackProps) {
    super(scope, id, {
      ...props,
      synthesizer: props?.synthesizer ?? new cdk.DefaultStackSynthesizer({
        generateBootstrapVersionRule: false
      })
    });

    // -------------------------------------------------------------
    // 1. AWS Academy Learner Lab IAM Role Compatibility
    // -------------------------------------------------------------
    // In AWS Academy Learner Lab, creating new IAM roles is restricted.
    // We adopt the existing LabRole if running inside Learner Lab.
    const isLearnerLab = props?.useLabRole ?? (process.env.USE_LAB_ROLE !== 'false');
    const lambdaExecutionRole: iam.IRole = isLearnerLab
      ? iam.Role.fromRoleArn(this, 'LearnerLabRole', `arn:aws:iam::${this.account}:role/LabRole`)
      : new iam.Role(this, 'LambdaExecutionRole', {
          assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
          managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
          ]
        });

    // -------------------------------------------------------------
    // 2. Amazon DynamoDB: Single-Table Architecture
    // -------------------------------------------------------------
    const table = new dynamodb.Table(this, 'CanopyEcommerceTable', {
      tableName: 'CanopyEcommerceTable',
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // On-Demand, zero idle charges
      timeToLiveAttribute: 'ttl', // For 24h idempotency expiration
      removalPolicy: cdk.RemovalPolicy.DESTROY // Safe teardown without orphaned student resources
    });

    // Global Secondary Index for Category and Status queries
    table.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: { name: 'GSI1PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI1SK', type: dynamodb.AttributeType.STRING }
    });

    if (!isLearnerLab) {
      table.grantReadWriteData(lambdaExecutionRole);
    }

    // -------------------------------------------------------------
    // 3. Amazon Cognito User Pool & App Client
    // -------------------------------------------------------------
    const userPool = new cognito.UserPool(this, 'CanopyUserPool', {
      userPoolName: 'CanopyCustomerPool',
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      standardAttributes: {
        email: { required: true, mutable: true },
        fullname: { required: true, mutable: true }
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: false,
        requireDigits: true,
        requireSymbols: false
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'CanopyWebClient', {
      userPool,
      userPoolClientName: 'CanopyStorefrontClient',
      generateSecret: false, // Public SPA client
      authFlows: {
        userSrp: true,
        userPassword: true
      }
    });

    // User Pool Groups: Administrators and Customers
    new cognito.CfnUserPoolGroup(this, 'AdminGroup', {
      userPoolId: userPool.userPoolId,
      groupName: 'admins',
      description: 'Canopy Storefront Administrators'
    });

    new cognito.CfnUserPoolGroup(this, 'CustomerGroup', {
      userPoolId: userPool.userPoolId,
      groupName: 'customers',
      description: 'Canopy Verified Shoppers'
    });

    // -------------------------------------------------------------
    // 4. Amazon S3: Static Assets Bucket
    // -------------------------------------------------------------
    const assetsBucket = new s3.Bucket(this, 'CanopyAssetsBucket', {
      bucketName: `canopy-assets-${this.account}-${this.region}`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    if (!isLearnerLab) {
      assetsBucket.grantReadWrite(lambdaExecutionRole);
    }

    // -------------------------------------------------------------
    // 5. AWS Lambda Handlers (Node.js 20.x TypeScript)
    // -------------------------------------------------------------
    const backendCode = isLearnerLab
      ? lambda.Code.fromBucket(
          s3.Bucket.fromBucketName(this, 'CodeBucket', `canopy-code-${this.account}-${this.region}`),
          'backend.zip'
        )
      : lambda.Code.fromAsset(path.join(__dirname, '../../backend'));

    const handlerPrefix = isLearnerLab ? 'handlers' : 'dist/handlers';

    const commonEnv = {
      DYNAMODB_TABLE: table.tableName,
      USE_AWS_DYNAMODB: 'true',
      USER_POOL_ID: userPool.userPoolId,
      USER_POOL_CLIENT_ID: userPoolClient.userPoolClientId
    };

    const createLambda = (id: string, handler: string) => {
      return new lambda.Function(this, id, {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler,
        code: backendCode,
        memorySize: 256,
        timeout: cdk.Duration.seconds(15),
        environment: commonEnv,
        role: lambdaExecutionRole
      });
    };

    const productsFn = createLambda('ProductsHandler', `${handlerPrefix}/productsHandler.handler`);
    const cartFn = createLambda('CartHandler', `${handlerPrefix}/cartHandler.handler`);
    const checkoutFn = createLambda('CheckoutHandler', `${handlerPrefix}/checkoutHandler.handler`);
    const ordersFn = createLambda('OrdersHandler', `${handlerPrefix}/ordersHandler.handler`);
    const adminFn = createLambda('AdminHandler', `${handlerPrefix}/adminHandler.handler`);

    // -------------------------------------------------------------
    // 6. Amazon API Gateway: HTTP API (v2) with JWT Authorizer
    // -------------------------------------------------------------
    const httpApi = new apigw.HttpApi(this, 'CanopyHttpApi', {
      apiName: 'Canopy Serverless API',
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [
          apigw.CorsHttpMethod.GET,
          apigw.CorsHttpMethod.POST,
          apigw.CorsHttpMethod.PUT,
          apigw.CorsHttpMethod.PATCH,
          apigw.CorsHttpMethod.DELETE,
          apigw.CorsHttpMethod.OPTIONS
        ],
        allowHeaders: ['*']
      }
    });

    const jwtAuthorizer = new authorizers.HttpJwtAuthorizer(
      'CognitoJwtAuthorizer',
      `https://cognito-idp.${this.region}.amazonaws.com/${userPool.userPoolId}`,
      {
        jwtAudience: [userPoolClient.userPoolClientId]
      }
    );

    // Integrations
    const productsIntegration = new integrations.HttpLambdaIntegration('ProductsIntegration', productsFn);
    const cartIntegration = new integrations.HttpLambdaIntegration('CartIntegration', cartFn);
    const checkoutIntegration = new integrations.HttpLambdaIntegration('CheckoutIntegration', checkoutFn);
    const ordersIntegration = new integrations.HttpLambdaIntegration('OrdersIntegration', ordersFn);
    const adminIntegration = new integrations.HttpLambdaIntegration('AdminIntegration', adminFn);

    // Public Routes
    httpApi.addRoutes({
      path: '/api/products',
      methods: [apigw.HttpMethod.GET],
      integration: productsIntegration
    });
    httpApi.addRoutes({
      path: '/api/products/{productId}',
      methods: [apigw.HttpMethod.GET],
      integration: productsIntegration
    });
    httpApi.addRoutes({
      path: '/api/categories',
      methods: [apigw.HttpMethod.GET],
      integration: productsIntegration
    });
    httpApi.addRoutes({
      path: '/api/products/search',
      methods: [apigw.HttpMethod.GET],
      integration: productsIntegration
    });

    // Customer Routes (Protected with Cognito JWT Authorizer)
    httpApi.addRoutes({
      path: '/api/cart',
      methods: [apigw.HttpMethod.GET, apigw.HttpMethod.DELETE],
      integration: cartIntegration,
      authorizer: jwtAuthorizer
    });
    httpApi.addRoutes({
      path: '/api/cart/items',
      methods: [apigw.HttpMethod.POST],
      integration: cartIntegration,
      authorizer: jwtAuthorizer
    });
    httpApi.addRoutes({
      path: '/api/cart/items/{productId}',
      methods: [apigw.HttpMethod.PATCH, apigw.HttpMethod.DELETE],
      integration: cartIntegration,
      authorizer: jwtAuthorizer
    });
    httpApi.addRoutes({
      path: '/api/checkout',
      methods: [apigw.HttpMethod.POST],
      integration: checkoutIntegration,
      authorizer: jwtAuthorizer
    });
    httpApi.addRoutes({
      path: '/api/payments/simulate',
      methods: [apigw.HttpMethod.POST],
      integration: checkoutIntegration,
      authorizer: jwtAuthorizer
    });
    httpApi.addRoutes({
      path: '/api/orders',
      methods: [apigw.HttpMethod.GET],
      integration: ordersIntegration,
      authorizer: jwtAuthorizer
    });
    httpApi.addRoutes({
      path: '/api/orders/{orderId}',
      methods: [apigw.HttpMethod.GET],
      integration: ordersIntegration,
      authorizer: jwtAuthorizer
    });

    // Admin Routes (Protected with Cognito JWT Authorizer & Server-side Group check)
    httpApi.addRoutes({
      path: '/api/admin/products',
      methods: [apigw.HttpMethod.POST],
      integration: adminIntegration,
      authorizer: jwtAuthorizer
    });
    httpApi.addRoutes({
      path: '/api/admin/products/{productId}',
      methods: [apigw.HttpMethod.PUT, apigw.HttpMethod.DELETE],
      integration: adminIntegration,
      authorizer: jwtAuthorizer
    });
    httpApi.addRoutes({
      path: '/api/admin/inventory/{productId}',
      methods: [apigw.HttpMethod.PATCH],
      integration: adminIntegration,
      authorizer: jwtAuthorizer
    });
    httpApi.addRoutes({
      path: '/api/admin/orders',
      methods: [apigw.HttpMethod.GET],
      integration: adminIntegration,
      authorizer: jwtAuthorizer
    });
    httpApi.addRoutes({
      path: '/api/admin/orders/{orderId}',
      methods: [apigw.HttpMethod.PATCH],
      integration: adminIntegration,
      authorizer: jwtAuthorizer
    });

    // -------------------------------------------------------------
    // 7. CloudFormation Outputs
    // -------------------------------------------------------------
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: httpApi.apiEndpoint,
      description: 'API Gateway HTTP API Base Endpoint'
    });

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
      description: 'Cognito User Pool ID'
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      description: 'Cognito Web Client ID'
    });

    new cdk.CfnOutput(this, 'DynamoDbTableName', {
      value: table.tableName,
      description: 'DynamoDB Single Table Name'
    });

    new cdk.CfnOutput(this, 'AssetsBucketName', {
      value: assetsBucket.bucketName,
      description: 'S3 Static Assets Bucket Name'
    });
  }
}
