import { 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  QueryCommand, 
  ScanCommand 
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME, isAwsDynamoEnabled } from '../utils/dynamoClient';
import type { OrderRecord } from '../types';

const memoryOrders: Map<string, OrderRecord> = new Map();
const memoryIdempotency: Set<string> = new Set();

export class OrderRepository {
  async getById(userId: string, orderId: string): Promise<OrderRecord | null> {
    if (!isAwsDynamoEnabled) {
      return memoryOrders.get(orderId) || null;
    }

    try {
      const response = await docClient.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: {
            PK: `USER#${userId}`,
            SK: `ORDER#${orderId}`
          }
        })
      );
      if (response.Item) {
        return response.Item.data as OrderRecord;
      }
    } catch {
      return memoryOrders.get(orderId) || null;
    }
    return memoryOrders.get(orderId) || null;
  }

  async listByUser(userId: string): Promise<OrderRecord[]> {
    if (!isAwsDynamoEnabled) {
      return Array.from(memoryOrders.values())
        .filter((o) => o.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    try {
      const response = await docClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
          ExpressionAttributeValues: {
            ':pk': `USER#${userId}`,
            ':prefix': 'ORDER#'
          },
          ScanIndexForward: false
        })
      );
      if (response.Items && response.Items.length > 0) {
        return response.Items.map((item) => item.data as OrderRecord);
      }
    } catch {
      return Array.from(memoryOrders.values())
        .filter((o) => o.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return Array.from(memoryOrders.values())
      .filter((o) => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async listAll(): Promise<OrderRecord[]> {
    if (!isAwsDynamoEnabled) {
      return Array.from(memoryOrders.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    try {
      const response = await docClient.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: 'begins_with(SK, :prefix)',
          ExpressionAttributeValues: {
            ':prefix': 'ORDER#'
          }
        })
      );
      if (response.Items && response.Items.length > 0) {
        return response.Items.map((item) => item.data as OrderRecord);
      }
    } catch {
      return Array.from(memoryOrders.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return Array.from(memoryOrders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async save(order: OrderRecord, idempotencyKey?: string): Promise<void> {
    memoryOrders.set(order.id, order);
    if (idempotencyKey) {
      memoryIdempotency.add(idempotencyKey);
    }

    if (!isAwsDynamoEnabled) {
      return;
    }

    try {
      await docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            PK: `USER#${order.userId}`,
            SK: `ORDER#${order.id}`,
            GSI1PK: `STATUS#${order.orderStatus}`,
            GSI1SK: order.createdAt,
            data: order,
            total: order.total,
            createdAt: order.createdAt
          }
        })
      );

      // Record idempotency with 24h TTL
      if (idempotencyKey) {
        const ttlSeconds = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
        await docClient.send(
          new PutCommand({
            TableName: TABLE_NAME,
            Item: {
              PK: `IDEMPOTENCY#${idempotencyKey}`,
              SK: 'RECORD',
              orderId: order.id,
              ttl: ttlSeconds
            }
          })
        );
      }
    } catch {
      // In-memory preserved
    }
  }

  async checkIdempotency(key: string): Promise<boolean> {
    if (memoryIdempotency.has(key)) return true;

    if (!isAwsDynamoEnabled) {
      return false;
    }

    try {
      const response = await docClient.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: {
            PK: `IDEMPOTENCY#${key}`,
            SK: 'RECORD'
          }
        })
      );
      return !!response.Item;
    } catch {
      return memoryIdempotency.has(key);
    }
  }

  async updateStatus(orderId: string, status: OrderRecord['orderStatus']): Promise<void> {
    const existing = memoryOrders.get(orderId);
    if (existing) {
      existing.orderStatus = status;
      memoryOrders.set(orderId, existing);
    }

    if (!isAwsDynamoEnabled) {
      return;
    }

    try {
      const response = await docClient.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: 'SK = :sk',
          ExpressionAttributeValues: {
            ':sk': `ORDER#${orderId}`
          }
        })
      );

      if (response.Items && response.Items.length > 0) {
        const userPK = response.Items[0].PK;
        await docClient.send(
          new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
              PK: userPK,
              SK: `ORDER#${orderId}`
            },
            UpdateExpression: 'SET #data.orderStatus = :status, GSI1PK = :gsi',
            ExpressionAttributeNames: {
              '#data': 'data'
            },
            ExpressionAttributeValues: {
              ':status': status,
              ':gsi': `STATUS#${status}`
            }
          })
        );
      }
    } catch {
      // Preserved in memory
    }
  }
}

export const orderRepository = new OrderRepository();
