import type { AuthenticatedUser } from '../types';

export const extractUserFromEvent = (event: any): AuthenticatedUser => {
  // 1. Production API Gateway with Cognito JWT Authorizer
  const claims = event?.requestContext?.authorizer?.jwt?.claims || event?.requestContext?.authorizer?.claims;
  
  if (claims) {
    const userId = claims.sub || claims.username || 'unknown-user';
    const email = claims.email || 'customer@canopy.shop';
    const groups: string[] = claims['cognito:groups']
      ? Array.isArray(claims['cognito:groups'])
        ? claims['cognito:groups']
        : [claims['cognito:groups']]
      : [];
    
    const isAdmin = groups.includes('admins') || groups.includes('admin') || claims['custom:role'] === 'admin';

    return {
      userId,
      email,
      role: isAdmin ? 'admin' : 'customer',
      isAdmin
    };
  }

  // 2. Local Simulation Fallback (Authorization Header)
  const authHeader = event?.headers?.authorization || event?.headers?.Authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const isAdmin = token.toLowerCase().includes('admin');
    return {
      userId: isAdmin ? 'usr-admin-01' : 'usr-customer-01',
      email: isAdmin ? 'admin@canopy.shop' : 'alex.woods@canopy.shop',
      role: isAdmin ? 'admin' : 'customer',
      isAdmin
    };
  }

  // Default guest/demo user for development
  return {
    userId: 'usr-customer-01',
    email: 'alex.woods@canopy.shop',
    role: 'customer',
    isAdmin: false
  };
};

export const requireAdmin = (user: AuthenticatedUser): void => {
  if (!user.isAdmin) {
    const err: any = new Error('Forbidden: Administrative privileges required.');
    err.statusCode = 403;
    throw err;
  }
};

export const requireCustomerOrOwner = (user: AuthenticatedUser, targetUserId?: string): void => {
  if (!user.userId) {
    const err: any = new Error('Unauthorized: Authentication token is required.');
    err.statusCode = 401;
    throw err;
  }
  if (targetUserId && targetUserId !== user.userId && !user.isAdmin) {
    const err: any = new Error('Forbidden: Cannot view or modify another customer\'s resources.');
    err.statusCode = 403;
    throw err;
  }
};
