import React, { useState } from 'react';

const MentorFilters = ({ filters, onFiltersChange, availableSkills }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleSkillToggle = (skill) => {
    const currentSkills = filters.skills || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];

    handleFilterChange('skills', newSkills);
  };

  const handleAvailabilityToggle = (day) => {
    const currentAvailability = filters.availability || [];
    const newAvailability = currentAvailability.includes(day)
      ? currentAvailability.filter(d => d !== day)
      : [...currentAvailability, day];

    handleFilterChange('availability', newAvailability);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      skills: [],
      minRating: '',
      minRate: '',
      maxRate: '',
      availability: [],
      location: '',
      experience: ''
    });
  };

  const activeFiltersCount = Object.values(filters).reduce((count, value) => {
    if (Array.isArray(value)) return count + value.length;
    if (value && value.toString().trim()) return count + 1;
    return count;
  }, 0);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover-lift"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="bg-white text-blue-600 text-xs px-2.5 py-1 rounded-full font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-96 glass-card rounded-2xl border border-gray-700/30 shadow-2xl z-50 hover-lift">
          <div class="p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-700/30">
              <h3 className="text-white font-bold text-lg bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Filters</h3>
              <button
                onClick={clearAllFilters}
                className="text-gray-400 hover:text-red-400 text-sm font-bold transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Skills Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3">Skills</label>
              <div class="max-h-32 overflow-y-auto custom-scroll space-y-2">
                {availableSkills.map(skill => (
                  <label key={skill} className="flex items-center space-x-3 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.skills?.includes(skill) || false}
                      onChange={() => handleSkillToggle(skill)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800/50 text-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 focus:ring-offset-gray-900"
                    />
                    <span className="text-gray-300 font-medium">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3">
                Minimum Rating: {filters.minRating || 'Any'}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={filters.minRating || 1}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                <span>1</span>
                <span>5</span>
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Min Rate ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minRate}
                  onChange={(e) => handleFilterChange('minRate', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Max Rate ($)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={filters.maxRate}
                  onChange={(e) => handleFilterChange('maxRate', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3">Available Days</label>
              <div class="grid grid-cols-2 gap-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <label key={day} className="flex items-center space-x-3 text-sm capitalize">
                    <input
                      type="checkbox"
                      checked={filters.availability?.includes(day) || false}
                      onChange={() => handleAvailabilityToggle(day)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800/50 text-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 focus:ring-offset-gray-900"
                    />
                    <span className="text-gray-300 font-medium">{day.slice(0, 3)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Location</label>
              <input
                type="text"
                placeholder="City, State, or Country"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Min Experience (years)</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorFilters;
