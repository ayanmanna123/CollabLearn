import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../config/backendConfig';
import resetPasswordImg from '../reset-password.svg';
import './Login.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  const API_URL = getApiUrl().replace(/\/$/, '');

  useEffect(() => {
    const validateToken = async () => {
      try {
        const tokenParam = searchParams.get('token');
        const emailParam = searchParams.get('email');

        if (!tokenParam || !emailParam) {
          setError('Invalid reset link. Missing token or email.');
          setIsValidating(false);
          return;
        }

        setToken(tokenParam);
        setEmail(emailParam);

        const response = await fetch(
          `${API_URL}/auth/validate-reset-token?token=${tokenParam}&email=${encodeURIComponent(emailParam)}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Invalid or expired reset link');
          setIsValidating(false);
          return;
        }

        setTokenValid(true);
        setIsValidating(false);
      } catch (err) {
        setError('Error validating reset link: ' + err.message);
        setIsValidating(false);
      }
    };

    validateToken();
  }, [searchParams, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!newPassword.trim()) {
        throw new Error('Password is required');
      }

      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          email,
          newPassword,
          confirmPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="login-bg h-screen bg-gradient-to-br from-[#000000] via-[#0a1929] to-[#001e3c] relative overflow-hidden flex flex-col lg:flex-row">
        <div className="moon"></div>
        <div className="stars">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="star"></div>
          ))}
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 relative z-10">
          <div className="w-full max-w-md text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Validating reset link...</p>
          </div>
        </div>
        <div className="hidden lg:flex lg:w-1/2 h-screen relative z-10 items-center justify-center p-8">
          <img
            src={resetPasswordImg}
            alt="Reset Password"
            className="w-full max-w-2xl h-auto object-contain"
          />
        </div>
      </div>
    );
  }

  if (!tokenValid && error) {
    return (
      <div className="login-bg h-screen bg-gradient-to-br from-[#000000] via-[#0a1929] to-[#001e3c] relative overflow-hidden flex flex-col lg:flex-row">
        <div className="moon"></div>
        <div className="stars">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="star"></div>
          ))}
        </div>

        <button
          onClick={() => navigate('/login')}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Back to Login</span>
        </button>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 relative z-10">
          <div className="w-full max-w-md">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Invalid Reset Link</h2>
              <p className="text-gray-400 mb-6">{error}</p>

              <button
                onClick={() => navigate('/forgot-password')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors mb-4"
              >
                Request New Reset Link
              </button>

              <button
                onClick={() => navigate('/login')}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/2 h-screen relative z-10 items-center justify-center p-8">
          <img
            src={resetPasswordImg}
            alt="Reset Password"
            className="w-full max-w-2xl h-auto object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="login-bg h-screen bg-gradient-to-br from-[#000000] via-[#0a1929] to-[#001e3c] relative overflow-hidden flex flex-col lg:flex-row">
      {/* Animated Moon */}
      <div className="moon"></div>

      {/* Animated Stars Background */}
      <div className="stars">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="star"></div>
        ))}
      </div>

      {/* Back to Login Button */}
      <button
        onClick={() => navigate('/login')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-medium">Back to Login</span>
      </button>

      {/* Left Side - Reset Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 relative z-10">
        <div className="w-full max-w-md">
          {!success ? (
            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <Lock className="w-12 h-12 text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Reset Your Password</h1>
                <p className="text-gray-400">
                  Enter your new password below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-300 block mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">At least 6 characters</p>
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-2">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded font-semibold transition-colors ${
                    isLoading
                      ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Resetting...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful</h2>
              <p className="text-gray-400 mb-6">
                Your password has been reset successfully. You can now log in with your new password.
              </p>

              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded font-semibold transition-colors"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Profile Carousel */}
      <div className="hidden lg:flex lg:w-1/2 h-screen relative z-10 items-center justify-center p-8">
        <img
          src={resetPasswordImg}
          alt="Reset Password"
          className="w-full max-w-2xl h-auto object-contain"
        />
      </div>
    </div>
  );
}
