import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MentorNavbar from "../components/MentorDashboard/Navbar";
import { getApiUrl } from "../config/backendConfig";

const MentorProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const API_URL = getApiUrl().replace(/\/$/, "");

  const initials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  };

  const joinedLabel = (createdAt) => {
    try {
      return createdAt
        ? new Date(createdAt).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })
        : "";
    } catch {
      return "";
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
            Authorization: `Bearer ${token}`,
          },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white pt-16">
      <MentorNavbar userName={user?.name || "Mentor"} />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-white mb-8 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Profile
        </h1>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em]"></div>
            <span className="ml-3 text-gray-400 text-lg font-medium">
              Loading your profile...
            </span>
          </div>
        )}

        {error && (
          <div className="glass-card rounded-2xl p-6 border border-red-500/30 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-500/20">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-red-400 font-bold">Error: {error}</p>
              </div>
            </div>
          </div>
        )}

        {profile ? (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl border border-gray-700/30 p-6 hover-lift">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-5 min-w-0">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 border-2 border-gray-700/50 overflow-hidden flex items-center justify-center flex-shrink-0 neumorphic pulse-glow">
                    {profile?.mentorProfile?.profilePicture ||
                    profile?.profilePicture ? (
                      <img
                        src={
                          profile?.mentorProfile?.profilePicture ||
                          profile?.profilePicture
                        }
                        alt="Profile"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <span className="text-xl font-bold text-white">
                        {initials(profile.name)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-2xl font-bold text-white truncate bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {profile.name}
                      </p>
                      <span className="px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 capitalize">
                        {profile.role}
                      </span>
                    </div>
                    <p className="text-base text-gray-400 truncate mt-2">
                      {profile.email}
                    </p>
                    {profile.createdAt && (
                      <p className="text-sm text-gray-500 mt-1">
                        Joined {joinedLabel(profile.createdAt)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 rounded-xl text-sm font-bold border border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300">
                    Connections: {profile.connectionsCount ?? 0}
                  </span>
                  <span className="px-4 py-2 rounded-xl text-sm font-bold border border-green-500/30 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300">
                    Karma: {profile.karmaPoints ?? 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl border border-gray-700/30 p-6 hover-lift">
                <p className="text-lg font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  About
                </p>
                <div className="space-y-4">
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Headline
                    </p>
                    <p className="text-base text-gray-200 mt-2">
                      {profile.mentorProfile?.headline || "—"}
                    </p>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Company
                    </p>
                    <p className="text-base text-gray-200 mt-2">
                      {profile.mentorProfile?.company || "—"}
                    </p>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Bio
                    </p>
                    <p className="text-base text-gray-200 mt-2">
                      {profile.mentorProfile?.bio || profile.bio || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl border border-gray-700/30 p-6 hover-lift">
                <p className="text-lg font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4 neumorphic">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Experience
                    </p>
                    <p className="text-base text-gray-200 mt-2 font-bold">
                      {typeof profile.mentorProfile?.experience === "number"
                        ? `${profile.mentorProfile.experience} year${
                            profile.mentorProfile.experience === 1 ? "" : "s"
                          }`
                        : "—"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4 neumorphic">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Hourly Rate
                    </p>
                    <p className="text-base text-gray-200 mt-2 font-bold">
                      {profile.mentorProfile?.hourlyRate != null
                        ? `₹${profile.mentorProfile.hourlyRate}/hr`
                        : profile.hourlyRate != null
                          ? `₹${profile.hourlyRate}/hr`
                          : "—"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4 neumorphic">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Phone
                    </p>
                    <p className="text-base text-gray-200 mt-2 font-bold">
                      {profile.phoneNumber || "—"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4 neumorphic">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Profile Complete
                    </p>
                    <p className="text-base text-gray-200 mt-2 font-bold">
                      {profile.isProfileComplete ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl border border-gray-700/30 p-6 hover-lift">
                <p className="text-lg font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Skills
                </p>
                {(() => {
                  const mentorSkills = Array.isArray(
                    profile.mentorProfile?.skills
                  )
                    ? profile.mentorProfile.skills
                    : [];
                  const linkedSkills = Array.isArray(profile.skills)
                    ? profile.skills.map((s) => s?.name || s).filter(Boolean)
                    : [];
                  const all = Array.from(
                    new Set([...mentorSkills, ...linkedSkills])
                  );
                  return all.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {all.map((s) => (
                        <span
                          key={s}
                          className="px-4 py-2 rounded-full text-sm font-bold border border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 hover:border-blue-400/50 transition-all duration-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-base text-gray-400">—</p>
                  );
                })()}
              </div>

              <div className="glass-card rounded-2xl border border-gray-700/30 p-6 hover-lift">
                <p className="text-lg font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Social Links
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href={profile.mentorProfile?.linkedinProfile || "#"}
                    target={
                      profile.mentorProfile?.linkedinProfile
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      profile.mentorProfile?.linkedinProfile
                        ? "noreferrer"
                        : undefined
                    }
                    className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4 text-base font-bold transition-all duration-300 neumorphic ${
                      profile.mentorProfile?.linkedinProfile
                        ? "text-blue-300 hover:border-blue-500/50"
                        : "text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      if (!profile.mentorProfile?.linkedinProfile)
                        e.preventDefault();
                    }}
                  >
                    LinkedIn
                  </a>
                  <a
                    href={profile.mentorProfile?.githubProfile || "#"}
                    target={
                      profile.mentorProfile?.githubProfile
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      profile.mentorProfile?.githubProfile
                        ? "noreferrer"
                        : undefined
                    }
                    className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4 text-base font-bold transition-all duration-300 neumorphic ${
                      profile.mentorProfile?.githubProfile
                        ? "text-gray-300 hover:border-gray-500/50"
                        : "text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      if (!profile.mentorProfile?.githubProfile)
                        e.preventDefault();
                    }}
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.329M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 text-lg font-medium">
                  No profile found
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MentorProfilePage;
