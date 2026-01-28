// ZegoCloud UI Customization Configuration - Matching Dashboard Theme

export const ZEGO_UI_CONFIG = {
  // Basic UI Controls
  showScreenSharingButton: true,
  showTextChat: true,
  showUserList: true,
  showPinButton: true,
  showLayoutButton: true,
  showRoomDetailsButton: false,
  showTurnOffRemoteCameraButton: false,
  showTurnOffRemoteMicrophoneButton: false,
  showRemoveUserButton: false,
  
  // Video/Audio Controls
  showMyCameraToggleButton: true,
  showMyMicrophoneToggleButton: true,
  showAudioVideoSettingsButton: true,
  turnOnMicrophoneWhenJoining: false, // Microphone off by default
  turnOnCameraWhenJoining: false, // Camera off by default
  
  // Display Settings
  showRoomTimer: true,
  showConnectionStatus: true,
  showSoundWavesInAudioMode: true,
  showNonVideoUser: true,
  showOnlyAudioUser: true,
  
  // Layout Options
  layout: "Auto", // "Auto", "Sidebar", "Grid"
  maxUsers: 2,
  
  // ZegoCloud Theme Configuration - Matching Dashboard (Black #000000, Dark Gray #121212)
  theme: {
    mode: 'dark', // 'dark' or 'light'
    primaryColor: '#6366f1', // Indigo - matches dashboard accent
  },
};

export const ZEGO_STYLE_CONFIG = {
  // Main container - Match dashboard black background
  backgroundColor: '#000000',
  color: '#ffffff',
  
  // Video containers - Match dashboard card color
  videoContainer: {
    backgroundColor: '#121212',
    borderRadius: '12px',
    border: '1px solid #374151',
  },
  
  // Control bar at bottom - Dark with transparency
  controlBar: {
    backgroundColor: 'rgba(18, 18, 18, 0.98)',
    borderRadius: '30px',
    padding: '12px 20px',
    backdropFilter: 'blur(10px)',
    border: '1px solid #374151',
  },
  
  // Individual buttons - Indigo accent
  button: {
    backgroundColor: '#6366f1',
    borderRadius: '50%',
    border: 'none',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
    transition: 'all 0.2s ease',
    color: '#ffffff',
  },
  
  // Button hover states
  buttonHover: {
    backgroundColor: '#818cf8',
    transform: 'scale(1.05)',
  },
  
  // Chat panel - Match dashboard card
  chatContainer: {
    backgroundColor: '#121212',
    borderRadius: '12px',
    border: '1px solid #374151',
  },
  
  // Chat messages - Slightly lighter than background
  chatMessage: {
    backgroundColor: '#1f1f1f',
    borderRadius: '8px',
    padding: '8px 12px',
    marginBottom: '8px',
    border: '1px solid #2d2d2d',
  },
  
  // User list - Match dashboard card
  userListContainer: {
    backgroundColor: '#121212',
    borderRadius: '12px',
    border: '1px solid #374151',
  },
  
  // Screen sharing - Indigo accent border
  screenShareContainer: {
    backgroundColor: '#000000',
    borderRadius: '12px',
    border: '2px solid #6366f1',
  },
};

export const ZEGO_TEXT_CONFIG = {
  // Dialog messages
  leaveConfirmDialogInfo: 'Are you sure you want to leave this mentoring session?',
  removeUserConfirmDialogInfo: 'Remove this participant from the session?',
  
  // Permission tooltips
  microphonePermissionDeniedTooltip: 'Please allow microphone access to participate in the session',
  cameraPermissionDeniedTooltip: 'Please allow camera access to participate in the session',
  screenSharingPermissionDeniedTooltip: 'Please allow screen sharing to share your screen',
  
  // Button labels
  joinRoomButton: 'Join Session',
  leaveRoomButton: 'Leave Session',
  muteButton: 'Mute',
  unmuteButton: 'Unmute',
  cameraOnButton: 'Camera On',
  cameraOffButton: 'Camera Off',
  screenShareButton: 'Share Screen',
  chatButton: 'Chat',
  participantsButton: 'Participants',
  
  // Status messages
  connecting: 'Connecting to session...',
  connected: 'Connected to session',
  reconnecting: 'Reconnecting...',
  disconnected: 'Disconnected from session',
  
  // Chat placeholders
  chatInputPlaceholder: 'Type your message here...',
  chatSendButton: 'Send',
  
  // Error messages
  networkError: 'Network connection error. Please check your internet connection.',
  cameraError: 'Unable to access camera. Please check your camera permissions.',
  microphoneError: 'Unable to access microphone. Please check your microphone permissions.',
};

export const ZEGO_BRANDING_CONFIG = {
  logoURL: '', // Add your logo URL here
  companyName: 'K23DX Mentoring Platform',
  primaryColor: '#6366f1', // Indigo
  secondaryColor: '#818cf8', // Light Indigo
  accentColor: '#4f46e5', // Dark Indigo
};

// ZegoCloud Theme Presets
export const ZEGO_THEMES = {
  // Dark Theme - Matching Dashboard
  dark: {
    mode: 'dark',
    primaryColor: '#6366f1', // Indigo
    backgroundColor: '#000000', // Pure black like dashboard
    surfaceColor: '#121212', // Dark gray like dashboard cards
    textColor: '#ffffff',
    borderColor: '#374151',
  },
  
  // Light Theme  
  light: {
    mode: 'light',
    primaryColor: '#3b82f6', // Blue
    backgroundColor: '#ffffff',
    surfaceColor: '#f8fafc',
    textColor: '#1f2937',
    borderColor: '#e2e8f0',
  },
  
  // Purple Theme
  purple: {
    mode: 'dark',
    primaryColor: '#8b5cf6', // Purple
    backgroundColor: '#1e1b4b',
    surfaceColor: '#312e81',
    textColor: '#ffffff',
    borderColor: '#4c1d95',
  },
  
  // Blue Theme
  blue: {
    mode: 'dark',
    primaryColor: '#0ea5e9', // Sky Blue
    backgroundColor: '#0c4a6e',
    surfaceColor: '#075985',
    textColor: '#ffffff',
    borderColor: '#0284c7',
  },
  
  // Green Theme
  green: {
    mode: 'dark',
    primaryColor: '#10b981', // Emerald
    backgroundColor: '#064e3b',
    surfaceColor: '#065f46',
    textColor: '#ffffff',
    borderColor: '#059669',
  },
  
  // Red Theme
  red: {
    mode: 'dark',
    primaryColor: '#ef4444', // Red
    backgroundColor: '#7f1d1d',
    surfaceColor: '#991b1b',
    textColor: '#ffffff',
    borderColor: '#dc2626',
  },
};
