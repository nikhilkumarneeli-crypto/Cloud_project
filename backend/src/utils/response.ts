import type { APIGatewayResponse } from '../types';

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,PATCH,DELETE',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
};

export const successResponse = (data: any, statusCode = 200): APIGatewayResponse => {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(data)
  };
};

export const errorResponse = (
  message: string,
  statusCode = 400,
  details: any = null
): APIGatewayResponse => {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      error: message,
      statusCode,
      details,
      timestamp: new Date().toISOString()
    })
  };
};
