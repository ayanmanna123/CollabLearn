import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/StudentDashboard/Navbar';
import MentorNavbar from '../components/MentorDashboard/Navbar';

const HelpPage = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const isMentor = user?.role === 'mentor';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 pt-16">
      {isMentor ? (
        <MentorNavbar userName={user?.name || 'Mentor'} />
      ) : (
        <Navbar userName={user?.name || 'Student'} />
      )}

      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-[#121212] rounded-xl border border-gray-700 p-6">
          <h1 className="text-2xl font-semibold text-white">Documentation coming soon</h1>
          <p className="text-gray-400 mt-2">
            We’re working on full product documentation. Please check back later.
          </p>

          <div className="mt-6">
            <button
              onClick={() => navigate(isMentor ? '/mentor/dashboard' : '/student/dashboard')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
