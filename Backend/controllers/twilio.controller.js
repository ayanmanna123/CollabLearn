import twilio from 'twilio';

/**
 * Generate a Twilio Video access token
 * POST /api/twilio/token
 */
export const generateTwilioToken = async (req, res) => {
  try {
    const { roomName, userName, userId } = req.body;
    const userId_auth = req.user.id;

    // Validate required fields
    if (!roomName || !userName) {
      return res.status(400).json({
        success: false,
        message: 'Room name and user name are required'
      });
    }

    // Get Twilio credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;

    // Validate Twilio credentials
    if (!accountSid || !authToken || !apiKey || !apiSecret) {
      console.error('Missing Twilio credentials in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Twilio service is not properly configured'
      });
    }

    // Create Twilio JWT token
    const token = twilio.jwt.AccessToken(accountSid, apiKey, apiSecret);

    // Set token expiration (1 hour)
    token.ttl = 3600;

    // Add Video grant
    const videoGrant = new twilio.jwt.AccessToken.VideoGrant({
      room: roomName
    });
    token.addGrant(videoGrant);

    // Set identity
    token.identity = userId || userId_auth;

    // Generate token
    const jwt = token.toJwt();

    console.log(`✅ Generated Twilio token for user: ${userName} in room: ${roomName}`);

    res.status(200).json({
      success: true,
      token: jwt,
      message: 'Token generated successfully'
    });

  } catch (error) {
    console.error('Error generating Twilio token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate video token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
