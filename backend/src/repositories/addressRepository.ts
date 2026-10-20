import { 
  PutCommand, 
  DeleteCommand, 
  QueryCommand 
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME, isAwsDynamoEnabled } from '../utils/dynamoClient';
import type { CustomerAddress } from '../types';

// In-memory fallback for local offline simulation
const memoryAddresses: Map<string, CustomerAddress[]> = new Map();

export class AddressRepository {
  async listByUser(userId: string): Promise<CustomerAddress[]> {
    if (!isAwsDynamoEnabled) {
      return memoryAddresses.get(userId) || [];
    }

    try {
      const response = await docClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
          ExpressionAttributeValues: {
            ':pk': `USER#${userId}`,
            ':prefix': 'ADDRESS#'
          }
        })
      );
      if (response.Items && response.Items.length > 0) {
        return response.Items.map((item) => item.data as CustomerAddress);
      }
    } catch {
      return memoryAddresses.get(userId) || [];
    }
    return memoryAddresses.get(userId) || [];
  }

  async save(userId: string, address: CustomerAddress): Promise<void> {
    const addressId = address.id || `addr-${Date.now()}`;
    const normalized: CustomerAddress = { ...address, id: addressId };
    const list = memoryAddresses.get(userId) || [];
    const index = list.findIndex((a) => a.id === addressId);
    if (index >= 0) {
      list[index] = normalized;
    } else {
      list.push(normalized);
    }
    memoryAddresses.set(userId, list);

    if (!isAwsDynamoEnabled) {
      return;
    }

    try {
      await docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            PK: `USER#${userId}`,
            SK: `ADDRESS#${addressId}`,
            data: normalized,
            updatedAt: new Date().toISOString()
          }
        })
      );
    } catch {
      // Local fallback in memory
    }
  }

  async delete(userId: string, addressId: string): Promise<void> {
    const list = memoryAddresses.get(userId) || [];
    memoryAddresses.set(userId, list.filter((a) => a.id !== addressId));

    if (!isAwsDynamoEnabled) {
      return;
    }

    try {
      await docClient.send(
        new DeleteCommand({
          TableName: TABLE_NAME,
          Key: {
            PK: `USER#${userId}`,
            SK: `ADDRESS#${addressId}`
          }
        })
      );
    } catch {
      // Local fallback in memory
    }
  }

  async setDefault(userId: string, addressId: string): Promise<void> {
    const addresses = await this.listByUser(userId);
    for (const addr of addresses) {
      addr.isDefault = addr.id === addressId;
      await this.save(userId, addr);
    }
  }
}

export const addressRepository = new AddressRepository();
