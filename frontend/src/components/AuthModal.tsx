import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldAlert, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    login, 
    register,
    confirmSignUp,
    resendCode,
    forgotPassword,
    confirmForgotPassword
  } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'signin' | 'register' | 'forgot' | 'verify'>(
    authModalMode === 'register' ? 'register' : 'signin'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Sync mode when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode === 'register' ? 'register' : 'signin');
      setErrorMessage(null);
      setIsLoading(false);
    }
  }, [isAuthModalOpen, authModalMode]);

  // Handle resend countdown timer
  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!isAuthModalOpen) return null;

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // 1. VERIFICATION CODE CONFIRMATION
    if (mode === 'verify') {
      if (verificationCode.trim().length !== 6) {
        setErrorMessage('Verification code must be exactly 6 digits.');
        return;
      }
      setIsLoading(true);
      const res = await confirmSignUp(name, email, verificationCode.trim(), password);
      setIsLoading(false);
      if (res.success) {
        showToast('Cognito email verified! You are now logged in.', 'success');
      } else {
        setErrorMessage(res.error || 'Invalid or expired confirmation code.');
      }
      return;
    }

    // 2. FORGOT PASSWORD (STEP 1: REQUEST CODE, STEP 2: CONFIRM NEW PASSWORD)
    if (mode === 'forgot') {
      if (!verificationCode) {
        // Step 1: Request reset code
        setIsLoading(true);
        const res = await forgotPassword(email);
        setIsLoading(false);
        if (res.success) {
          showToast('Password reset code sent to your email.', 'info');
          setCooldown(30);
        } else {
          setErrorMessage(res.error || 'Failed to request reset code.');
        }
      } else {
        // Step 2: Confirm reset with code
        if (newPassword.length < 8) {
          setErrorMessage('New password must be at least 8 characters.');
          return;
        }
        setIsLoading(true);
        const res = await confirmForgotPassword(email, verificationCode.trim(), newPassword);
        setIsLoading(false);
        if (res.success) {
          showToast('Password reset successfully! Please sign in with your new password.', 'success');
          setMode('signin');
          setPassword(newPassword);
          setVerificationCode('');
        } else {
          setErrorMessage(res.error || 'Failed to reset password.');
        }
      }
      return;
    }

    // 3. SIGN IN
    if (mode === 'signin') {
      if (!password) {
        setErrorMessage('Please enter your password.');
        return;
      }
      setIsLoading(true);
      const res = await login(email, password, email.includes('admin') ? 'admin' : 'customer');
      setIsLoading(false);
      if (res.success) {
        showToast('Welcome back! Successfully authenticated via AWS Cognito.', 'success');
      } else if (res.requiresVerification) {
        setMode('verify');
        setErrorMessage('Please verify your email before signing in.');
        showToast('A confirmation code was sent to your email.', 'info');
      } else {
        setErrorMessage(res.error || 'Sign in failed. Check your email and password.');
      }
      return;
    }

    // 4. REGISTER
    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password.length < 8) {
        setErrorMessage('Password must be at least 8 characters.');
        return;
      }
      setIsLoading(true);
      const res = await register(name.trim(), email.trim(), password);
      setIsLoading(false);
      if (res.success) {
        setMode('verify');
        setCooldown(30);
        showToast('Verification code sent to your email via Cognito.', 'info');
      } else {
        setErrorMessage(res.error || 'Registration failed.');
      }
    }
  };

  const handleResendCode = async () => {
    if (cooldown > 0) return;
    setIsLoading(true);
    setErrorMessage(null);
    const res = await resendCode(email);
    setIsLoading(false);
    if (res.success) {
      setCooldown(30);
      showToast('A new 6-digit verification code has been dispatched to your email.', 'info');
    } else {
      setErrorMessage(res.error || 'Failed to resend confirmation code.');
    }
  };

  // Instant demo helper buttons
  const handleQuickCustomer = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    await login('alex.woods@canopy.shop', 'DemoPass123!', 'customer');
    setIsLoading(false);
    showToast('Signed in as Demo Customer (Alex Woods).', 'success');
  };

  const handleQuickAdmin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    await login('admin@canopy.store', 'AdminPass123!', 'admin');
    setIsLoading(false);
    showToast('Signed in as Store Administrator (Elena Vance).', 'success');
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
              {mode === 'verify'
                ? 'Verify Email Address'
                : mode === 'forgot'
                ? 'Reset Password'
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
        <div className="p-6 space-y-5 bg-[#F7F4ED]">
          
          {/* Quick Demo Access Bar */}
          {mode !== 'verify' && mode !== 'forgot' && (
            <div className="p-3.5 bg-[#E8EFE7] rounded-2xl border border-[#E5DED1] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#173D30] block">
                Instant Demo Access (AWS Academy Review)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleQuickCustomer}
                  className="bg-white border border-[#E5DED1] hover:border-[#173D30] p-2.5 rounded-xl text-left text-xs text-[#252A27] font-semibold transition-all hover:shadow-xs disabled:opacity-50"
                >
                  <span className="block text-[#173D30] font-bold">Customer Demo</span>
                  <span className="text-[10px] text-[#6F766F]">Alex Woods</span>
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleQuickAdmin}
                  className="bg-white border border-[#E5DED1] hover:border-[#F27A36] p-2.5 rounded-xl text-left text-xs text-[#252A27] font-semibold transition-all hover:shadow-xs disabled:opacity-50"
                >
                  <span className="block text-[#F27A36] font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-[#F27A36]" /> Admin Portal
                  </span>
                  <span className="text-[10px] text-[#6F766F]">Elena Vance</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Mode 1: Verification */}
            {mode === 'verify' && (
              <div className="space-y-3">
                <p className="text-xs text-[#6F766F] leading-relaxed">
                  Amazon Cognito has sent a 6-digit confirmation code to <strong>{email}</strong>. Please enter it below to confirm your account.
                </p>
                <div>
                  <label htmlFor="auth-verification-code" className="text-xs font-semibold uppercase text-[#252A27] block mb-1">
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#6F766F] absolute left-3.5 top-3" />
                    <input
                      id="auth-verification-code"
                      type="text"
                      placeholder="e.g. 123456"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      required
                      className="w-full bg-white border border-[#E5DED1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#252A27] focus:outline-hidden focus:border-[#173D30] focus:ring-1 focus:ring-[#173D30]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#6F766F]">Didn't receive the email?</span>
                  <button
                    type="button"
                    disabled={cooldown > 0 || isLoading}
                    onClick={handleResendCode}
                    className="font-bold text-[#173D30] hover:text-[#F27A36] disabled:opacity-50 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>{cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mode 2: Forgot Password */}
            {mode === 'forgot' && (
              <div className="space-y-3">
                <p className="text-xs text-[#6F766F]">
                  Enter your account email to receive a password recovery verification code.
                </p>
                <div>
                  <label htmlFor="auth-forgot-email" className="text-xs font-semibold uppercase text-[#252A27] block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6F766F] absolute left-3.5 top-3" />
                    <input
                      id="auth-forgot-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white border border-[#E5DED1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#252A27] focus:outline-hidden focus:border-[#173D30]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="auth-forgot-code" className="text-xs font-semibold uppercase text-[#252A27] block mb-1">
                    Verification Code (if received)
                  </label>
                  <input
                    id="auth-forgot-code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white border border-[#E5DED1] rounded-xl px-4 py-2.5 text-sm text-[#252A27] focus:outline-hidden focus:border-[#173D30]"
                  />
                </div>

                {verificationCode && (
                  <div>
                    <label htmlFor="auth-forgot-newpass" className="text-xs font-semibold uppercase text-[#252A27] block mb-1">
                      New Password (min 8 chars)
                    </label>
                    <input
                      id="auth-forgot-newpass"
                      type="password"
                      placeholder="Enter new strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white border border-[#E5DED1] rounded-xl px-4 py-2.5 text-sm text-[#252A27] focus:outline-hidden focus:border-[#173D30]"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Mode 3 & 4: Sign In and Register */}
            {mode !== 'verify' && mode !== 'forgot' && (
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
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="auth-password-input" className="text-xs font-semibold uppercase text-[#252A27]">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setErrorMessage(null);
                        }}
                        className="text-xs text-[#173D30] hover:text-[#F27A36] font-semibold"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#6F766F] absolute left-3.5 top-3" />
                    <input
                      id="auth-password-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-white border border-[#E5DED1] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#252A27] focus:outline-hidden focus:border-[#173D30] focus:ring-1 focus:ring-[#173D30]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-3 text-[#6F766F] hover:text-[#252A27]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {mode === 'register' && (
                    <span className="text-[10px] text-[#6F766F] mt-1 block">
                      Must be at least 8 characters with numbers and lowercase letters.
                    </span>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#F27A36] hover:bg-[#df6621] disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin text-white" />}
              <span>
                {mode === 'verify'
                  ? 'Confirm Code & Enter Store'
                  : mode === 'forgot'
                  ? (verificationCode ? 'Reset Password & Proceed' : 'Send Reset Code')
                  : mode === 'signin'
                  ? 'Sign In with Cognito'
                  : 'Create Account & Verify Email'}
              </span>
            </button>
          </form>

          {/* Navigation Mode Links */}
          <div className="text-center text-xs text-[#6F766F] pt-2 border-t border-[#E5DED1] space-y-1">
            {mode === 'signin' && (
              <p>
                New to Canopy?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                  }}
                  className="font-bold text-[#173D30] hover:underline"
                >
                  Create an account
                </button>
              </p>
            )}
            {mode === 'register' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                  }}
                  className="font-bold text-[#173D30] hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
            {(mode === 'forgot' || mode === 'verify') && (
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                }}
                className="font-bold text-[#173D30] hover:underline"
              >
                ← Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
