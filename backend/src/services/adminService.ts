import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { productRepository } from '../repositories/productRepository';
import { orderRepository } from '../repositories/orderRepository';
import type { ProductItem, OrderRecord } from '../types';

const ASSETS_BUCKET = process.env.ASSETS_BUCKET_NAME || 'canopy-assets-218862656675-us-east-1';
const REGION = process.env.AWS_REGION || 'us-east-1';

const s3Client = new S3Client({ region: REGION });

export class AdminService {
  async createProduct(data: Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductItem> {
    const id = `prod-${data.category.toLowerCase().slice(0, 4)}-${Date.now().toString(36)}`;
    const product: ProductItem = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await productRepository.save(product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<ProductItem>): Promise<ProductItem> {
    const existing = await productRepository.getById(id);
    if (!existing) {
      throw new Error(`Product ${id} not found.`);
    }

    const updated: ProductItem = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await productRepository.save(updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    await productRepository.delete(id);
  }

  async updateStock(id: string, newStock: number): Promise<boolean> {
    return await productRepository.updateStock(id, newStock);
  }

  async listAllOrders(): Promise<OrderRecord[]> {
    return await orderRepository.listAll();
  }

  async updateOrderStatus(orderId: string, status: OrderRecord['orderStatus']): Promise<void> {
    await orderRepository.updateStatus(orderId, status);
  }

  // Amazon S3 Object Storage Presigned URL generation
  async generatePresignedUpload(fileName: string, fileType: string): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(fileType)) {
      throw new Error(`File type ${fileType} is not supported. Allowed: ${allowedTypes.join(', ')}`);
    }

    const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `products/${Date.now()}-${sanitized}`;

    const command = new PutObjectCommand({
      Bucket: ASSETS_BUCKET,
      Key: key,
      ContentType: fileType
    });

    // 15-minute expiration
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
    const publicUrl = `https://${ASSETS_BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

    return { uploadUrl, key, publicUrl };
  }

  // Amazon S3 Object Listing
  async listMediaUploads(): Promise<string[]> {
    try {
      const response = await s3Client.send(
        new ListObjectsV2Command({
          Bucket: ASSETS_BUCKET,
          Prefix: 'products/',
          MaxKeys: 50
        })
      );
      if (response.Contents) {
        return response.Contents.map((obj) => `https://${ASSETS_BUCKET}.s3.${REGION}.amazonaws.com/${obj.Key}`);
      }
    } catch {
      return [];
    }
    return [];
  }
}

export const adminService = new AdminService();
