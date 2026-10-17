import React from 'react';
import { Trees, Shield, Cloud, Lock, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#173D30] text-white mt-16 border-t border-[#235544]">
      {/* Top Value Banner */}
      <div className="border-b border-[#235544] bg-[#112d23] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#173D30] rounded-xl text-[#F27A36]">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#E8EFE7]">100% Certified Sustainable</h4>
              <p className="text-xs text-[#E8EFE7]/80 mt-1">Every product meets strict carbon-neutral and ethical craftsmanship standards.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#173D30] rounded-xl text-[#F27A36]">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#E8EFE7]">AWS Serverless Architecture</h4>
              <p className="text-xs text-[#E8EFE7]/80 mt-1">Powered by AWS Lambda, DynamoDB, API Gateway, and Cognito User Pools.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#173D30] rounded-xl text-[#F27A36]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#E8EFE7]">Simulated Safe Payments</h4>
              <p className="text-xs text-[#E8EFE7]/80 mt-1">Zero real money charged. Multi-step idempotency checkout demonstration.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#173D30] rounded-xl text-[#F27A36]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#E8EFE7]">Learner Lab Compliant</h4>
              <p className="text-xs text-[#E8EFE7]/80 mt-1">Built specifically for AWS Academy us-east-1 permissions and LabRole policies.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#F27A36] mb-4">Storefront</h5>
            <ul className="space-y-2 text-xs text-[#E8EFE7]/90">
              <li><a href="#catalog" className="hover:text-white transition-colors">Catalog & Categories</a></li>
              <li><a href="#bestsellers" className="hover:text-white transition-colors">Bestsellers & Deals</a></li>
              <li><a href="#new" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#specifications" className="hover:text-white transition-colors">Sustainably Sourced</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#F27A36] mb-4">Customer Care</h5>
            <ul className="space-y-2 text-xs text-[#E8EFE7]/90">
              <li><a href="#orders" className="hover:text-white transition-colors">Orders & Tracking</a></li>
              <li><a href="#returns" className="hover:text-white transition-colors">30-Day Return Policy</a></li>
              <li><a href="#shipping" className="hover:text-white transition-colors">Carbon-Neutral Shipping</a></li>
              <li><a href="#help" className="hover:text-white transition-colors">Help Center & FAQ</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#F27A36] mb-4">Cloud Computing Stack</h5>
            <ul className="space-y-2 text-xs text-[#E8EFE7]/90">
              <li><span className="text-white font-semibold">Backend:</span> AWS Lambda (Node.js 20)</li>
              <li><span className="text-white font-semibold">Database:</span> Amazon DynamoDB (Single Table)</li>
              <li><span className="text-white font-semibold">Auth:</span> Amazon Cognito User Pools</li>
              <li><span className="text-white font-semibold">IaC:</span> AWS CDK v2 (TypeScript)</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#F27A36] mb-4">Security & Privacy</h5>
            <ul className="space-y-2 text-xs text-[#E8EFE7]/90">
              <li className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[#28734D]" /> 256-bit SSL Transport</li>
              <li>No Real Payment Data Stored</li>
              <li>Principle of Least Privilege IAM</li>
              <li>Idempotent Transactions</li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-12 pt-8 border-t border-[#235544] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#E8EFE7]/70">
          <div className="flex items-center gap-2">
            <Trees className="w-4 h-4 text-[#F27A36]" />
            <span>&copy; {new Date().getFullYear()} <strong>CANOPY</strong> Forest Retail. Educational Cloud Computing Capstone Project.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Notice</span>
            <span>•</span>
            <span>Terms of Demonstration</span>
            <span>•</span>
            <span className="text-[#F27A36] font-semibold">Simulated Payments Sandbox</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
