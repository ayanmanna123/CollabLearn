import React from 'react';

const AuthStatus = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id || user._id;

  return (
    <div className="fixed top-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 max-w-xs">
      <h3 className="font-bold mb-2">Auth Status</h3>
      <div className="text-sm space-y-1">
        <div>Token: {token ? '✅ Present' : '❌ Missing'}</div>
        <div>User ID: {userId ? '✅ Present' : '❌ Missing'}</div>
        <div>Role: {user.role || 'None'}</div>
        <div>Name: {user.name || 'None'}</div>
        {userId && <div className="text-xs text-gray-400">ID: {userId}</div>}
      </div>
      {token && userId && (
        <div className="mt-2 text-xs text-green-400">
          ✅ Authenticated - Chat should work
        </div>
      )}
      {(!token || !userId) && (
        <div className="mt-2 text-xs text-red-400">
          ❌ Not authenticated - Need to login
        </div>
      )}
    </div>
  );
};

export default AuthStatus;
