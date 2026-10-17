# Canopy — AWS Serverless E-Commerce Storefront

An enterprise-grade, serverless shopping cart web application built with React, TypeScript, Tailwind CSS, AWS Lambda, Amazon API Gateway, Amazon DynamoDB, and Amazon Cognito.

Crafted with the **Premium Forest Retail** visual identity.

---

## 🌲 Visual Identity: Premium Forest Retail Palette

- **Primary Navigation**: `#173D30` (Deep Forest Green)
- **Main Page Background**: `#F7F4ED` (Warm Ivory)
- **Primary CTA Buttons**: `#F27A36` (Tangerine Orange)
- **Main Text**: `#252A27` (Charcoal)
- **Secondary Text**: `#6F766F` (Muted Gray-Green)
- **Product Cards**: `#FFFFFF` (Crisp White)
- **Borders & Dividers**: `#E5DED1` (Warm Neutral)
- **Secondary Accent Surfaces**: `#E8EFE7` (Soft Sage)
- **Sale Badges**: `#B83D32` (Muted Red)
- **Success States**: `#28734D` (Forest Emerald)
- **Input Backgrounds**: `#FFFFFF` (Pure White)

---

## 🏗️ Architecture Overview

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons + shadcn/ui components
- **Backend**: AWS Lambda (Node.js 20.x + TypeScript) + AWS SDK v3
- **API**: Amazon API Gateway HTTP API (v2) with Cognito JWT authorizer
- **Database**: Amazon DynamoDB with single-table / partitioned entities and conditional writes
- **Authentication**: Amazon Cognito User Pool & App Client
- **Infrastructure as Code**: AWS CDK v2 with TypeScript (configured for AWS Academy Learner Lab `LabRole`)
- **Simulated Payment**: Safe, idempotent payment simulation with transactional inventory decrements

---

## 📂 Project Structure

```text
cloud/
├── frontend/             # React + Vite + Tailwind storefront
│   ├── src/
│   │   ├── components/   # UI components (Header, Footer, ProductCard, CartDrawer, etc.)
│   │   ├── pages/        # Views (Home, Catalog, ProductDetail, Cart, Checkout, Auth, Admin)
│   │   ├── contexts/     # Auth, Cart, Wishlist, Notification state providers
│   │   ├── services/     # API Gateway client & Cognito auth services
│   │   ├── types/        # TypeScript interfaces & domain models
│   │   └── data/         # Realistic 20+ product catalog seed data
├── backend/              # AWS Lambda microservices (TypeScript)
│   ├── src/
│   │   ├── handlers/     # Lambda handlers (products, cart, checkout, orders, admin)
│   │   ├── services/     # DynamoDB data access & business logic
│   │   ├── repositories/ # Entity repository layer
│   │   └── validators/   # Input validation & schema rules
├── infrastructure/       # AWS CDK TypeScript infrastructure
│   ├── bin/              # CDK app entry point
│   ├── lib/              # CDK Stack definitions (DynamoDB, Cognito, API Gateway, S3)
│   └── test/             # CDK snapshot & assertion tests
├── tests/                # Automated unit and integration tests
├── docs/                 # Architecture, API, Security, and Cost docs
└── README.md
```

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies & run frontend locally
cd frontend
npm install
npm run dev

# 2. Run backend tests
cd ../backend
npm test
```
