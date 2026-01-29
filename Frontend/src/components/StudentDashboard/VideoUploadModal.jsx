import React, { useState, useRef } from 'react';
import { API_BASE_URL } from '../../config/backendConfig';

const API_URL = API_BASE_URL?.replace('/api', '') || (import.meta.env.PROD ? 'https://k23dx.onrender.com' : 'http://localhost:4000');

const VideoUploadModal = ({ isOpen, onClose, sessionId, bookingId, mentorName }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      // Check file size (max 50MB for reliable Cloudinary uploads)
      if (file.size > 50 * 1024 * 1024) {
        alert('Video file size must be less than 50MB');
        return;
      }
      setVideoFile(file);
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleSubmit = async () => {
    if (!videoFile) {
      alert('Please select a video file');
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('video', videoFile);

      const token = localStorage.getItem('token');
      
      // Upload video to Cloudinary
      setUploadProgress(10);
      const uploadResponse = await fetch(`${API_URL}/api/upload/video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      setUploadProgress(60);
      const uploadData = await uploadResponse.json();
      
      console.log('Upload Response Status:', uploadResponse.status);
      console.log('Upload Response Data:', uploadData);
      
      if (!uploadResponse.ok || !uploadData.success) {
        throw new Error(uploadData.message || `Upload failed with status ${uploadResponse.status}`);
      }

      // Submit review with video URL
      setUploadProgress(80);
      const reviewResponse = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: sessionId || bookingId,
          bookingId: bookingId || sessionId,
          rating: 5,
          review: uploadData.data.url,
        }),
      });

      const reviewData = await reviewResponse.json();
      setUploadProgress(100);
      
      if (reviewData.success) {
        alert('Video uploaded successfully!');
        setVideoFile(null);
        setUploadProgress(0);
        onClose();
      } else {
        throw new Error(reviewData.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Video upload error:', error);
      alert('Error: ' + error.message);
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl p-7 w-full max-w-md border border-gray-700/30 shadow-2xl hover-lift">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Video for {mentorName}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-800/50 transition-all duration-300 group" disabled={loading}>
            <span className="text-gray-400 group-hover:text-white text-xl">×</span>
          </button>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-600/50 rounded-2xl p-8 text-center cursor-pointer hover:border-green-500/50 mb-5 bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300"
        >
          {videoFile ? (
            <div>
              <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white font-bold">{videoFile.name}</p>
              <p className="text-xs text-gray-400 mt-2">Click to change video</p>
            </div>
          ) : (
            <div>
              <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mb-3 neumorphic">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-gray-400 font-medium">Click to upload video</p>
              <p className="text-xs text-gray-500 mt-2">Max 50MB • MP4, MOV, AVI</p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Enhanced Progress Bar */}
        {loading && (
          <div className="mb-6 bg-gray-800/30 rounded-2xl p-5 border border-gray-700/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-green-500/10">
                  <svg className="animate-spin h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <span className="text-base font-bold text-white">
                  {uploadProgress < 60 ? 'Uploading video...' : 
                   uploadProgress < 80 ? 'Processing video...' : 
                   'Almost done...'}
                </span>
              </div>
              <span className="text-base font-bold text-green-400">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-4 overflow-hidden neumorphic-inset">
              <div 
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ 
                  width: `${uploadProgress}%`,
                  background: 'linear-gradient(90deg, #10b981, #34d399, #6ee7b7)',
                  boxShadow: '0 0 15px rgba(16, 185, 129, 0.7)'
                }}
              ></div>
            </div>
            {videoFile && (
              <p className="text-sm text-gray-400 mt-3 font-medium">
                {videoFile.name} • {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-5 py-3 bg-gray-800/50 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:text-white transition-all duration-300 font-bold border border-gray-700/50 hover:border-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !videoFile}
            className="flex-1 px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-lg hover:shadow-xl disabled:hover:shadow-lg flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              'Upload Video'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadModal;
