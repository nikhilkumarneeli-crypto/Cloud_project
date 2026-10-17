import { cartService } from '../services/cartService';
import { extractUserFromEvent } from '../utils/auth';
import { successResponse, errorResponse } from '../utils/response';

export const handler = async (event: any) => {
  try {
    const httpMethod = event.requestContext?.http?.method || event.httpMethod || 'GET';
    const pathParameters = event.pathParameters || {};
    const body = event.body ? (typeof event.body === 'string' ? JSON.parse(event.body) : event.body) : {};
    
    // Server-side user authorization
    const user = extractUserFromEvent(event);

    if (httpMethod === 'OPTIONS') {
      return successResponse({ status: 'OK' });
    }

    // GET /cart
    if (httpMethod === 'GET') {
      const cart = await cartService.getCart(user.userId);
      return successResponse(cart);
    }

    // POST /cart/items
    if (httpMethod === 'POST') {
      const { productId, quantity = 1 } = body;
      if (!productId) {
        return errorResponse('productId is required', 400);
      }
      const updated = await cartService.addItem(user.userId, productId, parseInt(quantity) || 1);
      return successResponse(updated, 201);
    }

    // PATCH /cart/items/{productId}
    if (httpMethod === 'PATCH') {
      const productId = pathParameters.productId || body.productId;
      if (!productId) {
        return errorResponse('productId is required', 400);
      }
      const quantity = parseInt(body.quantity);
      const updated = await cartService.updateQuantity(user.userId, productId, quantity);
      return successResponse(updated);
    }

    // DELETE /cart/items/{productId} or DELETE /cart
    if (httpMethod === 'DELETE') {
      const productId = pathParameters.productId;
      if (productId) {
        const updated = await cartService.removeItem(user.userId, productId);
        return successResponse(updated);
      } else {
        await cartService.clearCart(user.userId);
        return successResponse({ message: 'Cart cleared successfully' });
      }
    }

    return errorResponse('Method Not Allowed', 405);
  } catch (err: any) {
    return errorResponse(err.message || 'Cart operation failed', err.statusCode || 500);
  }
};
