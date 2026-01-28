import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import forgotPasswordImg from '../assets/Forgot password-bro.svg';
import { getApiUrl } from '../config/backendConfig';
import './Login.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const API_URL = getApiUrl().replace(/\/$/, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email.trim()) {
        throw new Error('Please enter your email address');
      }

      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Left Side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 relative z-10">
        <div className="w-full max-w-md">
          {!success ? (
            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <Mail className="w-12 h-12 text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
                <p className="text-gray-400">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-300 block mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                      disabled={isLoading}
                    />
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
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              <p className="text-center text-gray-400 text-sm mt-6">
                Remember your password?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Log in
                </button>
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
              <p className="text-gray-400 mb-6">
                We've sent a password reset link to <span className="font-semibold text-white">{email}</span>. 
                Please check your email and click the link to reset your password.
              </p>
              <p className="text-gray-500 text-sm mb-6">
                The link will expire in 1 hour.
              </p>

              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded font-semibold transition-colors"
              >
                Back to Login
              </button>

              <p className="text-gray-400 text-sm mt-6">
                Didn't receive the email?{' '}
                <button
                  onClick={() => setSuccess(false)}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Try again
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Forgot Password Illustration */}
      <div className="hidden lg:flex lg:w-1/2 h-screen relative z-10 items-center justify-center p-8">
        <img 
          src={forgotPasswordImg} 
          alt="Forgot Password" 
          className="w-full max-w-2xl h-auto object-contain"
        />
      </div>
    </div>
  );
}
