import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, User, DollarSign, Eye, MapPin, RefreshCw, ChevronLeft, Video, CheckCircle, XCircle, Clock4, Users } from 'lucide-react';
import { API_BASE_URL } from '../config/backendConfig';
import Navbar from '../components/StudentDashboard/Navbar';
import SessionTimer from '../components/SessionTimer';

const SessionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const handleJoinSession = async (session) => {
    try {
      console.log('Attempting to join session:', session);
      
      const roomId = session.meetingId || session.roomId || `session_${session._id}`;
      if (roomId) {
        const meetingUrl = `/student/meeting/${encodeURIComponent(roomId)}/${session._id}`;
        console.log('Opening ZegoCloud meeting:', meetingUrl);
        navigate(meetingUrl);
        return;
      }
      
      if (session.meetingLink && session.meetingLink.includes('zoom.us')) {
        if (session.meetingLink.includes('?') || session.meetingLink.includes('/j/')) {
          console.log('Opening Zoom meeting with direct link');
          window.open(session.meetingLink, '_blank');
        } else if (session.meetingId) {
          const zoomUrl = `https://zoom.us/j/${session.meetingId}${session.passcode ? `?pwd=${session.passcode}` : ''}`;
          console.log('Opening Zoom meeting with ID:', zoomUrl);
          window.open(zoomUrl, '_blank');
        } else {
          console.log('Opening Zoom meeting with basic link');
          window.open(session.meetingLink, '_blank');
        }
        return;
      }
      
      if (session.meetingLink) {
        console.log('Opening direct meeting link');
        window.open(session.meetingLink, '_blank');
        return;
      }
      
      console.error('Could not join meeting - missing required parameters. Session data:', {
        meetingType: session.meetingType,
        meetingLink: session.meetingLink,
        meetingId: session.meetingId,
        roomId: session.roomId,
        sessionId: session._id,
        sessionDate: session.sessionDate,
        status: session.status
      });
      
      const sessionDate = session.sessionDate ? new Date(session.sessionDate) : null;
      const now = new Date();
      
      if (!sessionDate) {
        alert('This session does not have a scheduled date. Please contact the mentor for assistance.');
      } else if ((sessionDate - now) > (24 * 60 * 60 * 1000)) {
        alert('This session is more than 24 hours away. The meeting link will be available closer to the session time.');
      } else if (sessionDate > now) {
        alert('The meeting link is not available yet. Please check back closer to your session time or contact the mentor.');
      } else {
        alert('Unable to join the meeting. Please contact the mentor for assistance.');
      }
    } catch (error) {
      console.error('Error joining meeting:', error, 'Session data:', session);
      alert('An error occurred while trying to join the meeting. Please try again or contact support.');
    }
  };

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch bookings');
      }

      if (data.success && data.bookings) {
        setBookings(data.bookings);
      } else {
        setError('No bookings data received');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [navigate, location.pathname]); // Refetch when navigating to this page

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          bg: 'bg-blue-500/20',
          text: 'text-blue-300',
          border: 'border-blue-500/30',
          icon: <CheckCircle className="h-3 w-3" />
        };
      case 'pending':
        return {
          bg: 'bg-yellow-500/20',
          text: 'text-yellow-300',
          border: 'border-yellow-500/30',
          icon: <Clock4 className="h-3 w-3" />
        };
      case 'cancelled':
        return {
          bg: 'bg-red-500/20',
          text: 'text-red-300',
          border: 'border-red-500/30',
          icon: <XCircle className="h-3 w-3" />
        };
      case 'completed':
        return {
          bg: 'bg-green-500/20',
          text: 'text-green-300',
          border: 'border-green-500/30',
          icon: <CheckCircle className="h-3 w-3" />
        };
      default:
        return {
          bg: 'bg-gray-500/20',
          text: 'text-gray-300',
          border: 'border-gray-500/30',
          icon: <Clock className="h-3 w-3" />
        };
    }
  };



  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  if (loading) {
    return (
      <div className="h-screen bg-gray-900 text-white flex flex-col">
        <Navbar userName={user?.name || 'Student'} />
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="inline-flex animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
            <p className="text-gray-300 text-lg font-medium">Loading sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') {
      return ['scheduled', 'confirmed', 'pending'].includes(booking.status) && 
             new Date(booking.sessionDate) >= new Date();
    }
    if (activeTab === 'completed') return booking.status === 'completed';
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  const SessionCard = ({ booking }) => {
    // Helper to construct the correct date object from date and time string
    const getSessionDateTime = (booking) => {
      const date = new Date(booking.sessionDate);
      if (!booking.sessionTime) return date;

      try {
        const [time, period] = booking.sessionTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        date.setHours(hours, minutes, 0, 0);
        return date;
      } catch (e) {
        console.error('Error parsing session time:', e);
        return date;
      }
    };

    const sessionDate = getSessionDateTime(booking);
    const now = new Date();
    const timeDiff = sessionDate - now;
    const fiveMinutes = 5 * 60 * 1000;
    const duration = booking.duration || 60;
    const isExpired = timeDiff < -(duration * 60 * 1000);
    const canJoin = !isExpired && timeDiff <= fiveMinutes;
    
    const statusConfig = getStatusConfig(booking.status);
    
    const formatTimeUntil = () => {
      if (timeDiff <= 0) return null;
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    };

    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center border border-blue-500/30">
              <User className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{booking.mentor?.name || 'Mentor Name'}</h3>
              <p className="text-gray-400 text-sm">{booking.mentor?.title || 'Mentor'}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}> 
            {statusConfig.icon}
            {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Scheduled'}
          </div>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-300 text-sm">
            <Calendar className="h-4 w-4 mr-2 text-blue-400" />
            <span>{sessionDate.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>
          
          <div className="flex items-center text-gray-300 text-sm">
            <Clock className="h-4 w-4 mr-2 text-purple-400" />
            <span>{booking.sessionTime || sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          
          {booking.price && (
            <div className="flex items-center text-gray-300 text-sm">
              <DollarSign className="h-4 w-4 mr-2 text-green-400" />
              <span>${booking.price}</span>
            </div>
          )}
        </div>
        
        {!['completed', 'cancelled'].includes(booking.status) && (
          <div className="pt-4 border-t border-gray-700/50">
            {isExpired ? (
              <div className="text-center">
                <button
                  disabled
                  className="w-full py-3 px-4 bg-gray-700/50 text-gray-500 font-medium rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  Session Expired
                </button>
              </div>
            ) : canJoin ? (
              <button
                onClick={() => handleJoinSession(booking)}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Video className="h-4 w-4" />
                Join Session
              </button>
            ) : (
              <div className="text-center">
                <button
                  disabled
                  className="w-full py-3 px-4 bg-gray-700/50 text-gray-400 font-medium rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  Join Session
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Available in {formatTimeUntil()} (5 min before start)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white flex flex-col overflow-hidden">
      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1f2937; }
        ::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #6b7280; }
      `}</style>
      
      <Navbar userName={user?.name || 'Student'} />
      
      <div className="flex-1 overflow-y-auto pt-16 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <button 
                onClick={() => navigate('/student/dashboard')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-400" />
              </button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">My Sessions</h1>
            </div>
            <p className="text-gray-400 ml-10">Manage your mentoring sessions</p>
          </div>

          {error ? (
            <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-6 text-center max-w-md mx-auto">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchBookings}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-300 flex items-center mx-auto transition-colors"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { id: 'all', label: 'All Sessions', icon: Users },
                  { id: 'upcoming', label: 'Upcoming', icon: Clock },
                  { id: 'completed', label: 'Completed', icon: CheckCircle },
                  { id: 'cancelled', label: 'Cancelled', icon: XCircle }
                ].map(tab => {
                  const Icon = tab.icon;
                  const count = tab.id === 'all' 
                    ? bookings.length
                    : bookings.filter(b => 
                        tab.id === 'upcoming' ? ['scheduled', 'confirmed', 'pending'].includes(b.status) && new Date(b.sessionDate) >= new Date() :
                        tab.id === 'completed' ? b.status === 'completed' :
                        b.status === 'cancelled'
                      ).length;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        activeTab === tab.id ? 'bg-white/20' : 'bg-gray-700'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sessions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map(booking => (
                    <SessionCard key={booking._id} booking={booking} />
                  ))
                ) : (
                  <div className="col-span-full bg-gray-800/30 backdrop-blur-sm border border-dashed border-gray-700 rounded-xl p-12 text-center">
                    <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No sessions found</h3>
                    <p className="text-gray-500">{activeTab === 'all' ? 'You have no sessions yet.' : `No ${activeTab} sessions.`}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionsPage;
