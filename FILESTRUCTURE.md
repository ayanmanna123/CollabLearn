# CollabLearn Project File Structure

## Root Directory
```
CollabLearn/
├── Backend/                    # Node.js Express backend server
├── Frontend/                   # React Vite frontend application
├── README.md                   # Project overview and setup instructions
└── TODO.md                     # Project task list and roadmap
```

## Backend Structure
```
Backend/
├── config/                     # Configuration files
│   ├── cloudinary.js          # Cloudinary image/video upload configuration
│   ├── db.js                  # MongoDB database connection setup
│   ├── env.js                 # Environment variables validation
│   └── socket.js              # Socket.IO server configuration
│
├── controllers/               # Request handlers and business logic
│   ├── achievement.controller.js     # Achievement management
│   ├── ai.controller.js              # AI-powered features
│   ├── auth.controller.js            # Authentication and user registration
│   ├── availability.controller.js    # Mentor availability scheduling
│   ├── booking.controller.js         # Session booking management
│   ├── category.controller.js        # Category management
│   ├── connection.controller.js      # User connections/networking
│   ├── contact.controller.js         # Contact form handling
│   ├── forum.controller.js           # Discussion forum management
│   ├── freeTrial.controller.js       # Free trial period management
│   ├── journal.controller.js         # Learning journal functionality
│   ├── karmaPoints.controller.js     # Karma points system
│   ├── mentor.controller.js          # Mentor profile management
│   ├── mentorKarma.controller.js     # Mentor karma tracking
│   ├── message.controller.js         # Messaging system
│   ├── payments.controller.js        # Payment processing
│   ├── phoneAuth.controller.js       # Phone number authentication
│   ├── reviews.controller.js         # Review and rating system
│   ├── session.controller.js         # Learning session management
│   ├── skills.controller.js          # Skill management
│   ├── task.controller.js            # Task assignment and tracking
│   ├── twilio.controller.js          # Twilio SMS integration
│   ├── upload.controller.js          # File upload handling
│   └── user.controller.js            # User profile management
│
├── middleware/                # Express middleware functions
│   ├── auth.middleware.js            # JWT authentication middleware
│   ├── error.middleware.js           # Global error handling
│   ├── upload.middleware.js          # File upload middleware
│   └── validation.middleware.js      # Request validation middleware
│
├── models/                    # Mongoose data models
│   ├── Availability.js               # Mentor availability slots
│   ├── Session.model.js              # Learning session records
│   ├── achievement.model.js          # User achievements
│   ├── availability.model.js         # Availability schedule
│   ├── booking.model.js              # Session bookings
│   ├── connection.model.js           # User connections
│   ├── forum.model.js                # Forum posts and discussions
│   ├── journalEntry.model.js         # Journal entries
│   ├── journalNotes.model.js         # Journal notes
│   ├── karmaPoints.model.js          # Karma points transactions
│   ├── mentorProfile.model.js        # Mentor profile information
│   ├── mentorSkills.model.js         # Mentor skills mapping
│   ├── message.model.js              # Chat messages
│   ├── notification.model.js         # User notifications
│   ├── payment.model.js              # Payment records
│   ├── review.model.js               # Reviews and ratings
│   ├── skill.model.js                # Skill definitions
│   ├── task.model.js                 # Task definitions
│   └── user.model.js                 # User accounts
│
├── routes/                    # API route definitions
│   ├── achievement.routes.js         # Achievement endpoints
│   ├── ai.routes.js                  # AI service endpoints
│   ├── auth.routes.js                # Authentication endpoints
│   ├── availability.routes.js        # Availability endpoints
│   ├── booking.routes.js             # Booking endpoints
│   ├── category.routes.js            # Category endpoints
│   ├── connection.routes.js          # Connection endpoints
│   ├── contact.routes.js             # Contact endpoints
│   ├── debug.routes.js               # Debug/testing endpoints
│   ├── forum.routes.js               # Forum endpoints
│   ├── freeTrial.routes.js           # Free trial endpoints
│   ├── journal.routes.js             # Journal endpoints
│   ├── karma.routes.js               # Karma system endpoints
│   ├── karmaPoints.routes.js         # Karma points endpoints
│   ├── mentor.routes.js              # Mentor endpoints
│   ├── mentorKarma.routes.js         # Mentor karma endpoints
│   ├── message.routes.js             # Message/chat endpoints
│   ├── notifications.routes.js       # Notification endpoints
│   ├── payments.routes.js            # Payment endpoints
│   ├── phoneAuth.routes.js           # Phone auth endpoints
│   ├── reviews.routes.js             # Review endpoints
│   ├── session.routes.js             # Session endpoints
│   ├── skills.routes.js              # Skills endpoints
│   ├── streamChat.routes.js          # Stream chat integration
│   ├── task.routes.js                # Task endpoints
│   ├── twilio.routes.js              # Twilio SMS endpoints
│   ├── upload.routes.js              # Upload endpoints
│   └── user.routes.js                # User endpoints
│
├── scripts/                   # Utility scripts
│   ├── addRandomRatings.js           # Script to add test ratings
│   └── createTestData.js             # Script to generate test data
│
├── services/                  # Business logic services
│   ├── emailService.js               # Email sending functionality
│   ├── karmaService.js               # Karma points calculation
│   ├── mentorRatingService.js        # Mentor rating calculations
│   ├── otpService.js                 # OTP generation and validation
│   └── smsService.js                 # SMS sending functionality
│
├── socket/                    # Real-time WebSocket handlers
│   ├── chatSocketHandlers.js         # Chat message handling
│   └── socketHandlers.js             # General socket event handlers
│
├── src/main/java/com/mentorlink/     # Java Spring Boot components (forum)
│   ├── controller/
│   │   └── ForumController.java      # Forum REST controller
│   ├── dto/
│   │   ├── AddAnswerRequest.java     # Answer request DTO
│   │   ├── CreateQuestionRequest.java # Question creation DTO
│   │   └── UpdateQuestionRequest.java # Question update DTO
│   ├── entity/
│   │   ├── Answer.java               # Answer entity
│   │   └── Question.java             # Question entity
│   ├── repository/
│   │   └── QuestionRepository.java   # Question data repository
│   └── service/
│       └── QuestionService.java      # Question business logic
│
├── utils/                     # Utility functions and helpers
│   ├── errorHandler.js               # Custom error classes
│   ├── generateToken.js              # JWT token generation
│   └── zodSchemas.js                 # Validation schemas
│
├── .env                       # Environment variables (local)
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── README.md                  # Backend documentation
├── TWILIO_SMS_SETUP.md        # Twilio SMS setup guide
├── add-phone-numbers.js       # Phone number utility script
├── index.js                   # Main server entry point
├── package-lock.json          # NPM dependency lock file
└── package.json               # NPM package configuration
```

