import { orderRepository } from '../repositories/orderRepository';
import { extractUserFromEvent, requireCustomerOrOwner } from '../utils/auth';
import { successResponse, errorResponse } from '../utils/response';

export const handler = async (event: any) => {
  try {
    const httpMethod = event.requestContext?.http?.method || event.httpMethod || 'GET';
    const pathParameters = event.pathParameters || {};
    const user = extractUserFromEvent(event);

    if (httpMethod === 'OPTIONS') {
      return successResponse({ status: 'OK' });
    }

    // GET /orders/{orderId}
    if (pathParameters.orderId) {
      const order = await orderRepository.getById(user.userId, pathParameters.orderId);
      if (!order) {
        return errorResponse('Order not found', 404);
      }
      requireCustomerOrOwner(user, order.userId);
      return successResponse({ order });
    }

    // GET /orders
    const orders = await orderRepository.listByUser(user.userId);
    return successResponse({ orders, count: orders.length });
  } catch (err: any) {
    return errorResponse(err.message || 'Orders retrieval failed', err.statusCode || 500);
  }
};
