import express from 'express';
import cors from 'cors';
import { handler as productsHandler } from './handlers/productsHandler';
import { handler as cartHandler } from './handlers/cartHandler';
import { handler as checkoutHandler } from './handlers/checkoutHandler';
import { handler as ordersHandler } from './handlers/ordersHandler';
import { handler as adminHandler } from './handlers/adminHandler';
import { seedDatabase } from './seed';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Helper to translate Express request to API Gateway event
const adaptToLambda = (req: express.Request) => ({
  rawPath: req.path,
  path: req.path,
  httpMethod: req.method,
  requestContext: {
    http: {
      method: req.method,
      path: req.path
    }
  },
  headers: req.headers,
  queryStringParameters: req.query,
  pathParameters: req.params,
  body: req.body
});

// Helper to send API Gateway response through Express
const sendLambdaResponse = (res: express.Response, lambdaResult: any) => {
  res.status(lambdaResult.statusCode);
  if (lambdaResult.headers) {
    for (const [key, val] of Object.entries(lambdaResult.headers)) {
      res.setHeader(key, val as string);
    }
  }
  res.send(lambdaResult.body);
};

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'Canopy E-Commerce Backend (AWS Serverless Node.js 20)',
    region: process.env.AWS_REGION || 'us-east-1',
    environment: 'AWS Academy Learner Lab Sandbox',
    timestamp: new Date().toISOString()
  });
});

// Public Routes
app.get('/api/categories', async (req, res) => {
  const result = await productsHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

app.get('/api/products/search', async (req, res) => {
  const result = await productsHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

app.get('/api/products/:productId', async (req, res) => {
  const result = await productsHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

app.get('/api/products', async (req, res) => {
  const result = await productsHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

// Customer Cart Routes
app.get('/api/cart', async (req, res) => {
  const result = await cartHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

app.post('/api/cart/items', async (req, res) => {
  const result = await cartHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

app.patch('/api/cart/items/:productId', async (req, res) => {
  const result = await cartHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

app.delete('/api/cart/items/:productId', async (req, res) => {
  const result = await cartHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

app.delete('/api/cart', async (req, res) => {
  const result = await cartHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

// Checkout & Payment Simulation Routes
app.post('/api/checkout', async (req, res) => {
  const result = await checkoutHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

app.post('/api/payments/simulate', async (req, res) => {
  const result = await checkoutHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

// Orders Routes
app.get('/api/orders/:orderId', async (req, res) => {
  const result = await ordersHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

app.get('/api/orders', async (req, res) => {
  const result = await ordersHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

// Admin Routes
app.post('/api/admin/products', async (req, res) => {
  const result = await adminHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

app.put('/api/admin/products/:productId', async (req, res) => {
  const result = await adminHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

app.delete('/api/admin/products/:productId', async (req, res) => {
  const result = await adminHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

app.patch('/api/admin/inventory/:productId', async (req, res) => {
  const result = await adminHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

app.get('/api/admin/orders', async (req, res) => {
  const result = await adminHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

app.patch('/api/admin/orders/:orderId', async (req, res) => {
  const result = await adminHandler(adaptToLambda(req));
  sendLambdaResponse(res, result);
});

// Auto-seed initial catalog on boot
seedDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🌲 Canopy E-Commerce Serverless API running on http://localhost:${PORT}`);
    console.log(`📡 Ready for API Gateway routing & Frontend integration in us-east-1.`);
  });
});
