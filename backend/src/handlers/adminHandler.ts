import { adminService } from '../services/adminService';
import { extractUserFromEvent, requireAdmin } from '../utils/auth';
import { successResponse, errorResponse } from '../utils/response';

export const handler = async (event: any) => {
  try {
    const httpMethod = event.requestContext?.http?.method || event.httpMethod || 'GET';
    const path = event.rawPath || event.path || '';
    const pathParameters = event.pathParameters || {};
    const body = event.body ? (typeof event.body === 'string' ? JSON.parse(event.body) : event.body) : {};

    if (httpMethod === 'OPTIONS') {
      return successResponse({ status: 'OK' });
    }

    // STRICT SERVER-SIDE ADMIN AUTHORIZATION
    const user = extractUserFromEvent(event);
    requireAdmin(user);

    // S3 Object Storage Presigned Upload: POST /admin/uploads/presign
    if (path.includes('/uploads/presign') && httpMethod === 'POST') {
      const { fileName, fileType } = body;
      if (!fileName || !fileType) {
        return errorResponse('fileName and fileType are required', 400);
      }
      const presigned = await adminService.generatePresignedUpload(fileName, fileType);
      return successResponse(presigned);
    }

    // S3 Object Listing: GET /admin/uploads
    if (path.includes('/uploads') && httpMethod === 'GET') {
      const items = await adminService.listMediaUploads();
      return successResponse({ items, count: items.length });
    }

    // PATCH /admin/inventory/{productId}
    if (path.includes('/inventory') && httpMethod === 'PATCH') {
      const productId = pathParameters.productId || body.productId;
      const stock = parseInt(body.stockQuantity);
      if (isNaN(stock)) {
        return errorResponse('stockQuantity must be a valid number', 400);
      }
      await adminService.updateStock(productId, stock);
      return successResponse({ message: 'Stock updated successfully', productId, stockQuantity: stock });
    }

    // GET /admin/orders
    if (path.includes('/orders') && httpMethod === 'GET') {
      const orders = await adminService.listAllOrders();
      return successResponse({ orders, count: orders.length });
    }

    // PATCH /admin/orders/{orderId}
    if (path.includes('/orders') && httpMethod === 'PATCH') {
      const orderId = pathParameters.orderId || body.orderId;
      const { status } = body;
      if (!status) {
        return errorResponse('Status is required', 400);
      }
      await adminService.updateOrderStatus(orderId, status);
      return successResponse({ message: `Order ${orderId} status updated to ${status}` });
    }

    // POST /admin/products
    if (path.includes('/products') && httpMethod === 'POST') {
      const newProduct = await adminService.createProduct(body);
      return successResponse({ message: 'Product created', product: newProduct }, 201);
    }

    // PUT /admin/products/{productId}
    if (path.includes('/products') && httpMethod === 'PUT') {
      const productId = pathParameters.productId || body.id;
      const updated = await adminService.updateProduct(productId, body);
      return successResponse({ message: 'Product updated', product: updated });
    }

    // DELETE /admin/products/{productId}
    if (path.includes('/products') && httpMethod === 'DELETE') {
      const productId = pathParameters.productId;
      await adminService.deleteProduct(productId);
      return successResponse({ message: `Product ${productId} deleted` });
    }

    return errorResponse('Admin endpoint not found', 404);
  } catch (err: any) {
    return errorResponse(err.message || 'Admin operation forbidden', err.statusCode || 403);
  }
};
