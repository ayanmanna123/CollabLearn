import React from 'react';

const MentorSort = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'newest', label: 'Recently Joined' }
  ];

  return (
    <div className="flex items-center space-x-3">
      <span className="text-gray-300 text-sm font-bold">Sort by:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value} className="bg-gray-800 text-white">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MentorSort;
