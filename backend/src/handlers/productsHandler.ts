import { catalogService } from '../services/catalogService';
import { successResponse, errorResponse } from '../utils/response';

export const handler = async (event: any) => {
  try {
    const path = event.rawPath || event.path || '';
    const httpMethod = event.requestContext?.http?.method || event.httpMethod || 'GET';
    const queryParams = event.queryStringParameters || {};
    const pathParameters = event.pathParameters || {};

    if (httpMethod === 'OPTIONS') {
      return successResponse({ status: 'OK' });
    }

    // GET /categories
    if (path.endsWith('/categories')) {
      const categories = await catalogService.getCategories();
      return successResponse({ categories });
    }

    // GET /products/search
    if (path.endsWith('/search') || path.endsWith('/products/search')) {
      const q = queryParams.q || queryParams.query || '';
      const results = await catalogService.searchProducts(q);
      return successResponse({ products: results, count: results.length });
    }

    // GET /products/{productId}
    if (pathParameters.productId) {
      const product = await catalogService.getProductById(pathParameters.productId);
      if (!product) {
        return errorResponse('Product not found', 404);
      }
      return successResponse({ product });
    }

    // GET /products
    const products = await catalogService.getProducts({
      category: queryParams.category,
      brand: queryParams.brand,
      minPrice: queryParams.minPrice ? parseFloat(queryParams.minPrice) : undefined,
      maxPrice: queryParams.maxPrice ? parseFloat(queryParams.maxPrice) : undefined,
      minRating: queryParams.minRating ? parseFloat(queryParams.minRating) : undefined,
      sort: queryParams.sort
    });

    return successResponse({ products, total: products.length });
  } catch (err: any) {
    return errorResponse(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};
