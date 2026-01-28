// Twilio Video Configuration

export const TWILIO_CONFIG = {
  // Twilio Account SID and Auth Token (get from Twilio Console)
  // These should be stored in environment variables for security
  accountSid: process.env.REACT_APP_TWILIO_ACCOUNT_SID || '',
  authToken: process.env.REACT_APP_TWILIO_AUTH_TOKEN || '',
  
  // API endpoint to generate access tokens
  tokenUrl: process.env.REACT_APP_TWILIO_TOKEN_URL || 'http://localhost:4000/api/twilio/token',
};

export const TWILIO_VIDEO_CONFIG = {
  // Video constraints
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 24 },
  },
  
  // Room configuration
  maxParticipants: 2,
  dominantSpeaker: true,
  networkQuality: true,
  
  // Bandwidth configuration
  bandwidthProfile: {
    video: {
      mode: 'collaboration',
      maxSubscriptionBitrate: 2500000,
      dominantSpeakerPriority: 'high',
    },
  },
};

export const TWILIO_UI_CONFIG = {
  // UI Controls
  showParticipantList: true,
  showScreenShare: true,
  showChat: true,
  showSettings: true,
  
  // Display settings
  layout: 'grid', // 'grid' or 'speaker'
  maxVisibleParticipants: 4,
  
  // Theme
  theme: {
    mode: 'dark',
    primaryColor: '#4f46e5',
    backgroundColor: '#1a1a1a',
    surfaceColor: '#2d2d2d',
    textColor: '#ffffff',
  },
};

export const TWILIO_TEXT_CONFIG = {
  // Button labels
  joinButton: 'Join Session',
  leaveButton: 'Leave Session',
  muteAudio: 'Mute Audio',
  unmuteAudio: 'Unmute Audio',
  toggleVideo: 'Toggle Video',
  shareScreen: 'Share Screen',
  stopSharing: 'Stop Sharing',
  chat: 'Chat',
  participants: 'Participants',
  settings: 'Settings',
  
  // Status messages
  connecting: 'Connecting to session...',
  connected: 'Connected',
  disconnected: 'Disconnected',
  reconnecting: 'Reconnecting...',
  
  // Error messages
  connectionError: 'Failed to connect to the session',
  permissionError: 'Please allow camera and microphone access',
  joinError: 'Failed to join the session',
};
