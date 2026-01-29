import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/StudentDashboard/Navbar';
import MentorNavbar from '../components/MentorDashboard/Navbar';
import RichTextEditor from '../components/Journal/RichTextEditor';
import SessionSidebar from '../components/Journal/SessionSidebar';
import sessionDataService from '../services/sessionDataService';

const JournalPage = ({
  navbarVariant,
  redirectPath,
  defaultUserName
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [error, setError] = useState(null);
  const [noConversation, setNoConversation] = useState(false);
  const [writingContent, setWritingContent] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionNotes, setSessionNotes] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState('editor'); // 'editor' or 'saved-notes'
  const [savingNotes, setSavingNotes] = useState(false);
  const [saveNotesFeedback, setSaveNotesFeedback] = useState(null);

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const userRole = user?.role;
  const effectiveNavbarVariant = navbarVariant || (userRole === 'mentor' ? 'mentor' : 'student');
  const effectiveRedirectPath = redirectPath || (userRole === 'mentor' ? '/mentor/dashboard' : '/student/dashboard');
  const NavbarComponent = effectiveNavbarVariant === 'mentor' ? MentorNavbar : Navbar;

  // Check if coming from a session
  const fromSession = location.state?.fromSession;
  const sessionId = location.state?.sessionId;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // If coming from a session, set it as the current session
    if (fromSession && sessionId) {
      const currentSession = {
        _id: sessionId,
        sessionId: sessionId,
        fromSession: true
      };
      setSelectedSession(currentSession);
      fetchSessionInsights(sessionId);
      loadSessionNotes(sessionId);
    }
  }, [navigate, fromSession, sessionId]);

  // Handle session selection from sidebar
  const handleSessionSelect = async (session) => {
    setSelectedSession(session);
    setWritingContent('');
    setInsights(null);
    setSessionInfo(null);
    setError(null);
    setNoConversation(false);
    setSaveNotesFeedback(null);

    try {
      // Load AI insights for the selected session
      if (session._id || session.sessionId) {
        await fetchSessionInsights(session._id || session.sessionId);
        await loadSessionNotes(session._id || session.sessionId);
      }
    } catch (err) {
      console.error('Error loading session data:', err);
    }
  };

  // Load saved notes for a session
  const loadSessionNotes = async (sessionId) => {
    try {
      const response = await sessionDataService.getSessionNotes(sessionId);
      if (response.success && response.data) {
        // Only set sessionNotes for display, don't overwrite writingContent
        setSessionNotes(prev => ({
          ...prev,
          [sessionId]: response.data.notes || ''
        }));
        // Don't set writingContent here - let the editor stay empty for new notes
      }
    } catch (err) {
      console.log('No saved notes found for session:', sessionId);
      // It's okay if there are no saved notes yet
    }
  };

  // Save notes for current session
  const saveCurrentNotes = async () => {
    if (!selectedSession || !writingContent.trim() || savingNotes) return;
    
    try {
      setSavingNotes(true);
      setSaveNotesFeedback(null);
      // Get existing notes for this session
      const existingNotes = sessionNotes[selectedSession._id || selectedSession.sessionId] || '';
      
      // Parse existing notes to get array
      let notesArray = [];
      if (existingNotes) {
        // Extract individual notes from existing HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = existingNotes;
        const noteEntries = tempDiv.querySelectorAll('.note-entry');
        noteEntries.forEach(entry => {
          const timestamp = entry.querySelector('.text-gray-500')?.textContent || '';
          const content = entry.querySelector('div:last-child')?.innerHTML || '';
          notesArray.push({ timestamp, content });
        });
      }
      
      // Add new note
      const timestamp = new Date().toLocaleString();
      notesArray.push({ timestamp, content: writingContent });
      
      // Convert back to HTML for storage
      const combinedNotes = notesArray.map(note => 
        `<div class="note-entry mb-4">
          <div class="text-sm text-gray-500 mb-2">${note.timestamp}</div>
          <div>${note.content}</div>
        </div>`
      ).join('');
      
      await sessionDataService.saveSessionNotes(
        selectedSession._id || selectedSession.sessionId,
        combinedNotes
      );
      
      // Update session notes in state
      setSessionNotes(prev => ({
        ...prev,
        [selectedSession._id || selectedSession.sessionId]: combinedNotes
      }));
      
      // Clear the editor after saving
      setWritingContent('');
      setSaveNotesFeedback({ type: 'success', message: 'Notes saved.' });
    } catch (err) {
      console.error('Error saving notes:', err);
      setSaveNotesFeedback({ type: 'error', message: 'Failed to save notes. Please try again.' });
    } finally {
      setSavingNotes(false);
    }
  };

  // Save complete journal entry
  const saveJournalEntry = async () => {
    if (!selectedSession) return;
    
    try {
      await sessionDataService.saveJournalEntry(
        selectedSession._id || selectedSession.sessionId,
        insights,
        writingContent
      );
      navigate(effectiveRedirectPath);
    } catch (err) {
      console.error('Error saving journal entry:', err);
    }
  };

  const fetchSessionInsights = async (sessionId) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await sessionDataService.getSessionInsights(sessionId);

      if (data?.success) {
        if (data.noConversation) {
          setNoConversation(true);
          setInsights(null);
          setSessionInfo({
            mentorName: data.data?.mentorName,
            studentName: data.data?.studentName,
            sessionDate: data.data?.sessionDate,
            sessionTime: data.data?.sessionTime,
            duration: data.data?.duration,
            actualDuration: data.data?.actualDuration
          });
        } else {
          setNoConversation(false);
          setInsights(data.data?.insights || null);
          setSessionInfo({
            mentorName: data.data?.mentorName,
            studentName: data.data?.studentName,
            sessionDate: data.data?.sessionDate,
            sessionTime: data.data?.sessionTime,
            duration: data.data?.duration,
            topic: data.data?.topic
          });
        }
      } else {
        setError(data?.message || 'Failed to generate insights');
      }
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError(err?.message || 'Failed to connect to AI service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white overflow-x-hidden pt-14">
      <NavbarComponent userName={user?.name || defaultUserName || (effectiveNavbarVariant === 'mentor' ? 'Mentor' : 'Student')} />
      
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        {sidebarOpen && (
          <SessionSidebar
            activeSessionId={selectedSession?._id || selectedSession?.sessionId}
            onSessionSelect={handleSessionSelect}
            userRole={userRole}
            currentSessionData={fromSession && sessionId ? {
              _id: sessionId,
              sessionId: sessionId,
              mentorName: sessionInfo?.mentorName,
              studentName: sessionInfo?.studentName,
              sessionDate: sessionInfo?.sessionDate,
              sessionTime: sessionInfo?.sessionTime,
              duration: sessionInfo?.duration,
              topic: sessionInfo?.topic,
              fromSession: true
            } : null}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {selectedSession ? (
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-6 py-8">
                

                {/* View Toggle Button */}
                <div className="mb-6">
                  <button
                    onClick={() => setViewMode(viewMode === 'editor' ? 'saved-notes' : 'editor')}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 hover-lift"
                  >
                    {viewMode === 'editor' ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>View Saved Notes</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Back to Editor</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Conditional Content Based on View Mode */}
                {viewMode === 'editor' ? (
                  /* Editor View - AI Analysis and Writing Section */
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* AI Analysis Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center neumorphic">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI Analysis</h2>
                        <p className="text-sm text-gray-400">Powered by Gemini AI</p>
                      </div>
                    </div>

            {/* AI Session Insights Content */}
            {selectedSession.fromSession ? (
              <>
                {loading ? (
                  <div className="glass-card rounded-2xl border border-gray-700/30 p-8 hover-lift">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-purple-300 animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-gray-300 text-center font-bold">Analyzing your session with AI...</p>
                      <p className="text-gray-400 text-sm">Generating personalized insights and takeaways</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="glass-card rounded-2xl border border-red-500/30 p-6 hover-lift">
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-red-400 font-bold">Failed to generate insights</p>
                        <p className="text-red-300 text-sm mt-1">{error}</p>
                        <button 
                          onClick={() => fetchSessionInsights(selectedSession._id || selectedSession.sessionId)}
                          className="mt-3 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                ) : noConversation ? (
                  <div className="glass-card rounded-2xl border border-gray-700/30 p-8 hover-lift">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center neumorphic">
                        <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">No Conversation Recorded</h3>
                      <p className="text-gray-400 max-w-md">
                        It looks like the session ended before a meaningful conversation could take place. 
                        {sessionInfo?.actualDuration !== undefined && (
                          <span className="block mt-2 text-gray-500">
                            Session duration: {Math.floor(sessionInfo.actualDuration / 60)} minutes {sessionInfo.actualDuration % 60} seconds
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ) : insights ? (
                  <div className="space-y-4">
                    {/* Session Info Card */}
                    {sessionInfo && (
                      <div className="glass-card rounded-2xl border border-gray-700/30 p-4 hover-lift">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold neumorphic">
                              {sessionInfo.mentorName?.charAt(0) || 'M'}
                            </div>
                            
                          </div>
                          <div className="flex items-center space-x-2 text-gray-400 text-xs">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{sessionInfo.duration} minutes</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                  
                    <div className="glass-card rounded-2xl border border-gray-700/30 p-4 hover-lift">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-sm font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Session Summary</h3>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed bg-gray-800/30 rounded-xl p-3">{insights.summary}</p>
                    </div>

                    {/* Key Takeaways */}
                    <div className="glass-card rounded-2xl border border-gray-700/30 p-4 hover-lift">
                      <div className="flex items-center space-x-2 mb-3">
                        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <h3 className="text-sm font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Key Takeaways</h3>
                      </div>
                      <ul className="space-y-2">
                        {insights.keyTakeaways?.map((takeaway, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-white flex items-center justify-center text-xs font-bold mt-0.5 neumorphic">
                              {index + 1}
                            </span>
                            <span className="text-gray-300 text-sm font-medium">{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Items */}
                    <div className="glass-card rounded-2xl border border-gray-700/30 p-4 hover-lift">
                      <div className="flex items-center space-x-2 mb-3">
                        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        <h3 className="text-sm font-bold text-white bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Action Items</h3>
                      </div>
                      <ul className="space-y-2">
                        {insights.actionItems?.map((item, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-gray-800/50 text-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 focus:ring-offset-gray-900" />
                            <span className="text-gray-300 text-sm font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="glass-card rounded-2xl border border-gray-700/30 p-8 text-center hover-lift">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center neumorphic">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI Analysis</h3>
                <p className="text-gray-400 text-sm">
                  AI analysis is only available for recent sessions completed with conversation.
                </p>
              </div>
            )}
          </div>

          {/* Writing Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center neumorphic">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Your Notes</h2>
                <p className="text-sm text-gray-400">Personal reflections and thoughts</p>
              </div>
            </div>

            <RichTextEditor
              value={writingContent}
              onChange={setWritingContent}
              placeholder="Write your personal notes, reflections, and thoughts about the session..."
              height="400px"
            />

            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setWritingContent('')}
                className="px-4 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 hover-lift text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear</span>
              </button>
              <button 
                onClick={saveCurrentNotes}
                disabled={!selectedSession || !writingContent.trim() || savingNotes}
                className={`px-4 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 text-sm ${
                  (!selectedSession || !writingContent.trim() || savingNotes)
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover-lift'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>{savingNotes ? 'Saving...' : 'Save Notes'}</span>
              </button>
            </div>

            {saveNotesFeedback && (
              <div className={`text-sm text-right ${saveNotesFeedback.type === 'success' ? 'text-gray-300' : 'text-red-400'}`}>
                {saveNotesFeedback.message}
              </div>
            )}
          </div>
        </div>
                ) : (
                  /* Saved Notes View */
                  <div className="max-w-4xl mx-auto">
                    {sessionNotes[selectedSession?._id || selectedSession?.sessionId] ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(() => {
                          const notesHtml = sessionNotes[selectedSession?._id || selectedSession?.sessionId] || '';
                          const tempDiv = document.createElement('div');
                          tempDiv.innerHTML = notesHtml;
                          const noteEntries = tempDiv.querySelectorAll('.note-entry');
                                            
                          return Array.from(noteEntries).map((entry, index) => {
                            const timestamp = entry.querySelector('.text-gray-500')?.textContent || '';
                            const content = entry.querySelector('div:last-child')?.innerHTML || '';
                                              
                            return (
                              <div key={index} className="glass-card rounded-2xl border border-gray-700/30 p-4 hover:border-gray-600/50 transition-all duration-300 hover-lift">
                                <div className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">{timestamp}</div>
                                <div 
                                  className="text-gray-300 prose prose-invert max-w-none text-sm"
                                  dangerouslySetInnerHTML={{ __html: content }}
                                />
                              </div>
                            );
                          });
                        })()}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center neumorphic">
                          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">No Saved Notes Yet</h3>
                        <p className="text-gray-400 mb-6">
                          Switch to the editor view to add your personal notes and reflections about this session.
                        </p>
                        <button
                          onClick={() => setViewMode('editor')}
                          className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover-lift"
                        >
                          Go to Editor
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center neumorphic">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Select a Session</h3>
                <p className="text-gray-400 text-center max-w-md">
                  Choose a completed session from the sidebar to view AI analysis and add your personal notes.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Or complete a new mentoring session to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
