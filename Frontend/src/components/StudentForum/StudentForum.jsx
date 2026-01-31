import { useState, useEffect, useRef } from "react";
import { Search, Zap, Monitor, BarChart3, Briefcase, Lightbulb, MessageSquare, ArrowRight, Plus, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QuestionCard } from "./QuestionCard";
import { AskQuestionModal } from "./AskQuestionModal";
import * as forumService from "../../services/forumService";

const domains = [
  { id: "for-you", label: "For You", icon: Zap },
  { id: "engineering", label: "Engineering", icon: Monitor },
  { id: "data-science", label: "Data Science", icon: BarChart3 },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "product", label: "Product", icon: Lightbulb },
];

export function StudentForum() {
  const [selectedDomain, setSelectedDomain] = useState("for-you");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("most-recent");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sortDropdownRef = useRef(null);

  const sortOptions = [
    { value: "most-recent", label: "Most Recent" },
    { value: "most-upvoted", label: "Most Upvoted" },
    { value: "most-answered", label: "Most Answered" },
  ];

  const selectedSortLabel = sortOptions.find(o => o.value === sortBy)?.label || "Most Recent";

  // Get user from localStorage
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await forumService.getAllQuestions(1, 50);
        setQuestions(result.questions || []);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isSortOpen) return;
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isSortOpen]);

  // Dynamic date formatter
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks < 4) return `${diffWeeks}w ago`;
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    if (diffYears >= 1) return `${diffYears}y ago`;
    return date.toLocaleDateString();
  };

  // Calculate user-specific statistics
  const userStats = {
    myQuestions: questions.filter(q => q.author?._id === user?._id || q.author?.name === user?.name).length,
    answeredQuestions: questions.filter(q =>
      (q.author?._id === user?._id || q.author?.name === user?.name) &&
      q.answers && q.answers.length > 0
    ).length,
    pendingQuestions: questions.filter(q =>
      (q.author?._id === user?._id || q.author?.name === user?.name) &&
      (!q.answers || q.answers.length === 0)
    ).length
  };

  // Filter and sort questions
  const filteredQuestions = questions.filter((q) => {
    if (selectedDomain !== "for-you" && q.category !== selectedDomain) return false;
    if (searchQuery && !q.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !q.content?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "most-recent") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    } else if (sortBy === "most-upvoted") {
      return (b.upvotes || 0) - (a.upvotes || 0);
    } else if (sortBy === "most-answered") {
      return (b.answers?.length || 0) - (a.answers?.length || 0);
    }
    return 0;
  });

  return (
    <div className="h-screen bg-[#050505] text-white overflow-hidden selection:bg-indigo-500/30 relative">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-8 h-full relative z-10">
        <div className="flex gap-8 h-full">
          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold mb-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                  Forum - Ask Mentors Anything
                </span>
              </h1>
              <p className="text-gray-400 text-sm max-w-3xl leading-relaxed">
                Get your doubts cleared by experienced mentors. Ask questions about career, technology, interviews, and
                more. The community is here to help you succeed.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative mb-8"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search Questions Here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 bg-white/[0.03] border border-white/10 text-white placeholder:text-gray-500 h-14 rounded-2xl focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all backdrop-blur-md shadow-lg shadow-black/20"
              />
            </motion.div>

            {/* Domain Filters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-4 pl-1">Browse by Domain</p>
              <div className="flex gap-3 flex-wrap">
                {domains.map((domain) => {
                  const Icon = domain.icon;
                  const isSelected = selectedDomain === domain.id;
                  return (
                    <button
                      key={domain.id}
                      onClick={() => setSelectedDomain(domain.id)}
                      className={`group flex flex-col items-center justify-center px-6 py-4 rounded-xl border transition-all duration-300 ${isSelected
                          ? "bg-white text-black border-white shadow-lg shadow-white/10"
                          : "bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.08] hover:border-white/20 hover:text-white"
                        }`}
                    >
                      <Icon className={`h-5 w-5 mb-2 transition-colors ${isSelected ? 'text-black' : 'text-gray-500 group-hover:text-white'}`} />
                      <span className="text-xs font-medium">{domain.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Questions Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Discussion</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5"
                >
                  <Plus className="h-4 w-4" />
                  Ask Question
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <div className="relative" ref={sortDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsSortOpen(prev => !prev)}
                      className="flex items-center justify-between gap-2 min-w-[160px] bg-white/[0.03] border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm hover:bg-white/[0.08] transition-all focus:outline-none"
                      aria-haspopup="listbox"
                      aria-expanded={isSortOpen}
                    >
                      <span className="truncate">{selectedSortLabel}</span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isSortOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                          className="absolute right-0 mt-2 w-[200px] bg-[#121212] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 backdrop-blur-xl"
                        >
                          <div className="py-1" role="listbox" aria-label="Sort options">
                            {sortOptions.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setSortBy(opt.value);
                                  setIsSortOpen(false);
                                }}
                                className={`w-full text-left px-5 py-3 text-sm transition-colors ${opt.value === sortBy
                                    ? 'bg-white/10 text-white font-medium'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                  }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4 pb-12">
              {loading ? (
                <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-20 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mb-4"></div>
                  <p className="text-gray-500">Loading conversations...</p>
                </div>
              ) : error ? (
                <div className="bg-red-500/5 rounded-2xl border border-red-500/20 p-16 flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-7 w-7 text-red-500" />
                  </div>
                  <p className="text-red-400 font-medium">{error}</p>
                </div>
              ) : filteredQuestions.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {filteredQuestions.map((question) => (
                    <motion.div
                      key={question._id || question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <QuestionCard question={question} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-20 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <MessageSquare className="h-7 w-7 text-gray-500" />
                  </div>
                  <p className="text-gray-400 font-medium">No discussions found</p>
                  <p className="text-gray-600 text-sm mt-2">Try adjusting your filters or search query</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-80 space-y-6 overflow-y-auto hidden lg:block"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Info Card */}
            <div className="group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-5 flex items-center gap-4 cursor-pointer hover:bg-white/[0.05] hover:border-white/20 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 border border-white/5 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors">How to Ask Better Questions</p>
                <p className="text-xs text-gray-500 mt-1"> Read the guide</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors group-hover:translate-x-1" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4">
              {/* My Questions */}
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/[0.05] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white mb-1">{userStats.myQuestions}</p>
                  <p className="text-sm text-gray-400 font-medium">My Questions</p>
                </div>
              </div>

              {/* Answered */}
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/[0.05] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Zap className="h-5 w-5 text-green-400" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white mb-1">{userStats.answeredQuestions}</p>
                  <p className="text-sm text-gray-400 font-medium">Answered</p>
                </div>
              </div>

              {/* Pending */}
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/[0.05] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Monitor className="h-5 w-5 text-orange-400" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white mb-1">{userStats.pendingQuestions}</p>
                  <p className="text-sm text-gray-400 font-medium">Pending</p>
                </div>
              </div>
            </div>

            {/* Top Mentors */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <p className="font-semibold text-sm mb-5 text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" /> Top Contributors
              </p>
              <div className="space-y-5">
                {[
                  { name: "Rahul Kumar", answers: 142, initials: "RK", color: "from-blue-500 to-indigo-600" },
                  { name: "Sneha Patel", answers: 98, initials: "SP", color: "from-purple-500 to-pink-600" },
                  { name: "Arun Mehta", answers: 76, initials: "AM", color: "from-emerald-500 to-teal-600" }
                ].map((mentor, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${mentor.color} flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                      {mentor.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">{mentor.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden max-w-[80px]">
                          <div className="h-full bg-white/50 w-[70%]" />
                        </div>
                        <p className="text-[10px] text-gray-500">{mentor.answers}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ask Question Modal */}
      <AskQuestionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onQuestionCreated={(newQuestion) => {
          setQuestions([newQuestion, ...questions]);
        }}
      />
    </div>
  );
}

function Trophy(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
