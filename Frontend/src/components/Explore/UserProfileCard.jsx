import React, { useState, useEffect } from 'react';
import { FiUser, FiUsers } from 'react-icons/fi';
import { API_BASE_URL } from '../../config/backendConfig';

const UserProfileCard = ({ user }) => {
  const [connectedMentorsCount, setConnectedMentorsCount] = useState(0);
  const [connectedMentorsLoading, setConnectedMentorsLoading] = useState(true);

  useEffect(() => {
    const fetchConnectedMentorsCount = async () => {
      try {
        setConnectedMentorsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/connections/my-connections?status=connected`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          setConnectedMentorsCount(data.count || 0);
        }
      } catch (err) {
        console.error('Error fetching connected mentors count:', err);
        setConnectedMentorsCount(0);
      } finally {
        setConnectedMentorsLoading(false);
      }
    };

    fetchConnectedMentorsCount();
  }, []);

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="glass-card rounded-2xl border border-gray-700/30 overflow-hidden h-[140px] flex flex-col hover-lift">
 
      <div class="p-4 flex-1 flex flex-col">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 overflow-hidden neumorphic pulse-glow">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <span className="text-sm font-bold text-white">{getInitials(user?.name)}</span>
            )}
          </div>
          <div className="ml-4 min-w-0">
            <p className="text-base font-bold text-white truncate bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {user?.name || 'Guest User'}
            </p>
            <p className="text-xs text-gray-400 truncate mt-1">
              @{user?.name?.toLowerCase().replace(/\s+/g, '') || 'username'}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-center text-center pt-3 border-t border-gray-700/30">
          <div>
            <p className="text-xl font-bold text-white">{connectedMentorsLoading ? '...' : connectedMentorsCount}</p>
            <p className="text-xs text-gray-400 font-medium">Connections</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default UserProfileCard;
