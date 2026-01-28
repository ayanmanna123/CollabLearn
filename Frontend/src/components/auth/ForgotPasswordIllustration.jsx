export default function ForgotPasswordIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <svg
        viewBox="0 0 400 400"
        className="w-full max-w-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle */}
        <circle cx="200" cy="200" r="180" fill="#1a2a4a" opacity="0.3" />

        {/* Envelope */}
        <g>
          {/* Envelope Body */}
          <rect x="80" y="140" width="240" height="160" rx="8" fill="none" stroke="#60a5fa" strokeWidth="2" />
          
          {/* Envelope Flap */}
          <path
            d="M 80 140 L 200 220 L 320 140"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Envelope Flap Fill */}
          <path
            d="M 80 140 L 200 220 L 320 140 L 320 160 L 200 240 L 80 160 Z"
            fill="#60a5fa"
            opacity="0.1"
          />
        </g>

        {/* Email Icon Inside Envelope */}
        <g>
          <circle cx="200" cy="210" r="35" fill="#60a5fa" opacity="0.15" />
          <path
            d="M 175 200 L 200 220 L 225 200"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="175" y1="200" x2="175" y2="220" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="225" y1="200" x2="225" y2="220" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Lock Icon */}
        <g>
          <circle cx="320" cy="100" r="45" fill="#3b82f6" opacity="0.1" />
          <rect x="305" y="85" width="30" height="35" rx="3" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
          <path
            d="M 310 85 Q 310 75 320 75 Q 330 75 330 85"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="320" cy="105" r="2.5" fill="#3b82f6" />
        </g>

        {/* Question Mark */}
        <g>
          <circle cx="80" cy="100" r="45" fill="#fbbf24" opacity="0.1" />
          <text
            x="80"
            y="115"
            fontSize="48"
            fontWeight="bold"
            fill="#fbbf24"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
          >
            ?
          </text>
        </g>

        {/* Decorative Lines */}
        <g stroke="#60a5fa" strokeWidth="1.5" opacity="0.3">
          <line x1="120" y1="320" x2="160" y2="320" strokeDasharray="5,5" />
          <line x1="240" y1="320" x2="280" y2="320" strokeDasharray="5,5" />
        </g>

        {/* Animated Arrow */}
        <g>
          <defs>
            <style>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
              }
              .floating-arrow {
                animation: float 3s ease-in-out infinite;
              }
            `}</style>
          </defs>
          <g className="floating-arrow">
            <path
              d="M 200 340 L 200 360 M 195 355 L 200 360 L 205 355"
              stroke="#60a5fa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        </g>

        {/* Text */}
        <text
          x="200"
          y="375"
          fontSize="14"
          fill="#9ca3af"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
        >
          We'll help you recover your account
        </text>
      </svg>
    </div>
  );
}
