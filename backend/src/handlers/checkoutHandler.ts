import { checkoutService } from '../services/checkoutService';
import { cartService } from '../services/cartService';
import { extractUserFromEvent } from '../utils/auth';
import { successResponse, errorResponse } from '../utils/response';

export const handler = async (event: any) => {
  try {
    const httpMethod = event.requestContext?.http?.method || event.httpMethod || 'POST';
    const path = event.rawPath || event.path || '';
    const body = event.body ? (typeof event.body === 'string' ? JSON.parse(event.body) : event.body) : {};

    const user = extractUserFromEvent(event);

    if (httpMethod === 'OPTIONS') {
      return successResponse({ status: 'OK' });
    }

    // POST /checkout (Pre-checkout price calculation & stock review)
    if (path.endsWith('/checkout')) {
      const calculation = await cartService.getCart(user.userId);
      return successResponse({
        orderDraft: calculation,
        eligibleForShipping: calculation.shippingFee === 0
      });
    }

    // POST /payments/simulate
    if (path.endsWith('/payments/simulate') || path.endsWith('/simulate')) {
      const { idempotencyKey, shippingAddress, shippingMethod = 'standard', outcome = 'SUCCESS', items } = body;

      if (!shippingAddress) {
        return errorResponse('shippingAddress is required', 400);
      }

      const result = await checkoutService.processSimulatedPayment(user.userId, {
        idempotencyKey,
        shippingAddress,
        shippingMethod,
        outcome,
        items
      });

      if (!result.success) {
        return errorResponse(result.error || 'Payment processing failed', 400);
      }

      return successResponse({
        message: 'Payment simulated successfully. Order created.',
        order: result.order
      }, 201);
    }

    return errorResponse('Endpoint not found', 404);
  } catch (err: any) {
    return errorResponse(err.message || 'Checkout failed', err.statusCode || 500);
  }
};
