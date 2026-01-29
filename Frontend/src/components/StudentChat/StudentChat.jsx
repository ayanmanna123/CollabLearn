import React, { useState, useEffect } from "react";
import { StudentChatHeader } from "./StudentChatHeader";
import { StudentChatMessages } from "./StudentChatMessages";
import { StudentChatInput } from "./StudentChatInput";
import { StudentContextSidebar } from "./StudentContextSidebar";
import { MentorList } from "./MentorList";
import { messageService } from "../../services/messageService";
import * as streamChatClient from "../../services/streamChatClient";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialMentors = [];
const initialMessages = {};

export function StudentChat() {
  const [mentors, setMentors] = useState(initialMentors);
  const [activeMentorId, setActiveMentorId] = useState(null);
  const [messagesByMentor, setMessagesByMentor] = useState(initialMessages);
  const [selectedType, setSelectedType] = useState("normal");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser.id || currentUser._id;
  const token = localStorage.getItem('token');
  const [channel, setChannel] = useState(null);

  // Mark messages as read when opening a mentor conversation
  useEffect(() => {
    const markRead = async () => {
      if (!activeMentorId) return;
      try {
        await messageService.markMessagesAsRead(activeMentorId);
      } catch (err) {
        console.error('Failed to mark messages as read:', err);
      } finally {
        setMentors(prev => prev.map(m =>
          m.id === activeMentorId ? { ...m, unreadCount: 0 } : m
        ));
      }
    };

    markRead();
  }, [activeMentorId]);

  // ------------------- STREAM CHAT INITIALIZATION ----------------------
  useEffect(() => {
    const initializeStreamChat = async () => {
      try {
        if (!token || !userId) return;

        const apiKey = import.meta.env.VITE_STREAM_CHAT_API_KEY;
        if (!apiKey) {
          console.error('Stream Chat API Key not configured');
          return;
        }

        // Fetch token from backend
        const tokenResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/stream/auth/token`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: currentUser.name || 'Student',
              image: currentUser.profilePicture || ''
            })
          }
        );

        if (!tokenResponse.ok) {
          throw new Error('Failed to get Stream Chat token');
        }

        const { apiKey: responseApiKey, token: streamToken } = await tokenResponse.json();

        // Connect to Stream Chat
        await streamChatClient.connectUser(
          responseApiKey || apiKey,
          userId,
          streamToken,
          {
            name: currentUser.name || 'Student',
            image: currentUser.profilePicture || ''
          }
        );

        console.log('✓ Stream Chat initialized for student');
      } catch (error) {
        console.error('Error initializing Stream Chat:', error);
        toast.error('Failed to initialize chat');
      }
    };

    initializeStreamChat();

    // Don't disconnect on unmount - keep the connection alive for other components
    return () => {
      // No cleanup needed - connection is shared across components
    };
  }, [token, userId]);

  // -------------------- FETCH CONVERSATIONS ------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [conversations, confirmedSessions, connections] = await Promise.all([
          messageService.getConversations(),
          messageService.getConfirmedSessions(),
          messageService.getStudentConnections()
        ]);

        const mentorIdsWithSessions = new Set(
          confirmedSessions.map(s => s.mentor?._id || s.mentor)
        );

        // Include ALL conversations, not just those with sessions
        const mentorsFromConversations = conversations
          .map(conv => {
            const p = conv.participant || conv.otherParticipant;
            const mentorId = p?._id || p || conv.participantId;
            const nextSession = confirmedSessions.find(
              s => (s.mentor?._id || s.mentor) === mentorId
            );

            return {
              id: mentorId,
              name: p?.name || conv.participantName || "Unknown Mentor",
              avatar: conv.profilePicture || p?.profilePicture || "",
              role: p?.role || conv.participantRole || "Mentor",
              company: p?.company || "",
              expertise: p?.skills || [],
              lastMessage: conv.lastMessage || "",
              lastMessageTime: new Date(conv.lastMessageTime || new Date()),
              unreadCount: conv.unreadCount || 0,
              isOnline: false,
              email: p?.email || conv.participantEmail,
              nextSession,
              hasConversation: true
            };
          });

        const existingIds = new Set(mentorsFromConversations.map(m => m.id));

        const mentorsFromSessions = confirmedSessions
          .filter(s => !existingIds.has(s.mentor?._id || s.mentor))
          .map(s => ({
            id: s.mentor._id,
            name: s.mentor.name,
            avatar: s.mentor.profilePicture || "",
            role: s.mentor.role || "Mentor",
            company: s.mentor.company || "",
            expertise: s.mentor.skills || [],
            lastMessage: "",
            lastMessageTime: new Date(),
            unreadCount: 0,
            isOnline: false,
            email: s.mentor.email,
            nextSession: s,
            hasConversation: false
          }));

        const mentorsFromConnections = (connections || [])
          .map((conn) => {
            const mentor = conn?.mentor;
            const mentorId = mentor?._id || mentor?.id;
            if (!mentorId) return null;

            return {
              id: mentorId,
              name: mentor?.name || "Unknown Mentor",
              avatar: mentor?.profilePicture || "",
              role: mentor?.role || "Mentor",
              company: mentor?.company || "",
              expertise: mentor?.skills || [],
              lastMessage: "",
              lastMessageTime: new Date(conn?.connectedAt || new Date()),
              unreadCount: 0,
              isOnline: false,
              email: mentor?.email,
              nextSession: null,
              hasConversation: false
            };
          })
          .filter(Boolean);

        // Deduplicate mentors by ID to prevent multiple chats with same mentor
        const mentorMap = new Map();
        
        // Add mentors from conversations first (they have conversation history)
        mentorsFromConversations.forEach(mentor => {
          mentorMap.set(mentor.id, mentor);
        });
        
        // Add mentors from sessions only if not already in map
        mentorsFromSessions.forEach(mentor => {
          if (!mentorMap.has(mentor.id)) {
            mentorMap.set(mentor.id, mentor);
          }
        });

        mentorsFromConnections.forEach((mentor) => {
          if (!mentorMap.has(mentor.id)) {
            mentorMap.set(mentor.id, mentor);
          }
        });
        
        const result = Array.from(mentorMap.values());
        setMentors(result);

        // Don't auto-select any mentor - let user click to start chatting
        // if (result.length && !activeMentorId) {
        //   setActiveMentorId(result[0].id);
        // }

      } catch (err) {
        console.error(err);
        toast.error("Failed to load conversations");
        setError("Failed to load conversations.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // -------------------- HANDLE ESCAPE KEY TO CLOSE CHAT ----
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && activeMentorId) {
        setActiveMentorId(null);
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [activeMentorId]);

  // -------------------- JOIN STREAM CHAT CHANNEL WHEN ACTIVE MENTOR CHANGES ----
  useEffect(() => {
    const joinChannel = async () => {
      console.log('joinChannel effect triggered:', {
        activeMentorId,
        token: !!token,
        userId
      });

      if (!activeMentorId || !token) {
        console.log('Skipping joinChannel - missing activeMentorId or token');
        return;
      }

      setIsLoadingMessages(true);
      try {
        // Create or get channel on backend
        const channelResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/stream/channels/upsert`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              studentId: userId,
              mentorId: activeMentorId
            })
          }
        );

        if (!channelResponse.ok) {
          throw new Error('Failed to create/get channel');
        }

        const { channelId } = await channelResponse.json();
        console.log('Channel created on backend:', channelId);

        // Get or create channel on client
        const ch = await streamChatClient.getOrCreateChannel(channelId, {
          name: `Student-Mentor: ${userId}-${activeMentorId}`,
          members: [userId, activeMentorId]
        });
        console.log('Channel created on client:', ch);

        setChannel(ch);
        console.log('Channel state set:', ch);

        // Load message history
        const messages = await streamChatClient.getMessages(ch, 50);
        const formatted = messages.map(m => ({
          id: m.id,
          content: m.text,
          text: m.text,
          sender: m.user.id === userId ? 'me' : 'mentor',
          type: m.type || '',
          custom_type: m.custom_type || 'normal',
          timestamp: new Date(m.created_at),
          created_at: m.created_at,
          status: 'delivered'
        }));

        setMessagesByMentor(prev => ({
          ...prev,
          [activeMentorId]: formatted
        }));

        // Listen to new messages
        streamChatClient.onMessageReceived(ch, (message) => {
          console.log('New message received:', message);
          
          setMessagesByMentor(prev => {
            const existing = prev[activeMentorId] || [];
            const isDuplicate = existing.some(m => m.id === message.id);
            if (isDuplicate) return prev;

            return {
              ...prev,
              [activeMentorId]: [...existing, {
                id: message.id,
                content: message.text,
                text: message.text,
                sender: message.user.id === userId ? 'me' : 'mentor',
                type: message.type || '',
                custom_type: message.custom_type || 'normal',
                timestamp: new Date(message.created_at),
                created_at: message.created_at,
                status: 'delivered'
              }]
            };
          });

          // Update mentor list with last message
          setMentors(prev => prev.map(mentor => {
            if (mentor.id === activeMentorId) {
              return {
                ...mentor,
                lastMessage: message.text,
                lastMessageTime: new Date(message.created_at)
              };
            }
            return mentor;
          }));
        });

        console.log('✓ Joined Stream Chat channel:', channelId);
      } catch (error) {
        console.error('Error joining channel:', error);
        toast.error('Failed to join chat channel');
      } finally {
        setIsLoadingMessages(false);
      }
    };

    joinChannel();
  }, [activeMentorId, userId, token]);

  // Note: Message loading is now handled in the joinChannel effect above

  const activeMentor = mentors.find(m => m.id === activeMentorId) || null;
  const messages = messagesByMentor[activeMentorId] || [];

  // ------------------------ SEND MESSAGE VIA STREAM CHAT --------------------------
  const handleSendMessage = async (messageContent) => {
    console.log('handleSendMessage called:', {
      activeMentorId,
      messageContent,
      channelExists: !!channel,
      channel: channel
    });

    if (!activeMentorId || !messageContent || !messageContent.trim() || !channel) {
      console.error('Cannot send message - missing required data:', {
        activeMentorId: !!activeMentorId,
        message: !!messageContent?.trim(),
        channel: !!channel
      });
      return;
    }

    // Check if Stream Chat client is connected
    if (!streamChatClient.isConnected()) {
      console.error('Stream Chat client not connected');
      toast.error('Chat connection lost. Please refresh the page.');
      return;
    }

    const tempId = Date.now().toString();
    const content = messageContent.trim();

    // Create optimistic message
    const optimisticMessage = {
      id: tempId,
      content,
      sender: "me",
      type: selectedType,
      timestamp: new Date(),
      status: "sending"
    };

    // Optimistic UI update
    setMessagesByMentor(prev => ({
      ...prev,
      [activeMentorId]: [...(prev[activeMentorId] || []), optimisticMessage]
    }));

    try {
      console.log('Step 1: Sending message via Stream Chat...');
      // Send message via Stream Chat
      const sentMessage = await streamChatClient.sendMessage(channel, content, {
        type: selectedType
      });
      console.log('Step 1 Success: Message sent via Stream Chat:', sentMessage);

      console.log('Step 2: Updating local state with Stream Chat message...');
      // Update message with actual ID from Stream Chat
      setMessagesByMentor(prev => ({
        ...prev,
        [activeMentorId]: (prev[activeMentorId] || []).map(m =>
          m.id === tempId 
            ? { 
                id: sentMessage.id,
                content: sentMessage.text,
                sender: 'me',
                type: sentMessage.type || 'normal',
                status: 'delivered',
                timestamp: new Date(sentMessage.created_at)
              } 
            : m
        )
      }));
      console.log('Step 2 Success: Local state updated');

      console.log('Step 3: Saving message to database...');
      // Also save to database for persistence
      const dbResponse = await messageService.sendMessage(
        activeMentorId,
        content,
        selectedType
      );
      console.log('Step 3 Success: Message saved to database:', dbResponse);

      console.log('Step 4: Updating mentor list...');
      // Update last message in mentor list
      setMentors(prev => 
        prev.map(mentor => 
          mentor.id === activeMentorId
            ? {
                ...mentor,
                lastMessage: content,
                lastMessageTime: new Date(),
                unreadCount: 0
              }
            : mentor
        )
      );
      console.log('Step 4 Success: Mentor list updated');

      setSelectedType("normal");
      console.log('✓ Message sent successfully!');
    } catch (err) {
      console.error("Send error:", {
        error: err,
        message: err.message,
        stack: err.stack,
        response: err.response
      });

      setMessagesByMentor(prev => ({
        ...prev,
        [activeMentorId]: (prev[activeMentorId] || []).map(m =>
          m.id === tempId ? { ...m, status: "error" } : m
        )
      }));

      toast.error("Failed to send message: " + (err.message || 'Unknown error'));
    }
  };

  // ---------------------- SKELETON LOADING COMPONENT ------------------------
  const SkeletonLoader = () => (
    <div className="flex h-full w-full bg-gradient-to-br from-gray-900 via-gray-950 to-black overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="hidden md:block w-[280px] flex-shrink-0 h-full border-r border-gray-700/30 glass-card">
        <div className="p-4">
          <div className="h-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl animate-pulse mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 mb-2 glass-card rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl animate-pulse mb-2"></div>
                <div className="h-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl animate-pulse w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Content Skeleton */}
      <div className="flex flex-col flex-1 h-full min-w-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="h-16 glass-card border-b border-gray-700/30 flex items-center px-4">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full animate-pulse mr-3"></div>
          <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl animate-pulse w-32"></div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4 py-8 max-w-md">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full animate-pulse neumorphic"></div>
            </div>
            <div className="h-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl animate-pulse mb-3 mx-auto w-48"></div>
            <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl animate-pulse mx-auto w-64"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // ---------------------- EMPTY STATE COMPONENT ------------------------
  const EmptyState = () => (
    <div className="flex h-full w-full bg-gradient-to-br from-gray-900 via-gray-950 to-black overflow-hidden">
      {/* Empty Sidebar */}
      <div className="hidden md:block w-[280px] flex-shrink-0 h-full border-r border-gray-700/30 glass-card">
        <div className="p-4">
          <h2 className="text-lg font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Messages</h2>
          <div className="text-center py-8">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-700/30 to-gray-800/30 flex items-center justify-center neumorphic">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-2M9 12h.01M12 12h.01M15 12h.01M17 4H7a2 2 0 00-2 2v6a2 2 0 002 2h2v4l4-4h4a2 2 0 002-2V6a2 2 0 00-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-400 text-sm font-medium">No conversations yet</p>
          </div>
        </div>
      </div>
      
      {/* Main Empty Content */}
      <div className="flex flex-col flex-1 h-full min-w-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="h-16 glass-card border-b border-gray-700/30 flex items-center px-4">
          <h1 className="text-lg font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Messages</h1>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4 py-8 max-w-lg">
            {/* Large Illustration */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 flex items-center justify-center neumorphic hover-lift">
                  <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                {/* Floating dots animation */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute top-1/2 -right-4 w-2 h-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
            
            {/* Main Message */}
            <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Start Your First Conversation</h3>
            <p className="text-gray-400 text-base mb-6 leading-relaxed font-medium">
              Connect with your mentors and get personalized guidance. Book a session first, then start chatting to make the most of your mentorship journey.
            </p>
            
            {/* Action Steps */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-center space-x-3 text-sm text-gray-300">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs neumorphic">1</div>
                <span className="font-medium">Book a session with a mentor</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-sm text-gray-300">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs neumorphic">2</div>
                <span className="font-medium">Start messaging after booking</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-sm text-gray-300">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xs neumorphic">3</div>
                <span className="font-medium">Get personalized guidance</span>
              </div>
            </div>
            
            {/* CTA Button */}
            <button 
              onClick={() => window.location.href = '/student/explore'}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-blue-500/30 hover:border-blue-400/50 hover-lift"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find Mentors
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ---------------------- RENDER UI ------------------------
  if (isLoading && mentors.length === 0) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="text-center px-4 py-8 glass-card rounded-2xl p-8 hover-lift">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center neumorphic">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Something went wrong</h3>
          <p className="text-red-400 mb-4 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover-lift"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (mentors.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex h-full w-full bg-gradient-to-br from-gray-900 via-gray-950 to-black overflow-hidden">
      {/* Main content */}
      <div className="relative z-10 flex w-full h-full">
        <div className="hidden md:block w-[280px] flex-shrink-0 h-full border-r border-gray-700/30">
          <MentorList
            mentors={mentors}
            activeMentorId={activeMentorId}
            onSelectMentor={setActiveMentorId}
          />
        </div>

        {/* Chat area - flexible width */}
        <div className="flex flex-col flex-1 h-full min-w-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
          {activeMentor ? (
            <>
              <StudentChatHeader 
                mentorName={activeMentor.name}
                mentorRole={activeMentor.role}
                mentorAvatar={activeMentor.avatar}
              />
              {isLoadingMessages ? (
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black">
                  <div className="flex flex-col items-center gap-4 glass-card rounded-2xl p-6 hover-lift">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full border-4 border-purple-500/30"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 animate-spin"></div>
                    </div>
                    <p className="text-gray-400 text-sm font-bold">Loading messages...</p>
                  </div>
                </div>
              ) : (
                <StudentChatMessages messages={messages} />
              )}
              <StudentChatInput 
                selectedType={selectedType} 
                onTypeChange={setSelectedType} 
                onSendMessage={handleSendMessage} 
              />
            </>
          ) : (
            <>
              <StudentChatHeader 
                mentorName={currentUser?.name || 'Student'}
                mentorRole=""
                mentorAvatar=""
              />
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black">
                <div className="text-center px-4 py-8 max-w-lg">
                  {/* Enhanced Illustration */}
                  <div className="mb-8 flex justify-center">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 flex items-center justify-center neumorphic hover-lift">
                        <svg className="w-14 h-14 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      {/* Animated arrow pointing left */}
                      <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 hidden md:block">
                        <svg className="w-8 h-8 text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                      </div>
                      {/* Floating message bubble */}
                      <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center animate-bounce neumorphic">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Message */}
                  <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Ready to Chat!</h3>
                  <p className="text-gray-400 text-base mb-6 leading-relaxed font-medium">
                    {mentors.length === 0 
                      ? "No conversations yet. Book a session with a mentor to start messaging!"
                      : `You have ${mentors.length} mentor${mentors.length > 1 ? 's' : ''} available. Select one from the sidebar to start your conversation.`
                    }
                  </p>
                  
                  {/* Helpful tip for mobile users */}
                  <div className="md:hidden mb-6">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-700/30 to-gray-800/30 border border-gray-600/40 rounded-xl text-gray-300 text-sm font-medium neumorphic">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Tap the menu to see your mentors
                    </div>
                  </div>
                  
                  {/* Quick actions */}
                  {mentors.length === 0 && (
                    <button 
                      onClick={() => window.location.href = '/student/explore'}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-blue-500/30 hover:border-blue-400/50 hover-lift"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Find Mentors
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Context sidebar - 320px fixed width */}
        {activeMentor && (
          <div className="hidden lg:block w-[320px] flex-shrink-0 h-full border-l border-gray-700/30 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
            <StudentContextSidebar 
              messages={messages} 
              mentor={{
                name: activeMentor.name,
                role: activeMentor.role,
                avatar: activeMentor.avatar,
                bio: activeMentor.bio || '',
                expertise: activeMentor.expertise || [],
                nextSession: activeMentor.nextSession?.sessionDate,
                company: activeMentor.company || '',
                currentTaskCount: activeMentor.nextSession ? 5 : 3
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
