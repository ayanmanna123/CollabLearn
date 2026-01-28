import dotenv from 'dotenv';

dotenv.config();

/**
 * SMS Service for sending OTP messages via Twilio
 */
class SMSService {
  constructor() {
    // Twilio configuration
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    
    // Check if Twilio credentials are configured
    this.isConfigured = !!(this.accountSid && this.authToken && this.fromNumber);
    
    if (!this.isConfigured) {
      console.warn('Twilio credentials not configured. OTPs will be logged to console only.');
    }
  }

  /**
   * Send OTP via SMS using Twilio
   * @param {string} phoneNumber - Phone number to send OTP to
   * @param {string} otp - OTP code to send
   * @returns {Promise<boolean>} Success status
   */
  async sendOTP(phoneNumber, otp) {
    const message = `Your Ment2Be verification code is: ${otp}. This code will expire in 5 minutes. Do not share this code with anyone.`;

    // If Twilio is not configured, log to console (development mode)
    if (!this.isConfigured) {
      console.log(`[SMS SERVICE - DEV MODE] OTP for ${phoneNumber}: ${otp}`);
      return true;
    }

    try {
      // Import Twilio only when needed
      const twilio = (await import('twilio')).default;
      
      const client = twilio(this.accountSid, this.authToken);
      
      const result = await client.messages.create({
        body: message,
        from: this.fromNumber,
        to: phoneNumber
      });

      console.log(`SMS sent successfully to ${phoneNumber}. SID: ${result.sid}`);
      return true;
      
    } catch (error) {
      console.error('Error sending SMS via Twilio:', error.message);
      
      // Fallback to console logging if SMS fails
      console.log(`[SMS FALLBACK] OTP for ${phoneNumber}: ${otp}`);
      return false;
    }
  }

  /**
   * Validate phone number format for SMS
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} Valid phone number
   */
  validatePhoneNumber(phoneNumber) {
    // Remove spaces, dashes, and parentheses
    const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Check if it starts with + and has 10-15 digits
    const phoneRegex = /^\+?\d{10,15}$/;
    return phoneRegex.test(cleanNumber);
  }

  /**
   * Format phone number for Twilio (E.164 format)
   * @param {string} phoneNumber - Phone number to format
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(phoneNumber) {
    // Remove spaces, dashes, and parentheses
    let cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Ensure it starts with +
    if (!cleanNumber.startsWith('+')) {
      cleanNumber = '+' + cleanNumber;
    }
    
    return cleanNumber;
  }
}

export default new SMSService();
