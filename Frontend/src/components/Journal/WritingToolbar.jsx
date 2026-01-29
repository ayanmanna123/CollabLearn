import React from 'react';

const WritingToolbar = ({ onFormat, onBold, onItalic, onUnderline, onBulletList, onNumberedList, onClear }) => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700/30 rounded-t-2xl p-2 flex items-center space-x-1">
      <button
        onClick={onBold}
        className="p-2.5 hover:bg-gradient-to-br from-blue-600/30 to-indigo-600/30 rounded-xl text-gray-300 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
        title="Bold"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
        </svg>
      </button>
      
      <button
        onClick={onItalic}
        className="p-2.5 hover:bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl text-gray-300 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
        title="Italic"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
        </svg>
      </button>
      
      <button
        onClick={onUnderline}
        className="p-2.5 hover:bg-gradient-to-br from-green-600/30 to-emerald-600/30 rounded-xl text-gray-300 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
        title="Underline"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
        </svg>
      </button>
      
      <div className="w-px h-6 bg-gradient-to-b from-gray-600 to-gray-800 mx-1"></div>
      
      <button
        onClick={onBulletList}
        className="p-2.5 hover:bg-gradient-to-br from-yellow-600/30 to-orange-600/30 rounded-xl text-gray-300 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
        title="Bullet List"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
        </svg>
      </button>
      
      <button
        onClick={onNumberedList}
        className="p-2.5 hover:bg-gradient-to-br from-red-600/30 to-pink-600/30 rounded-xl text-gray-300 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
        title="Numbered List"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
        </svg>
      </button>
      
      <div className="w-px h-6 bg-gradient-to-b from-gray-600 to-gray-800 mx-1"></div>
      
      <button
        onClick={onClear}
        className="p-2.5 hover:bg-gradient-to-br from-gray-600/30 to-gray-700/30 rounded-xl text-gray-300 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
        title="Clear Formatting"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.14 3c-.51 0-1.02.2-1.41.59L2.59 14.73c-.78.78-.78 2.05 0 2.83L5.03 20H7.66 18c.55 0 1-.45 1-1s-.45-1-1-1H9.66l5.75-5.75 4-4L19.14 5.59c-.78-.78-2.05-.78-2.83 0L8.17 13.73 6.73 12.29 14.59 4.43c.78-.78.78-2.05 0-2.83L15.14 3zM5.03 16L4 17.03 6.97 20l1.03-1.03L5.03 16z"/>
        </svg>
      </button>
    </div>
  );
};

export default WritingToolbar;
