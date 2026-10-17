import React from 'react';
import { Sparkles, Truck, ShieldCheck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <aside aria-label="Store Announcements" className="bg-[#112d23] text-[#E8EFE7] text-xs font-medium py-1.5 px-4 border-b border-[#235544]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-[#F27A36]" />
          <span>Free Carbon-Neutral Shipping on orders over $50</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 mx-auto sm:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-[#F27A36]" />
          <span>Forest Retail Collection: Use code <strong className="text-white bg-[#173D30] px-1.5 py-0.5 rounded border border-[#235544] tracking-wider">CANOPY10</strong> for 10% off</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[#E8EFE7]/80">
          <ShieldCheck className="w-3.5 h-3.5 text-[#28734D]" />
          <span>AWS Serverless Demo • Learner Lab Sandbox</span>
        </div>
      </div>
    </aside>
  );
};