## Frontend Structure
```
Frontend/
├── src/                       # Source code directory
│   ├── assets/                # Static assets and components
│   │   ├── NotFoundAnimation.jsx     # 404 animation component
│   │   └── NotFoundPage.jsx          # 404 error page
│   │
│   ├── components/            # Reusable React components
│   │   ├── Chat/                     # Chat system components
│   │   │   ├── ActiveChat.jsx        # Active chat window
│   │   │   ├── ChatHeader.jsx        # Chat header component
│   │   │   ├── ChatInput.jsx         # Message input field
│   │   │   ├── ChatList.jsx          # Chat conversations list
│   │   │   ├── ChatMessage.jsx       # Individual message component
│   │   │   ├── ChatSidebar.jsx       # Chat sidebar navigation
│   │   │   ├── EmojiPicker.jsx       # Emoji selection component
│   │   │   └── MessageStatus.jsx     # Message delivery status
│   │   │
│   │   ├── Common/                   # Shared/common components
│   │   │   └── ProtectedRoute.jsx    # Route protection wrapper
│   │   │
│   │   ├── Debug/                    # Debugging components
│   │   │   └── DebugPanel.jsx        # Debug information panel
│   │   │
│   │   ├── Explore/                  # Explore/search components
│   │   │   ├── CategoryCard.jsx      # Category display card
│   │   │   ├── FilterBar.jsx         # Search filtering controls
│   │   │   ├── MentorCard.jsx        # Mentor profile card
│   │   │   ├── MentorFilters.jsx     # Mentor search filters
│   │   │   ├── MentorList.jsx        # Mentor listing component
│   │   │   ├── SearchBar.jsx         # Search input component
│   │   │   └── SortOptions.jsx       # Sorting controls
│   │   │
│   │   ├── Forum/                    # Forum discussion components
│   │   │   ├── Answer.jsx            # Forum answer component
│   │   │   └── Question.jsx          # Forum question component
│   │   │
│   │   ├── Journal/                  # Learning journal components
│   │   │   ├── JournalEditor.jsx     # Journal entry editor
│   │   │   ├── JournalEntry.jsx      # Journal entry display
│   │   │   ├── JournalList.jsx       # Journal entries list
│   │   │   └── JournalStats.jsx      # Journal statistics
│   │   │
│   │   ├── KarmaPointsCard/          # Karma points display
│   │   │   └── KarmaPointsCard.jsx   # Karma points card component
│   │   │
│   │   ├── MentorDashboard/          # Mentor dashboard components
│   │   │   ├── AvailabilityForm.jsx  # Availability scheduling form
│   │   │   ├── BookingCalendar.jsx   # Booking calendar view
│   │   │   ├── MentorAnalytics.jsx   # Mentor performance analytics
│   │   │   ├── SessionHistory.jsx    # Past sessions history
│   │   │   └── UpcomingSessions.jsx  # Upcoming sessions list
│   │   │
│   │   ├── MentorProfile/            # Mentor profile components
│   │   │   ├── MentorAbout.jsx       # About section
│   │   │   ├── MentorAvailability.jsx # Availability display
│   │   │   ├── MentorHeader.jsx      # Profile header
│   │   │   ├── MentorReviews.jsx     # Reviews section
│   │   │   └── MentorSkills.jsx      # Skills display
│   │   │
│   │   ├── StudentChat/              # Student chat components
│   │   │   ├── ChatInterface.jsx     # Main chat interface
│   │   │   ├── ContactList.jsx       # Contacts/friends list
│   │   │   ├── Conversation.jsx      # Conversation view
│   │   │   ├── MessageBubble.jsx     # Message bubble component
│   │   │   ├── OnlineIndicator.jsx   # Online status indicator
│   │   │   └── TypingIndicator.jsx   # Typing status indicator
│   │   │
│   │   ├── StudentDashboard/         # Student dashboard components
│   │   │   ├── BookedSessions.jsx    # Student's booked sessions
│   │   │   ├── LearningProgress.jsx  # Progress tracking
│   │   │   ├── RecommendedMentors.jsx # Mentor recommendations
│   │   │   └── UpcomingBookings.jsx  # Upcoming bookings
│   │   │
│   │   ├── StudentForum/             # Student forum components
│   │   │   ├── AnswerForm.jsx        # Answer submission form
│   │   │   ├── QuestionForm.jsx      # Question creation form
│   │   │   └── QuestionList.jsx      # Questions listing
│   │   │
│   │   ├── StudentMessages/          # Student messaging components
│   │   │   └── MessagesPanel.jsx     # Messages panel component
│   │   │
│   │   ├── StudentProfileCompletion/ # Profile setup components
│   │   │   └── ProfileCompletion.jsx # Profile completion wizard
│   │   │
│   │   ├── StudentTasks/             # Task management components
│   │   │   ├── TaskAssignment.jsx    # Task assignment form
│   │   │   └── TaskList.jsx          # Tasks listing
│   │   │
│   │   ├── TaskDashboard/            # Task dashboard components
│   │   │   ├── CompletedTasks.jsx    # Completed tasks view
│   │   │   ├── PendingTasks.jsx      # Pending tasks view
│   │   │   ├── TaskCard.jsx          # Individual task card
│   │   │   ├── TaskDetails.jsx       # Task details modal
│   │   │   ├── TaskFilter.jsx        # Task filtering controls
│   │   │   ├── TaskForm.jsx          # Task creation/editing form
│   │   │   ├── TaskProgress.jsx      # Task progress tracking
│   │   │   └── TaskStatistics.jsx    # Task analytics
│   │   │
│   │   ├── animations/               # Animation components
│   │   │   ├── Confetti.jsx          # Confetti celebration effect
│   │   │   ├── FloatingElements.jsx  # Floating decorative elements
│   │   │   ├── LoadingSpinner.jsx    # Loading spinner animation
│   │   │   └── ProgressBar.jsx       # Progress bar animation
│   │   │
│   │   ├── auth/                     # Authentication components
│   │   │   ├── ForgotPassword.jsx    # Password reset form
│   │   │   ├── LoginForm.jsx         # Login form component
│   │   │   ├── LogoutButton.jsx      # Logout button component
│   │   │   ├── OtpVerification.jsx   # OTP verification form
│   │   │   └── SignupForm.jsx        # Registration form
│   │   │
│   │   ├── AchievementToast.jsx      # Achievement notification toast
│   │   ├── KarmaTest.jsx             # Karma points testing component
│   │   ├── LandingFooter.jsx         # Landing page footer
│   │   ├── LandingLoader.jsx         # Landing page loader
│   │   ├── LandingNavbar.jsx         # Landing page navigation
│   │   ├── LoadingScreen.jsx         # Full-screen loading component
│   │   ├── NotificationBell.jsx      # Notification bell icon
│   │   ├── NotificationCenter.jsx     # Notification center panel
│   │   ├── PageLoader.jsx            # Page-level loader
│   │   ├── ScrollToTop.tsx           # Scroll to top button
│   │   ├── SessionTimer.jsx          # Session countdown timer
│   │   └── UserProfileSidebar.jsx    # User profile sidebar
│   │
│   ├── config/                # Configuration files
│   │   └── api.js                    # API client configuration
│   │
│   ├── context/               # React context providers
│   │   ├── AuthContext.jsx           # Authentication state management
│   │   └── SocketContext.jsx         # Socket.IO connection management
│   │
│   ├── hooks/                 # Custom React hooks
│   │   └── useAuth.jsx               # Authentication hook
│   │
│   ├── lib/                   # Library and utility functions
│   │   └── utils.js                  # General utility functions
│   │
│   ├── mockData/              # Mock/test data
│   │   └── mentors.js                # Sample mentor data
│   │
│   ├── pages/                 # Page components
│   │   ├── About.jsx                 # About page
│   │   ├── Achievements.jsx          # Achievements page
│   │   ├── AdminDashboard.jsx        # Admin control panel
│   │   ├── BookingConfirmation.jsx   # Booking confirmation page
│   │   ├── BookingPage.jsx           # Session booking page
│   │   ├── Calendar.jsx              # Calendar view
│   │   ├── ChatPage.jsx              # Chat application page
│   │   ├── Contact.jsx               # Contact form page
│   │   ├── Dashboard.jsx             # Main dashboard
│   │   ├── DebugPage.jsx             # Debug/testing page
│   │   ├── EditProfile.jsx           # Profile editing page
│   │   ├── Explore.jsx               # Explore mentors page
│   │   ├── Forum.jsx                 # Forum discussion page
│   │   ├── Home.jsx                  # Homepage/Landing page
│   │   ├── Journal.jsx               # Learning journal page
│   │   ├── KarmaPoints.jsx           # Karma points page
│   │   ├── Login.jsx                 # Login page
│   │   ├── MentorAvailability.jsx    # Mentor availability page
│   │   ├── MentorBooking.jsx         # Mentor booking page
│   │   ├── MentorDashboard.jsx       # Mentor dashboard page
│   │   ├── MentorProfile.jsx         # Mentor profile page
│   │   ├── Mentors.jsx               # Mentors listing page
│   │   ├── Messages.jsx              # Messages page
│   │   ├── NotFound.jsx              # 404 error page
│   │   ├── Notifications.jsx         # Notifications page
│   │   ├── Payments.jsx              # Payment processing page
│   │   ├── PrivacyPolicy.jsx         # Privacy policy page
│   │   ├── Profile.jsx               # User profile page
│   │   ├── Register.jsx              # Registration page
│   │   ├── ResetPassword.jsx         # Password reset page
│   │   ├── Reviews.jsx               # Reviews page
│   │   ├── ScheduleSession.jsx       # Session scheduling page
│   │   ├── SearchResults.jsx         # Search results page
│   │   ├── Sessions.jsx              # Sessions management page
│   │   ├── Settings.jsx              # User settings page
│   │   ├── StudentDashboard.jsx      # Student dashboard page
│   │   ├── StudentProfile.jsx        # Student profile page
│   │   ├── Tasks.jsx                 # Tasks management page
│   │   ├── TermsOfService.jsx        # Terms of service page
│   │   ├── VerifyPhone.jsx           # Phone verification page
│   │   └── VideoCall.jsx             # Video call page
│   │
│   ├── services/              # Service layer for API calls
│   │   ├── achievementService.js     # Achievement API service
│   │   ├── authService.js            # Authentication API service
│   │   ├── availabilityService.js    # Availability API service
│   │   ├── bookingService.js         # Booking API service
│   │   ├── chatService.js            # Chat API service
│   │   ├── forumService.js           # Forum API service
│   │   ├── journalService.js         # Journal API service
│   │   ├── karmaService.js           # Karma points API service
│   │   ├── mentorService.js          # Mentor API service
│   │   ├── messageService.js         # Message API service
│   │   ├── notificationService.js    # Notification API service
│   │   ├── paymentService.js         # Payment API service
│   │   ├── reviewService.js          # Review API service
│   │   ├── sessionService.js         # Session API service
│   │   ├── taskService.js            # Task API service
│   │   └── userService.js            # User API service
│   │
│   ├── utils/                 # Utility functions
│   │   ├── constants.js              # Application constants
│   │   └── helpers.js                # Helper functions
│   │
│   ├── App.jsx                # Main application component
│   ├── index.css              # Global CSS styles
│   └── main.jsx               # React application entry point
│
├── .env.development           # Development environment variables
├── .env.example               # Environment variables template
├── .env.local                 # Local development environment
├── .env.production            # Production environment variables
├── .gitignore                 # Git ignore rules
├── README.md                  # Frontend documentation
├── eslint.config.js           # ESLint configuration
├── index.html                 # HTML template
├── package-lock.json          # NPM dependency lock file
├── package.json               # NPM package configuration
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── vercel.json                # Vercel deployment configuration
└── vite.config.js             # Vite build configuration
```

## Key Technologies Used

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **Validation**: Zod
- **File Upload**: Cloudinary
- **SMS**: Twilio
- **Payments**: Stripe/Payment gateway
- **Email**: Nodemailer

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **Real-time**: Socket.IO Client
- **Video Calls**: ZegoCloud
- **HTTP Client**: Axios
- **Form Validation**: Zod
- **Animations**: Framer Motion/Custom

## Project Architecture Overview

This is a full-stack MERN (MongoDB, Express, React, Node.js) application with real-time features. The backend serves as a RESTful API with WebSocket support, while the frontend provides a responsive user interface with real-time chat capabilities.

The application supports mentor-student interactions, session booking, task management, forums, learning journals, and a karma points system for gamification.