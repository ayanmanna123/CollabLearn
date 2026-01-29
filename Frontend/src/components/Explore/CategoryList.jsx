import React from 'react';
import { FiUsers, FiStar, FiClock, FiMessageSquare, FiDollarSign, FiUser, FiCode, FiGlobe } from 'react-icons/fi';

const categories = [
  { name: 'All Mentors', count: 24, icon: <FiUsers className="mr-2" size={18} style={{ color: '#ffffff' }} /> },
  { name: 'Software Engineering', count: 15, icon: <FiCode className="mr-2" size={18} style={{ color: '#ffffff' }} /> },
  { name: 'Product Management', count: 10, icon: <FiClock className="mr-2" size={18} style={{ color: '#ffffff' }} /> },
  { name: 'Career Guidance', count: 18, icon: <FiMessageSquare className="mr-2" size={18} style={{ color: '#ffffff' }} /> },
  { name: 'Business & Marketing', count: 12, icon: <FiDollarSign className="mr-2" size={18} style={{ color: '#ffffff' }} /> },
  { name: 'Design & UX', count: 9, icon: <FiStar className="mr-2" size={18} style={{ color: '#ffffff' }} /> },
  { name: 'Data Science & AI', count: 14, icon: <FiStar className="mr-2" size={18} style={{ color: '#ffffff' }} /> },
  { name: 'Web Development', count: 20, icon: <FiGlobe className="mr-2" size={18} style={{ color: '#ffffff' }} /> },
];

const CategoryList = ({ activeCategory, onCategoryClick }) => {
  return (
    <div className="bg-transparent rounded-2xl border border-gray-700/30 overflow-hidden flex flex-col h-[450px]">
      <div className="p-4 border-b border-gray-700/50 flex-shrink-0">
        <h3 className="text-lg font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Categories</h3>
      </div>
      <div className="divide-y divide-gray-700/30 overflow-y-auto flex-1 custom-scroll">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`flex items-center justify-between p-4 cursor-pointer transition-all duration-300 rounded-lg mx-2 my-1 ${
              activeCategory === category.name 
                ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white border border-blue-500/30' 
                : 'text-gray-300 hover:bg-gray-800/50 hover:border hover:border-gray-600/30'
            }`}
            onClick={() => onCategoryClick(category.name)}
          >
            <div className="flex items-center">
              {category.icon}
              <span className="text-sm font-bold">{category.name}</span>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-gray-700/50 to-gray-800/50 text-gray-300 border border-gray-600/30">
              {category.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
