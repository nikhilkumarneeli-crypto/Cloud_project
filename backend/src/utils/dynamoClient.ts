import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const REGION = process.env.AWS_REGION || process.env.VITE_AWS_REGION || 'us-east-1';

// Base AWS DynamoDB client
export const rawClient = new DynamoDBClient({
  region: REGION,
  maxAttempts: 2
});

// Document client for easy JavaScript object marshalling
export const docClient = DynamoDBDocumentClient.from(rawClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: true
  }
});

export const TABLE_NAME = process.env.DYNAMODB_TABLE || 'CanopyEcommerceTable';

// Flag determining if client should execute live AWS network calls vs local high-speed in-memory repository
export const isAwsDynamoEnabled = process.env.USE_AWS_DYNAMODB === 'true';
