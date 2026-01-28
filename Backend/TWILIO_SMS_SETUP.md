# Twilio SMS Setup for Real OTP Delivery

## Overview
This guide explains how to configure Twilio SMS service to send real OTP messages to phone numbers for authentication.

## Prerequisites
1. Twilio account (sign up at https://www.twilio.com/)
2. A Twilio phone number with SMS capabilities
3. Node.js backend server running

## Setup Steps

### 1. Get Twilio Credentials
1. Log in to your Twilio Console
2. Go to Account > API Keys & Tokens
3. Copy your Account SID and Auth Token

### 2. Get a Twilio Phone Number
1. In Twilio Console, go to Phone Numbers > Buy a Number
2. Purchase a phone number with SMS capabilities
3. Note the phone number in E.164 format (e.g., +1234567890)

### 3. Configure Environment Variables
Add these to your `.env` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_actual_account_sid
TWILIO_AUTH_TOKEN=your_actual_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 4. Install Dependencies
Twilio is already installed in package.json, but if needed:
```bash
npm install twilio
```

## How It Works

### SMS Service Features
- **Development Mode**: If Twilio credentials are not configured, OTPs are logged to console
- **Production Mode**: Real SMS messages are sent via Twilio
- **Fallback**: If SMS fails, OTP is logged to console as backup
- **Phone Number Validation**: Validates and formats phone numbers to E.164 format

### OTP Message Template
```
Your Ment2Be verification code is: 123456. This code will expire in 5 minutes. Do not share this code with anyone.
```

## Testing

### Development Testing (No Twilio Required)
1. Ensure no Twilio credentials are set in `.env`
2. Test phone login - OTPs will appear in console logs
3. Frontend will receive OTP for testing

### Production Testing (Real SMS)
1. Configure Twilio credentials in `.env`
2. Restart the backend server
3. Test with real phone numbers
4. Check Twilio Console for message delivery status

## Cost Considerations
- Twilio charges per SMS message sent
- Typical cost: ~$0.0079 per message in US
- Consider implementing rate limiting to control costs

## Troubleshooting

### Common Issues
1. **"Twilio credentials not configured"**: Add credentials to `.env` file
2. **"Phone number format invalid"**: Ensure phone numbers include country code (+91, +1, etc.)
3. **SMS not delivered**: Check Twilio Console for error details
4. **High costs**: Implement rate limiting and monitoring

### Debug Mode
The system automatically falls back to console logging if:
- Twilio credentials are missing
- SMS sending fails
- Network issues occur

## Security Notes
- Keep Twilio credentials secure and never commit to version control
- Use environment variables for all sensitive data
- Implement rate limiting to prevent abuse
- Monitor SMS usage for unusual activity

## Rate Limiting
The OTP service already includes:
- 5-minute OTP expiration
- Maximum 3 verification attempts
- 60-second cooldown between resends
- Active OTP tracking

## Next Steps
1. Configure Twilio credentials in `.env`
2. Test with development mode first
3. Enable production mode for real SMS
4. Monitor costs and usage in Twilio Console
