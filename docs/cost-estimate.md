# AWS Cost Estimation & Free Tier Analysis

Region: `us-east-1` (US East, N. Virginia)
Estimated Monthly Volume: 5,000 monthly active users, 25,000 orders/month, 500,000 API requests/month.

## Service Breakdown

| Service | Free Tier Allowance | Estimated Project Usage | Monthly Cost |
| :--- | :--- | :--- | :--- |
| **AWS Lambda** | 1M free requests/mo + 3.2M sec compute | 500,000 requests, 128MB, ~150ms avg | **$0.00** (Within Free Tier) |
| **Amazon DynamoDB** | 25 GB storage, 25 WCU, 25 RCU | ~1 GB data, On-Demand (PAY_PER_REQUEST) | **$0.00 - $0.20** |
| **Amazon API Gateway** | 1M HTTP API calls/mo for first 12 mos | 500,000 calls | **$0.00** (Free Tier) / ~$0.50 |
| **Amazon Cognito** | 50,000 MAU free forever | ~5,000 MAU | **$0.00** |
| **Amazon S3** | 5 GB standard storage, 20,000 GETs | ~500 MB assets & images | **$0.00 - $0.05** |
| **Amazon CloudFront** | 1 TB data transfer out free forever | ~10 GB transfer | **$0.00** |
| **Amazon CloudWatch** | 5 GB log data ingestion free | ~500 MB logs | **$0.00** |
| **Total Estimated Cost** | - | - | **$0.00 / month** (Within Free Tier & Learner Lab Budget) |

> [!NOTE]
> In AWS Academy Learner Lab, students receive a \$100 credit. Because our architecture is 100% serverless with zero persistent EC2 instances, NAT Gateways, or provisioned databases, the entire monthly footprint operates safely at virtually \$0.
