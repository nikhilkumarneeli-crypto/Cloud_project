import { addressRepository } from '../repositories/addressRepository';
import { extractUserFromEvent } from '../utils/auth';
import { successResponse, errorResponse } from '../utils/response';
import type { CustomerAddress } from '../types';

export const handler = async (event: any) => {
  try {
    const httpMethod = event.requestContext?.http?.method || event.httpMethod || 'GET';
    const path = event.rawPath || event.path || '';
    const pathParameters = event.pathParameters || {};
    const body = event.body ? (typeof event.body === 'string' ? JSON.parse(event.body) : event.body) : {};

    if (httpMethod === 'OPTIONS') {
      return successResponse({ status: 'OK' });
    }

    // Authenticated user isolation
    const user = extractUserFromEvent(event);
    const userId = user?.userId || user?.id;
    if (!userId) {
      return errorResponse('Authentication required to access saved addresses.', 401);
    }

    // 1. GET /api/user/addresses
    if (httpMethod === 'GET' && path.includes('/addresses')) {
      const addresses = await addressRepository.listByUser(userId);
      return successResponse({ addresses, count: addresses.length });
    }

    // 2. POST /api/user/addresses
    if (httpMethod === 'POST' && path.includes('/addresses')) {
      const { fullName, street, city, state, postalCode, country, phone, isDefault } = body;
      if (!fullName || !street || !city || !postalCode) {
        return errorResponse('fullName, street, city, and postalCode are required fields.', 400);
      }

      const address: CustomerAddress = {
        id: body.id || `addr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        fullName,
        phone: phone || '+1 (555) 000-0000',
        street,
        apartment: body.apartment || '',
        city,
        state: state || '',
        postalCode,
        country: country || 'United States',
        isDefault: Boolean(isDefault)
      };

      if (address.isDefault && address.id) {
        await addressRepository.setDefault(userId, address.id);
      }
      await addressRepository.save(userId, address);
      return successResponse({ message: 'Address saved successfully', address }, 201);
    }

    // 3. DELETE /api/user/addresses/{addressId}
    if (httpMethod === 'DELETE' && path.includes('/addresses')) {
      const addressId = pathParameters.addressId || path.split('/').pop();
      if (!addressId) {
        return errorResponse('Address ID is required', 400);
      }
      await addressRepository.delete(userId, addressId);
      return successResponse({ message: 'Address deleted successfully', addressId });
    }

    // 4. PATCH /api/user/addresses/{addressId}/default
    if (httpMethod === 'PATCH' && path.includes('/default')) {
      const parts = path.split('/');
      const addressId = pathParameters.addressId || parts[parts.indexOf('addresses') + 1];
      if (!addressId) {
        return errorResponse('Address ID is required', 400);
      }
      await addressRepository.setDefault(userId, addressId);
      return successResponse({ message: 'Default address updated successfully', addressId });
    }

    return errorResponse('Address endpoint not found', 404);
  } catch (err: any) {
    return errorResponse(err.message || 'Address operation failed', err.statusCode || 500);
  }
};
