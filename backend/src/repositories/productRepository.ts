import { 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  DeleteCommand, 
  ScanCommand, 
  QueryCommand 
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME, isAwsDynamoEnabled } from '../utils/dynamoClient';
import type { ProductItem } from '../types';

// In-memory fallback cache for development or when running without active AWS credentials
const memoryProducts: Map<string, ProductItem> = new Map();

export class ProductRepository {
  async getById(id: string): Promise<ProductItem | null> {
    if (!isAwsDynamoEnabled) {
      return memoryProducts.get(id) || null;
    }

    try {
      const response = await docClient.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: {
            PK: `PRODUCT#${id}`,
            SK: 'METADATA'
          }
        })
      );
      if (response.Item) {
        return response.Item.data as ProductItem;
      }
    } catch {
      return memoryProducts.get(id) || null;
    }
    return memoryProducts.get(id) || null;
  }

  async listAll(category?: string): Promise<ProductItem[]> {
    if (!isAwsDynamoEnabled) {
      const all = Array.from(memoryProducts.values());
      if (category && category !== 'All') {
        return all.filter((p) => p.category === category);
      }
      return all;
    }

    try {
      if (category && category !== 'All') {
        const response = await docClient.send(
          new QueryCommand({
            TableName: TABLE_NAME,
            IndexName: 'GSI1',
            KeyConditionExpression: 'GSI1PK = :cat',
            ExpressionAttributeValues: {
              ':cat': `CATEGORY#${category}`
            }
          })
        );
        if (response.Items && response.Items.length > 0) {
          return response.Items.map((item) => item.data as ProductItem);
        }
      } else {
        const response = await docClient.send(
          new ScanCommand({
            TableName: TABLE_NAME,
            FilterExpression: 'begins_with(PK, :prefix) AND SK = :sk',
            ExpressionAttributeValues: {
              ':prefix': 'PRODUCT#',
              ':sk': 'METADATA'
            }
          })
        );
        if (response.Items && response.Items.length > 0) {
          return response.Items.map((item) => item.data as ProductItem);
        }
      }
    } catch {
      const all = Array.from(memoryProducts.values());
      if (category && category !== 'All') {
        return all.filter((p) => p.category === category);
      }
      return all;
    }

    const all = Array.from(memoryProducts.values());
    if (category && category !== 'All') {
      return all.filter((p) => p.category === category);
    }
    return all;
  }

  async listByCategory(category: string): Promise<ProductItem[]> {
    return this.listAll(category);
  }

  async save(product: ProductItem): Promise<void> {
    memoryProducts.set(product.id, product);

    if (!isAwsDynamoEnabled) {
      return;
    }

    try {
      await docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            PK: `PRODUCT#${product.id}`,
            SK: 'METADATA',
            GSI1PK: `CATEGORY#${product.category}`,
            GSI1SK: `${product.currentPrice.toFixed(2)}`,
            data: product,
            stockQuantity: product.stockQuantity,
            isActive: product.isActive,
            updatedAt: product.updatedAt
          }
        })
      );
    } catch {
      // Preserved in-memory
    }
  }

  async updateStock(id: string, newStock: number): Promise<boolean> {
    const cached = memoryProducts.get(id);
    if (cached) {
      cached.stockQuantity = newStock;
      cached.updatedAt = new Date().toISOString();
      memoryProducts.set(id, cached);
    }

    if (!isAwsDynamoEnabled) {
      return !!cached;
    }

    try {
      await docClient.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: {
            PK: `PRODUCT#${id}`,
            SK: 'METADATA'
          },
          UpdateExpression: 'SET stockQuantity = :stock, #data.stockQuantity = :stock, updatedAt = :now',
          ExpressionAttributeNames: {
            '#data': 'data'
          },
          ExpressionAttributeValues: {
            ':stock': newStock,
            ':now': new Date().toISOString()
          }
        })
      );
      return true;
    } catch {
      return !!cached;
    }
  }

  async delete(id: string): Promise<void> {
    memoryProducts.delete(id);

    if (!isAwsDynamoEnabled) {
      return;
    }

    try {
      await docClient.send(
        new DeleteCommand({
          TableName: TABLE_NAME,
          Key: {
            PK: `PRODUCT#${id}`,
            SK: 'METADATA'
          }
        })
      );
    } catch {
      // Handled
    }
  }
}

export const productRepository = new ProductRepository();
