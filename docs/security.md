# Security & Compliance Architecture

## 1. Zero-Trust Principles
- **No Client Trust for Pricing**: The frontend never determines the price, discount, or tax. The Lambda backend re-fetches verified item prices from DynamoDB and recomputes all subtotals and totals before processing checkout.
- **Server-Side Authorization**: API Gateway routes use Amazon Cognito JWT validation. Every handler confirms that `claims.sub` matches the requested customer resource, preventing Insecure Direct Object Reference (IDOR).
- **Admin Role Verification**: The backend strictly checks `cognito:groups` for `admins`. Any claim supplied only by the frontend is discarded.

## 2. Secrets & Credential Management
- **Zero Secrets in Code**: No API keys, passwords, or AWS secret access keys are stored in source code, committed to Git, or exposed in client bundles.
- **Learner Lab IAM Compliance**: Functions assume IAM roles with least-privilege policies. In AWS Academy, the stack attaches to the pre-provisioned `LabRole` so restricted IAM calls do not block execution.
- **Payment Security & Mock Guardrails**: Real credit card information is never received or stored. Payments are strictly simulated with clear demo notices.

## 3. Inventory Concurrency & Race Condition Prevention
- Uses **DynamoDB Conditional Writes** and **TransactWriteItems**:
  ```json
  "ConditionExpression": "stockQuantity >= :qty AND isActive = :true"
  ```
- Prevents overselling during concurrent checkout attempts.
- **Idempotency Keys**: UUID-based idempotency keys with a 24-hour DynamoDB TTL safeguard against double billing or duplicate order generation on network retries.

## 4. Input Sanitization & Validation
- Request payloads are validated with Zod/Joi schemas.
- Path parameters and query parameters are typed and bounds-checked.
- SQL injection is not applicable (NoSQL DynamoDB API), and NoSQL injection is prevented by parameterized expressions.
- Cross-Site Scripting (XSS) mitigated through React's native string escaping and strict Content Security Policy (CSP).
