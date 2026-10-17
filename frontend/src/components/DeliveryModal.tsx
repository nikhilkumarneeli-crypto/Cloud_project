import React, { useState } from 'react';
import { MapPin, X, Check } from 'lucide-react';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (location: string) => void;
}

const PRESET_LOCATIONS = [
  { city: 'Seattle', zip: '98101', state: 'WA' },
  { city: 'Portland', zip: '97201', state: 'OR' },
  { city: 'San Francisco', zip: '94102', state: 'CA' },
  { city: 'Austin', zip: '78701', state: 'TX' },
  { city: 'Denver', zip: '80202', state: 'CO' },
  { city: 'New York', zip: '10001', state: 'NY' }
];

export const DeliveryModal: React.FC<DeliveryModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation
}) => {
  const [customZip, setCustomZip] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customZip.trim().length >= 5) {
      onSelectLocation(`ZIP ${customZip.trim()}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full border border-[#E5DED1] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delivery-modal-title"
      >
        {/* Header */}
        <div className="bg-[#173D30] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-[#F27A36]" />
            <h3 id="delivery-modal-title" className="font-semibold text-lg">Choose Your Delivery Location</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
            aria-label="Close delivery modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 bg-[#F7F4ED]">
          <p className="text-sm text-[#6F766F]">
            Delivery options and delivery speeds may vary based on your geographic location.
          </p>

          {/* Quick Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#252A27] block mb-2">
              Popular Shipping Hubs
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_LOCATIONS.map((loc) => {
                const label = `${loc.city}, ${loc.state} ${loc.zip}`;
                const isSelected = currentLocation === label;
                return (
                  <button
                    key={loc.zip}
                    onClick={() => {
                      onSelectLocation(label);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-sm transition-all ${
                      isSelected
                        ? 'border-[#173D30] bg-[#E8EFE7] text-[#173D30] font-semibold ring-1 ring-[#173D30]'
                        : 'border-[#E5DED1] bg-white text-[#252A27] hover:border-[#173D30]/40'
                    }`}
                  >
                    <span>{loc.city}, {loc.state}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#173D30]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom ZIP Form */}
          <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-[#E5DED1]">
            <label htmlFor="delivery-zip-input" className="text-xs font-semibold uppercase tracking-wider text-[#252A27] block mb-2">
              Or Enter a US ZIP Code
            </label>
            <div className="flex gap-2">
              <input
                id="delivery-zip-input"
                type="text"
                placeholder="e.g. 98101"
                maxLength={5}
                value={customZip}
                onChange={(e) => setCustomZip(e.target.value.replace(/\D/g, ''))}
                className="flex-1 bg-white border border-[#E5DED1] rounded-xl px-4 py-2 text-sm text-[#252A27] focus:outline-hidden focus:border-[#173D30] focus:ring-1 focus:ring-[#173D30]"
              />
              <button
                type="submit"
                disabled={customZip.trim().length < 5}
                className="bg-[#F27A36] hover:bg-[#df6621] disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
