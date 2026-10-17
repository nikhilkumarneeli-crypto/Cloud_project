# AWS Serverless Shopping Cart — Architecture & Design Document

## 1. Overview & Business Context
This application is a full-featured, enterprise-grade e-commerce storefront designed for AWS serverless architecture with low operational overhead, near-infinite scalability, and pay-per-use economics. It is customized with the **"Premium Forest Retail"** visual identity inspired by nature and premium organic retail (e.g., Whole Foods / Aesop aesthetics combined with Amazon/Flipkart utility).

## 2. Cloud Architecture Diagram

```mermaid
flowchart TD
    Client["Client Browser (Desktop/Mobile)\nReact + TypeScript + Vite + Tailwind"]
    
    subgraph Edge_and_CDN ["CDN & Static Hosting"]
        CF["Amazon CloudFront (HTTPS / Caching)"]
        S3Static["Amazon S3 Static Bucket"]
        CF --> S3Static
    end
    
    subgraph Auth ["Identity & Access Management"]
        Cognito["Amazon Cognito User Pool\n- Auth & Tokens (JWT)\n- Groups: Customers, Admins"]
    end
    
    subgraph API_Tier ["API Gateway"]
        APIGW["Amazon API Gateway (HTTP API v2)\n- CORS configured\n- JWT Authorizer (Cognito)"]
    end
    
    subgraph Compute ["Serverless Compute (AWS Lambda - Node.js/TS)"]
        LProducts["Products Handler\n(Catalog, Categories, Search)"]
        LCart["Cart Handler\n(Get, Add, Update, Merge)"]
        LCheckout["Checkout & Payment Handler\n(Idempotent, Transactional Inventory)"]
        LOrders["Orders Handler\n(History, Details, Status)"]
        LAdmin["Admin Handler\n(Product & Inventory Management)"]
    end
    
    subgraph Database ["NoSQL Database (Amazon DynamoDB)"]
        DDBProducts[("Products Table\nPK: PRODUCT#id\nGSI: CategoryIndex")]
        DDBCart[("Cart Table\nPK: USER#id, SK: ITEM#productId")]
        DDBOrders[("Orders Table\nPK: USER#id, SK: ORDER#orderId\nGSI: OrderStatusIndex")]
        DDBIdempotency[("Idempotency Table\nPK: IDEMPOTENCY#key\nTTL: 24h")]
    end
    
    subgraph Assets ["Media Storage"]
        S3Images["Amazon S3 Products Bucket\nPresigned URLs"]
    end
    
    subgraph Observability ["Monitoring & Governance"]
        CWLogs["CloudWatch Logs"]
        CWMetrics["CloudWatch Metrics & Alarms"]
    end
    
    Client -->|1. Load Web App| CF
    Client -->|2. Authenticate| Cognito
    Client -->|3. Signed API Requests (Bearer JWT)| APIGW
    
    APIGW -->|Public Routes| LProducts
    APIGW -->|Auth Customer Routes| LCart
    APIGW -->|Auth Customer Routes| LCheckout
    APIGW -->|Auth Customer Routes| LOrders
    APIGW -->|Admin Routes| LAdmin
    
    LProducts --> DDBProducts
    LCart --> DDBCart
    LCheckout --> DDBOrders
    LCheckout --> DDBProducts
    LCheckout --> DDBIdempotency
    LOrders --> DDBOrders
    LAdmin --> DDBProducts
    LAdmin --> S3Images
    
    Compute -.-> CWLogs
    Compute -.-> CWMetrics
```

## 3. Visual Identity: "Premium Forest Retail" Design Tokens

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Primary Navigation** | `#173D30` | Deep forest green for main header, navigation bar, footer hero, and structural branding |
| **Main Page Background** | `#F7F4ED` | Warm ivory background providing an organic, warm editorial shopping feel |
| **Primary CTA Button** | `#F27A36` | Tangerine orange for Add to Cart, Buy Now, Proceed to Checkout buttons |
| **Main Text** | `#252A27` | High-contrast charcoal for titles, descriptions, and primary body copy |
| **Secondary Text** | `#6F766F` | Muted gray-green for subheadings, captions, breadcrumbs, specifications |
| **Product Cards** | `#FFFFFF` | Crisp white cards with subtle shadow and border elevation |
| **Borders** | `#E5DED1` | Warm neutral hairline borders for dividers, input outlines, and tables |
| **Secondary Accent Surfaces**| `#E8EFE7` | Soft sage for category chips, badges, banners, and subtle highlights |
| **Sale Badges** | `#B83D32` | Muted red for discounts, deal badges, and countdown indicators |
| **Success States** | `#28734D` | Earthy emerald green for order confirmed, verified checkmarks, in-stock badges |
| **Input Backgrounds** | `#FFFFFF` | Clean white input surfaces with `#E5DED1` borders and `#173D30` focus rings |

## 4. AWS Academy Learner Lab Constraints & Compatibility

1. **IAM Role Restrictions**: In AWS Academy Learner Lab, creating custom IAM roles or policies is restricted (`iam:CreateRole` often denied).
   - *Compatibility Solution*: All CDK constructs are parameterized to use the pre-created `arn:aws:iam::<AccountId>:role/LabRole` when running inside Learner Lab.
2. **CloudFront Distribution Restrictions**: CloudFront may have quota limitations in some Learner Lab accounts.
   - *Compatibility Solution*: The frontend can be hosted directly on an S3 website bucket or CloudFront, with local Vite preview for development.
3. **Cognito User Pools**: Supported in us-east-1 under Learner Lab.
4. **DynamoDB On-Demand (PAY_PER_REQUEST)**: Fully supported and zero idle cost.
5. **API Gateway HTTP API (v2)**: Lower latency and 70% cheaper than REST API, with native JWT authorizers.
