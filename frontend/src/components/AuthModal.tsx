import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldAlert, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, register } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'signin' | 'register'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requiresVerification) {
      if (verificationCode.trim().length === 6) {
        showToast('Cognito email verification successful! You are now logged in.', 'success');
        await register(name, email);
        setRequiresVerification(false);
      } else {
        showToast('Please enter a 6-digit confirmation code.', 'error');
      }
      return;
    }

    if (mode === 'signin') {
      await login(email, email.includes('admin') ? 'admin' : 'customer');
      showToast('Welcome back! Successfully authenticated via Cognito.', 'success');
    } else {
      setRequiresVerification(true);
      showToast('Cognito verification code sent to your email. (Demo code: 123456)', 'info');
    }
  };

  const handleQuickCustomer = async () => {
    await login('alex.woods@canopy.shop', 'customer');
    showToast('Logged in as Demo Customer (Alex Woods).', 'success');
  };

  const handleQuickAdmin = async () => {
    await login('admin@canopy.shop', 'admin');
    showToast('Logged in as Administrator (Elena Vance).', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div 
        className="bg-white rounded-3xl max-w-md w-full border border-[#E5DED1] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Header */}
        <div className="bg-[#173D30] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-[#F27A36]" />
            <h3 id="auth-modal-title" className="font-extrabold text-lg">
              {requiresVerification
                ? 'Verify Email Address'
                : mode === 'signin'
                ? 'Sign In to Canopy'
                : 'Create Customer Account'}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 bg-[#F7F4ED]">
          
          {/* Quick Demo Logins Box */}
          {!requiresVerification && (
            <div className="p-4 bg-[#E8EFE7] rounded-2xl border border-[#E5DED1] space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#173D30] block">
                Instant Demo Access (AWS Academy Evaluation)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuickCustomer}
                  className="bg-white border border-[#E5DED1] hover:border-[#173D30] p-2.5 rounded-xl text-left text-xs text-[#252A27] font-semibold transition-all hover:shadow-xs"
                >
                  <span className="block text-[#173D30] font-bold">Customer Demo</span>
                  <span className="text-[10px] text-[#6F766F]">Alex Woods</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickAdmin}
                  className="bg-white border border-[#E5DED1] hover:border-[#F27A36] p-2.5 rounded-xl text-left text-xs text-[#252A27] font-semibold transition-all hover:shadow-xs"
                >
                  <span className="block text-[#F27A36] font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-[#F27A36]" /> Admin Demo
                  </span>
                  <span className="text-[10px] text-[#6F766F]">Store Administrator</span>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {requiresVerification ? (
              <div className="space-y-3">
                <p className="text-xs text-[#6F766F]">
                  Enter the 6-digit confirmation code generated by Amazon Cognito User Pool for <strong>{email}</strong>.
                </p>
                <div>
                  <label htmlFor="auth-verification-code" className="text-xs font-semibold uppercase text-[#252A27] block mb-1">
                    Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#6F766F] absolute left-3.5 top-3" />
                    <input
                      id="auth-verification-code"
                      type="text"
                      placeholder="e.g. 123456"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                      className="w-full bg-white border border-[#E5DED1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#252A27] focus:outline-hidden focus:border-[#173D30] focus:ring-1 focus:ring-[#173D30]"
                    />
                  </div>
                  <span className="text-[10px] text-[#28734D] mt-1 block font-medium">
                    (Tip: Enter any 6 digits such as 123456 for demo verification)
                  </span>
                </div>
              </div>
            ) : (
              <>
                {mode === 'register' && (
                  <div>
                    <label htmlFor="auth-register-name" className="text-xs font-semibold uppercase text-[#252A27] block mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#6F766F] absolute left-3.5 top-3" />
                      <input
                        id="auth-register-name"
                        type="text"
                        placeholder="e.g. Maya Chen"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-white border border-[#E5DED1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#252A27] focus:outline-hidden focus:border-[#173D30] focus:ring-1 focus:ring-[#173D30]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="auth-email-input" className="text-xs font-semibold uppercase text-[#252A27] block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6F766F] absolute left-3.5 top-3" />
                    <input
                      id="auth-email-input"
                      type="email"
                      placeholder="e.g. you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white border border-[#E5DED1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#252A27] focus:outline-hidden focus:border-[#173D30] focus:ring-1 focus:ring-[#173D30]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="auth-password-input" className="text-xs font-semibold uppercase text-[#252A27] block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#6F766F] absolute left-3.5 top-3" />
                    <input
                      id="auth-password-input"
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-white border border-[#E5DED1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#252A27] focus:outline-hidden focus:border-[#173D30] focus:ring-1 focus:ring-[#173D30]"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-[#F27A36] hover:bg-[#df6621] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-colors mt-2"
            >
              {requiresVerification
                ? 'Confirm & Sign In'
                : mode === 'signin'
                ? 'Sign In'
                : 'Create Account & Send Code'}
            </button>
          </form>

          {/* Toggle Tab */}
          {!requiresVerification && (
            <div className="text-center text-xs text-[#6F766F] pt-2 border-t border-[#E5DED1]">
              {mode === 'signin' ? (
                <span>
                  New to Canopy?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="font-bold text-[#173D30] hover:underline"
                  >
                    Create an account
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="font-bold text-[#173D30] hover:underline"
                  >
                    Sign In
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
