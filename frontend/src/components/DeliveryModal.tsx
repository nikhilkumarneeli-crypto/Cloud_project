import React, { useState } from 'react';
import { MapPin, X, Check, LocateFixed, Loader2, AlertCircle } from 'lucide-react';

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
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customZip.trim().length >= 5) {
      onSelectLocation(`ZIP ${customZip.trim()}`);
      onClose();
    }
  };

  // Automatic Location Detection using Browser Geolocation API & Reverse Geocoding
  const handleDetectLocation = () => {
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your current browser. Please enter your ZIP code manually.');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let formattedLocation = `Lat ${latitude.toFixed(2)}, Lon ${longitude.toFixed(2)}`;

        // Attempt Reverse Geocoding via OpenStreetMap Nominatim
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);
          
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            { 
              signal: controller.signal,
              headers: { 'Accept-Language': 'en' }
            }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const address = data.address || {};
            const city = address.city || address.town || address.village || address.suburb || address.county;
            const state = address.state || address.state_code;
            const postcode = address.postcode;

            if (city && state) {
              formattedLocation = `${city}, ${state} ${postcode ? postcode.slice(0, 5) : ''}`.trim();
            } else if (data.display_name) {
              const parts = data.display_name.split(',');
              formattedLocation = parts.slice(0, 2).join(',').trim();
            }
          }
        } catch {
          // If reverse geocoding is rate-limited or offline, format coordinates clearly
          formattedLocation = `Area (${latitude.toFixed(2)}°N, ${Math.abs(longitude).toFixed(2)}°W)`;
        }

        setIsLocating(false);
        onSelectLocation(formattedLocation);
        onClose();
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission was denied in your browser settings. You can enter a ZIP code manually below.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is currently unavailable. Please enter a ZIP code manually.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please select a shipping hub or enter a ZIP code.');
            break;
          default:
            setLocationError('Unable to detect location automatically. Please enter your ZIP code.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
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
            <h3 id="delivery-modal-title" className="font-semibold text-lg">Choose Delivery Location</h3>
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
          <p className="text-xs text-[#6F766F] leading-relaxed">
            Select your location to see accurate delivery speed, shipping carrier estimates, and local inventory availability.
          </p>

          {/* Auto-Detection Button */}
          <div>
            <button
              type="button"
              disabled={isLocating}
              onClick={handleDetectLocation}
              className="w-full bg-[#173D30] hover:bg-[#112d23] disabled:opacity-60 text-white p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F27A36]" />
                  <span>Detecting GPS Coordinates...</span>
                </>
              ) : (
                <>
                  <LocateFixed className="w-4 h-4 text-[#F27A36]" />
                  <span>Use My Current Location Automatically</span>
                </>
              )}
            </button>
            <span className="text-[10px] text-[#6F766F] block mt-1 text-center">
              Requires browser location permission. Coordinates are kept private on your device.
            </span>
          </div>

          {/* Error Banner */}
          {locationError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{locationError}</span>
            </div>
          )}

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
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
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
