import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PhoneLoginForm = ({ onBack, onNavigateToRegister, role, setRole, isLoading }) => {
  const navigate = useNavigate();
  const [phoneData, setPhoneData] = useState({
    countryCode: '+91',
    phoneNumber: '',
    otp: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = "http://localhost:4000/api";

  // Country codes for the dropdown
  const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+7', country: 'Russia' },
    { code: '+971', country: 'UAE' }
  ];

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    setPhoneData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setOtpLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/phone/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneData.countryCode + phoneData.phoneNumber
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      console.log("OTP sent successfully:", data);
      setOtpSent(true);
      
      // In development, log the OTP for testing
      if (data.otp) {
        console.log("Development OTP:", data.otp);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error sending OTP:", error);
    } finally {
      setOtpLoading(false);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/auth/phone/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneData.countryCode + phoneData.phoneNumber,
          otp: phoneData.otp
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      // Save user + token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Phone login successful:", data);

      // Redirect to appropriate dashboard
      const dashboardUrl = data.user.role === "mentor" ? "/mentor/dashboard" : "/student/dashboard";
      navigate(dashboardUrl, { replace: true });
    } catch (error) {
      setError(error.message);
      console.error("Error logging in with phone:", error);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setOtpLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/phone/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneData.countryCode + phoneData.phoneNumber
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      console.log("OTP resent successfully:", data);
      
      // In development, log the OTP for testing
      if (data.otp) {
        console.log("Development OTP:", data.otp);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error resending OTP:", error);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="text-left">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Main Heading */}
      <h1 className="text-3xl font-bold text-white mb-2">Log into Ment2Be</h1>
      
      {/* Subtitle */}
      <p className="text-gray-400 mb-8">
        New to Ment2Be? Sign up as a{" "}
        <button 
          onClick={() => onNavigateToRegister('student')}
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          student
        </button>{" "}
        or apply to be a{" "}
        <button 
          onClick={() => onNavigateToRegister('mentor')}
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          mentor
        </button>
      </p>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-700 text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {/* Role Toggle */}
      <div className="flex text-gray-400 font-medium text-sm mb-6">
        <button
          onClick={() => setRole("student")}
          className={`px-4 pb-2 ${role === "student" ? "border-b-2 border-blue-500 text-white" : "text-gray-500"}`}
        >
          I'm a student
        </button>
        <button
          onClick={() => setRole("mentor")}
          className={`px-4 pb-2 ${role === "mentor" ? "border-b-2 border-blue-500 text-white" : "text-gray-500"}`}
        >
          I'm a mentor
        </button>
      </div>

      {/* Phone Login Form */}
      <form onSubmit={!otpSent ? handleSendOtp : handlePhoneLogin} className="space-y-5">
        {!otpSent ? (
          <>
            {/* Phone Number Input */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">Phone Number</label>
              <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <div className="relative">
                  <select
                    name="countryCode"
                    value={phoneData.countryCode}
                    onChange={handlePhoneChange}
                    className="appearance-none bg-gray-800 border border-gray-700 rounded text-white pl-3 pr-8 py-3 focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code} {country.country}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Phone Number Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    name="phoneNumber"
                    type="tel"
                    value={phoneData.phoneNumber}
                    onChange={handlePhoneChange}
                    required
                    className="w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={otpLoading}
              className={`w-full py-3 rounded font-semibold transition-colors ${
                otpLoading 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-gray-600 hover:bg-gray-700'
              } text-white`}
            >
              {otpLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending OTP...
                </div>
              ) : (
                'Send OTP'
              )}
            </button>
          </>
        ) : (
          <>
            {/* OTP Input */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">Enter OTP</label>
              <p className="text-xs text-gray-400 mb-3">OTP sent to {phoneData.phoneNumber}</p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  name="otp"
                  type="text"
                  value={phoneData.otp}
                  onChange={handlePhoneChange}
                  required
                  maxLength="6"
                  className="w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded font-semibold transition-colors ${
                isLoading 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-gray-600 hover:bg-gray-700'
              } text-white`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify & Log in'
              )}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={otpLoading}
              className="w-full text-sm text-blue-400 hover:text-blue-300 py-2 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {otpLoading ? 'Resending...' : 'Didn\'t receive OTP? Resend'}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default PhoneLoginForm;
