import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MentorNavbar from '../components/MentorDashboard/Navbar';
import { getApiUrl } from '../config/backendConfig';

const MentorProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const API_URL = getApiUrl().replace(/\/$/, '');

  const initials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase();
  };

  const joinedLabel = (createdAt) => {
    try {
      return createdAt
        ? new Date(createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })
        : '';
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        const res = await fetch(`${API_URL}/user/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        setProfile(data.user);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, API_URL]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 pt-16">
      <MentorNavbar userName={user?.name || 'Mentor'} />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-semibold text-white mb-6">Profile</h1>
        
        {loading && <p className="text-gray-400">Loading your profile...</p>}
        
        {error && (
          <div className="bg-red-900/30 border border-red-700/40 text-red-200 p-4 rounded-lg">
            Error: {error}
          </div>
        )}

        {profile ? (
          <div className="space-y-4">
            <div className="bg-[#121212] rounded-xl border border-gray-700 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-14 w-14 rounded-xl bg-[#202327] border border-gray-600/60 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {profile?.mentorProfile?.profilePicture || profile?.profilePicture ? (
                      <img
                        src={profile?.mentorProfile?.profilePicture || profile?.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold">{initials(profile.name)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-white truncate">{profile.name}</p>
                      <span className="px-2 py-0.5 rounded-full text-xs border border-gray-600/60 bg-[#202327] text-gray-200 capitalize">
                        {profile.role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{profile.email}</p>
                    {profile.createdAt && (
                      <p className="text-xs text-gray-500 mt-0.5">Joined {joinedLabel(profile.createdAt)}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs border border-gray-600/60 bg-[#202327] text-gray-200">
                    Connections: {profile.connectionsCount ?? 0}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs border border-gray-600/60 bg-[#202327] text-gray-200">
                    Karma: {profile.karmaPoints ?? 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-[#121212] rounded-xl border border-gray-700 p-6">
                <p className="text-sm font-semibold text-white mb-3">About</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400">Headline</p>
                    <p className="text-sm text-gray-200 mt-1">{profile.mentorProfile?.headline || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Company</p>
                    <p className="text-sm text-gray-200 mt-1">{profile.mentorProfile?.company || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Bio</p>
                    <p className="text-sm text-gray-200 mt-1">{profile.mentorProfile?.bio || profile.bio || '—'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#121212] rounded-xl border border-gray-700 p-6">
                <p className="text-sm font-semibold text-white mb-3">Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#202327] border border-gray-600/60 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Experience</p>
                    <p className="text-sm text-gray-200 mt-1">
                      {typeof profile.mentorProfile?.experience === 'number'
                        ? `${profile.mentorProfile.experience} year${profile.mentorProfile.experience === 1 ? '' : 's'}`
                        : '—'}
                    </p>
                  </div>
                  <div className="bg-[#202327] border border-gray-600/60 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Hourly Rate</p>
                    <p className="text-sm text-gray-200 mt-1">
                      {profile.mentorProfile?.hourlyRate != null
                        ? `₹${profile.mentorProfile.hourlyRate}/hr`
                        : profile.hourlyRate != null
                          ? `₹${profile.hourlyRate}/hr`
                          : '—'}
                    </p>
                  </div>
                  <div className="bg-[#202327] border border-gray-600/60 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="text-sm text-gray-200 mt-1">{profile.phoneNumber || '—'}</p>
                  </div>
                  <div className="bg-[#202327] border border-gray-600/60 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Profile Complete</p>
                    <p className="text-sm text-gray-200 mt-1">{profile.isProfileComplete ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#121212] rounded-xl border border-gray-700 p-6">
                <p className="text-sm font-semibold text-white mb-3">Skills</p>
                {(() => {
                  const mentorSkills = Array.isArray(profile.mentorProfile?.skills) ? profile.mentorProfile.skills : [];
                  const linkedSkills = Array.isArray(profile.skills)
                    ? profile.skills.map((s) => s?.name || s).filter(Boolean)
                    : [];
                  const all = Array.from(new Set([...mentorSkills, ...linkedSkills]));
                  return all.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {all.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-full text-xs border border-gray-600/60 bg-[#202327] text-gray-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">—</p>
                  );
                })()}
              </div>

              <div className="bg-[#121212] rounded-xl border border-gray-700 p-6">
                <p className="text-sm font-semibold text-white mb-3">Social Links</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <a
                    href={profile.mentorProfile?.linkedinProfile || '#'}
                    target={profile.mentorProfile?.linkedinProfile ? '_blank' : undefined}
                    rel={profile.mentorProfile?.linkedinProfile ? 'noreferrer' : undefined}
                    className={`bg-[#202327] border border-gray-600/60 rounded-lg p-3 text-sm ${profile.mentorProfile?.linkedinProfile ? 'text-gray-200 hover:border-gray-500' : 'text-gray-500 cursor-not-allowed'}`}
                    onClick={(e) => {
                      if (!profile.mentorProfile?.linkedinProfile) e.preventDefault();
                    }}
                  >
                    LinkedIn
                  </a>
                  <a
                    href={profile.mentorProfile?.githubProfile || '#'}
                    target={profile.mentorProfile?.githubProfile ? '_blank' : undefined}
                    rel={profile.mentorProfile?.githubProfile ? 'noreferrer' : undefined}
                    className={`bg-[#202327] border border-gray-600/60 rounded-lg p-3 text-sm ${profile.mentorProfile?.githubProfile ? 'text-gray-200 hover:border-gray-500' : 'text-gray-500 cursor-not-allowed'}`}
                    onClick={(e) => {
                      if (!profile.mentorProfile?.githubProfile) e.preventDefault();
                    }}
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          !loading && <p className="text-gray-400">No profile found</p>
        )}
      </div>
    </div>
  );
};

export default MentorProfilePage;
