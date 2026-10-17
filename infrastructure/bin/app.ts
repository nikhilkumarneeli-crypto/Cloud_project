import * as cdk from 'aws-cdk-lib';
import { CanopyServerlessStack } from '../lib/canopy-stack';

const app = new cdk.App();

const region = process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1';
const account = process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID || '218862656675';

new CanopyServerlessStack(app, 'CanopyServerlessStack', {
  env: {
    account,
    region
  },
  description: 'Canopy E-Commerce Storefront - AWS Serverless Stack (Learner Lab Compliant)'
});

app.synth();
