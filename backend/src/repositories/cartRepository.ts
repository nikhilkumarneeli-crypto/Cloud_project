import { 
  PutCommand, 
  DeleteCommand, 
  QueryCommand 
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME, isAwsDynamoEnabled } from '../utils/dynamoClient';
import type { CartRecord } from '../types';

const memoryCarts: Map<string, Map<string, CartRecord>> = new Map();

export class CartRepository {
  private getUserMap(userId: string): Map<string, CartRecord> {
    if (!memoryCarts.has(userId)) {
      memoryCarts.set(userId, new Map());
    }
    return memoryCarts.get(userId)!;
  }

  async getCart(userId: string): Promise<CartRecord[]> {
    if (!isAwsDynamoEnabled) {
      return Array.from(this.getUserMap(userId).values());
    }

    try {
      const response = await docClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
          ExpressionAttributeValues: {
            ':pk': `USER#${userId}`,
            ':skPrefix': 'CART#'
          }
        })
      );
      if (response.Items && response.Items.length > 0) {
        return response.Items.map((item) => ({
          userId,
          productId: item.productId,
          quantity: item.quantity,
          addedAt: item.addedAt
        }));
      }
    } catch {
      return Array.from(this.getUserMap(userId).values());
    }

    return Array.from(this.getUserMap(userId).values());
  }

  async setItem(userId: string, productId: string, quantity: number): Promise<void> {
    const item: CartRecord = {
      userId,
      productId,
      quantity,
      addedAt: new Date().toISOString()
    };
    this.getUserMap(userId).set(productId, item);

    if (!isAwsDynamoEnabled) {
      return;
    }

    try {
      await docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            PK: `USER#${userId}`,
            SK: `CART#${productId}`,
            productId,
            quantity,
            addedAt: item.addedAt
          }
        })
      );
    } catch {
      // Retained in-memory
    }
  }

  async removeItem(userId: string, productId: string): Promise<void> {
    this.getUserMap(userId).delete(productId);

    if (!isAwsDynamoEnabled) {
      return;
    }

    try {
      await docClient.send(
        new DeleteCommand({
          TableName: TABLE_NAME,
          Key: {
            PK: `USER#${userId}`,
            SK: `CART#${productId}`
          }
        })
      );
    } catch {
      // Retained in-memory
    }
  }

  async clearCart(userId: string): Promise<void> {
    this.getUserMap(userId).clear();

    if (!isAwsDynamoEnabled) {
      return;
    }

    try {
      const items = await this.getCart(userId);
      for (const item of items) {
        await docClient.send(
          new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
              PK: `USER#${userId}`,
              SK: `CART#${item.productId}`
            }
          })
        );
      }
    } catch {
      // Cleared in-memory
    }
  }
}

export const cartRepository = new CartRepository();
