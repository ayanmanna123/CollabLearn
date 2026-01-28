import crypto from 'crypto';

// In-memory storage for OTPs (in production, use Redis or database)
const otpStore = new Map();

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP code
 */
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Store OTP with expiration (5 minutes)
 * @param {string} phoneNumber - User's phone number
 * @param {string} otp - Generated OTP
 */
function storeOTP(phoneNumber, otp) {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore.set(phoneNumber, {
    otp,
    expiresAt,
    attempts: 0
  });
  
  // Clean up expired OTPs periodically
  setTimeout(() => {
    otpStore.delete(phoneNumber);
  }, 5 * 60 * 1000);
}

/**
 * Verify OTP code
 * @param {string} phoneNumber - User's phone number
 * @param {string} providedOTP - OTP provided by user
 * @returns {boolean} True if OTP is valid
 */
function verifyOTP(phoneNumber, providedOTP) {
  const storedData = otpStore.get(phoneNumber);
  
  if (!storedData) {
    return false;
  }
  
  // Check if OTP has expired
  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(phoneNumber);
    return false;
  }
  
  // Check if too many attempts (max 3)
  if (storedData.attempts >= 3) {
    otpStore.delete(phoneNumber);
    return false;
  }
  
  // Increment attempts
  storedData.attempts++;
  
  // Verify OTP
  if (storedData.otp === providedOTP) {
    otpStore.delete(phoneNumber); // Remove OTP after successful verification
    return true;
  }
  
  return false;
}

/**
 * Check if OTP exists for phone number
 * @param {string} phoneNumber - User's phone number
 * @returns {boolean} True if OTP exists and is not expired
 */
function hasActiveOTP(phoneNumber) {
  const storedData = otpStore.get(phoneNumber);
  if (!storedData) {
    return false;
  }
  
  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(phoneNumber);
    return false;
  }
  
  return true;
}

/**
 * Get remaining time for OTP (in seconds)
 * @param {string} phoneNumber - User's phone number
 * @returns {number} Remaining time in seconds
 */
function getOTPExpiryTime(phoneNumber) {
  const storedData = otpStore.get(phoneNumber);
  if (!storedData) {
    return 0;
  }
  
  const remaining = Math.max(0, Math.floor((storedData.expiresAt - Date.now()) / 1000));
  return remaining;
}

export {
  generateOTP,
  storeOTP,
  verifyOTP,
  hasActiveOTP,
  getOTPExpiryTime
};
