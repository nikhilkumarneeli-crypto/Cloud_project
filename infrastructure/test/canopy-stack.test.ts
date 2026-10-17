import { describe, it, expect } from 'vitest';
import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { CanopyServerlessStack } from '../lib/canopy-stack';

describe('Phase 6: AWS CDK Infrastructure Stack Tests', () => {
  const app = new cdk.App();
  const stack = new CanopyServerlessStack(app, 'TestCanopyStack', {
    env: {
      account: '123456789012',
      region: 'us-east-1'
    },
    useLabRole: true
  });
  const template = Template.fromStack(stack);

  it('1. should define DynamoDB single table with on-demand billing and GSI', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'CanopyEcommerceTable',
      BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' },
        { AttributeName: 'SK', KeyType: 'RANGE' }
      ],
      TimeToLiveSpecification: {
        AttributeName: 'ttl',
        Enabled: true
      },
      GlobalSecondaryIndexes: Match.arrayWith([
        Match.objectLike({
          IndexName: 'GSI1',
          KeySchema: [
            { AttributeName: 'GSI1PK', KeyType: 'HASH' },
            { AttributeName: 'GSI1SK', KeyType: 'RANGE' }
          ]
        })
      ])
    });
  });

  it('2. should define Amazon Cognito User Pool with email sign-in and public client', () => {
    template.hasResourceProperties('AWS::Cognito::UserPool', {
      UserPoolName: 'CanopyCustomerPool',
      UsernameAttributes: ['email'],
      AutoVerifiedAttributes: ['email']
    });

    template.hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ClientName: 'CanopyStorefrontClient',
      GenerateSecret: false
    });

    // Groups
    template.hasResourceProperties('AWS::Cognito::UserPoolGroup', {
      GroupName: 'admins'
    });
    template.hasResourceProperties('AWS::Cognito::UserPoolGroup', {
      GroupName: 'customers'
    });
  });

  it('3. should define Lambda functions with Node.js 20.x and Learner Lab role', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'nodejs20.x',
      MemorySize: 256,
      Timeout: 15,
      Role: Match.stringLikeRegexp('.*LabRole.*')
    });
  });

  it('4. should define Amazon API Gateway HTTP API with CORS and JWT authorizer', () => {
    template.hasResourceProperties('AWS::ApiGatewayV2::Api', {
      Name: 'Canopy Serverless API',
      ProtocolType: 'HTTP',
      CorsConfiguration: Match.objectLike({
        AllowOrigins: ['*']
      })
    });

    template.hasResourceProperties('AWS::ApiGatewayV2::Authorizer', {
      AuthorizerType: 'JWT',
      Name: 'CognitoJwtAuthorizer'
    });
  });

  it('5. should define S3 static assets bucket with blocked public access', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true
      }
    });
  });
});
