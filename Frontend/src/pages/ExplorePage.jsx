import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/backendConfig';
import Navbar from '../components/StudentDashboard/Navbar';

// Components
import MentorCard from '../components/Explore/MentorCard';
import TopExperts from '../components/Explore/TopExperts';
import TopOfferings from '../components/Explore/TopOfferings';
import CategoryList from '../components/Explore/CategoryList';
import UserProfileCard from '../components/Explore/UserProfileCard';
import MentorFilters from '../components/Explore/MentorFilters';
import MentorSort from '../components/Explore/MentorSort';

// Mock data
import INDIAN_MENTORS_MOCK_DATA from '../mockData/indianMentorsApi';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All Mentors');
  const [searchQuery, setSearchQuery] = useState('');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Advanced filters state
  const [filters, setFilters] = useState({
    skills: [],
    minRating: '',
    minRate: '',
    maxRate: '',
    availability: [],
    location: '',
    experience: ''
  });
  const [sortBy, setSortBy] = useState('');
  const [availableSkills, setAvailableSkills] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch mentors from API
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Build query params
        const params = new URLSearchParams();

        // Legacy category filter
        if (activeCategory !== 'All Mentors') {
          params.append('skill', activeCategory);
        }

        // Advanced filters
        if (filters.skills.length > 0) {
          params.append('skills', filters.skills.join(','));
        }
        if (filters.minRating) {
          params.append('minRating', filters.minRating);
        }
        if (filters.minRate) {
          params.append('minRate', filters.minRate);
        }
        if (filters.maxRate) {
          params.append('maxRate', filters.maxRate);
        }
        if (filters.availability.length > 0) {
          params.append('availability', filters.availability.join(','));
        }
        if (filters.location.trim()) {
          params.append('location', filters.location.trim());
        }
        if (filters.experience) {
          params.append('experience', filters.experience);
        }
        if (sortBy) {
          params.append('sortBy', sortBy);
        }

        const queryString = params.toString();
        let url = `${API_BASE_URL}/mentors`;
        if (queryString) {
          url += `?${queryString}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success && data.mentors && data.mentors.length > 0) {
          // Transform API data to match your component's expected format
          const transformedMentors = data.mentors.map(mentor => {
            const profilePic = mentor.profilePicture || mentor.mentorProfile?.profilePicture || '';
            console.log(`📸 Mentor: ${mentor.name}, ProfilePicture: ${profilePic ? 'YES' : 'NO'}`);
            return {
              id: mentor._id,
              name: mentor.name,
              title: mentor.headline || 'Mentor',
              companies: mentor.company || 'N/A',
              experience: mentor.experience || 'N/A',
              bio: mentor.bio || '',
              location: mentor.location || '',
              tags: Array.isArray(mentor.skills)
                ? mentor.skills
                    .map((skill) => (typeof skill === 'string' ? skill : skill?.name))
                    .filter(Boolean)
                : [],
              rating: mentor.averageRating || 0,
              ratedCount: mentor.totalReviews || 0,
              price: mentor.hourlyRate || 0,
              priceUnit: 'Per Min',
              image: profilePic,
              isOnline: mentor.isOnline || false,
              availability: mentor.availability || []
            };
          });

          // Collect available skills for filter dropdown
          const allSkills = new Set();
          transformedMentors.forEach(mentor => {
            mentor.tags.forEach(tag => allSkills.add(tag));
          });
          setAvailableSkills(Array.from(allSkills).sort());

          // Merge with mock data - API data first, then mock data
          const apiIds = new Set(transformedMentors.map(m => m.id));
          const mockDataToAdd = INDIAN_MENTORS_MOCK_DATA.filter(mock => !apiIds.has(mock.id));
          const mergedMentors = [...transformedMentors, ...mockDataToAdd];

          console.log('✅ Transformed mentors:', mergedMentors);
          setMentors(mergedMentors);
        } else {
          // If API fails or returns no data, use mock data
          console.log('📊 Using mock data as fallback');
          setMentors(INDIAN_MENTORS_MOCK_DATA);
        }
      } catch (err) {
        console.error('Error fetching mentors:', err);
        setError('Failed to load mentors');
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [activeCategory, filters, sortBy]);

  // Filter mentors based on search query
  const filteredMentors = mentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white pt-14">
      <Navbar userName={user?.name || 'Student'} />
      
      <div className="flex-1 overflow-hidden">
        <div class="max-w-7xl mx-auto pl-2 pr-2 sm:pl-3 sm:pr-3 lg:pl-4 lg:pr-4 py-8 h-full">
          {/* Main Grid Layout */}
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* Left Sidebar - Column 1 */}
            <div className="col-span-2 space-y-6 -ml-[60px]">
              <div className="glass-card rounded-2xl p-5 border border-gray-700/30 hover-lift">
                <CategoryList 
                  activeCategory={activeCategory} 
                  onCategoryClick={setActiveCategory} 
                />
              </div>
              <UserProfileCard user={user} />
            </div>

            {/* Main Content - Middle Column */}
            <div className="col-span-7 flex flex-col h-full overflow-hidden">
              {/* Search Bar */}
              <div className="relative mb-5 flex-shrink-0">
                <div className="glass-card rounded-2xl p-1 border border-gray-700/30 hover-lift">
                  <input
                    type="text"
                    placeholder="Search mentors, skills, or topics..."
                    className="w-full px-5 py-3.5 pl-12 rounded-2xl bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:bg-gray-800/70"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute left-4 top-3.5 p-1.5 rounded-lg bg-blue-500/10">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Filters and Sort */}
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div className="glass-card rounded-2xl p-4 border border-gray-700/30 hover-lift relative z-50">
                  <MentorFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    availableSkills={availableSkills}
                  />
                </div>
                <div className="glass-card rounded-2xl p-4 border border-gray-700/30 hover-lift relative z-40">
                  <MentorSort
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                  />
                </div>
              </div>

              {/* Mentor Cards */}
              <div className="flex-1 overflow-y-auto custom-scroll space-y-4 pr-2">
                {loading ? (
                  <div className="flex justify-center items-center h-full py-20">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    <span className="ml-3 text-gray-400 text-lg font-medium">Loading mentors...</span>
                  </div>
                ) : error ? (
                  <div className="flex justify-center items-center h-full py-20">
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-red-900/20 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-red-500 text-lg font-medium">{error}</div>
                    </div>
                  </div>
                ) : filteredMentors.length === 0 ? (
                  <div className="flex justify-center items-center h-full py-20">
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.329M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="text-gray-400 text-lg font-medium">No mentors found</div>
                      <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                  </div>
                ) : (
                  filteredMentors.map((mentor) => (
                    <MentorCard key={mentor.id} mentor={mentor} />
                  ))
                )}
              </div>
            </div>

            {/* Right Sidebar - Column 3 */}
            <div className="col-span-3 space-y-6">
              <div className="glass-card rounded-2xl p-5 border border-gray-700/30 hover-lift">
                <TopExperts />
              </div>
              <div className="glass-card rounded-2xl p-5 border border-gray-700/30 hover-lift">
                <TopOfferings />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;