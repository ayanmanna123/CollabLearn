import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Zap, Award, CheckCircle2, Trophy, Clock, Flame, TrendingUp, RefreshCw, Plus, Target, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/StudentDashboard/Navbar';
import { TaskCard } from '../components/StudentTasks/TaskCard';
import { fetchStudentTasks } from '../services/studentTasksApi';

const scrollStyles = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

if (typeof document !== 'undefined') {
  const styleTagId = 'student-task-page-no-scrollbar';
  if (!document.getElementById(styleTagId)) {
    const styleSheet = document.createElement('style');
    styleSheet.id = styleTagId;
    styleSheet.textContent = scrollStyles;
    document.head.appendChild(styleSheet);
  }
}

const StudentTaskPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);

      if (!user._id) {
        setError('User ID not found');
        setLoading(false);
        return;
      }

      const data = await fetchStudentTasks(user._id);
      setTasks(data.tasks || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    // Update the task in the local state
    setTasks(prevTasks =>
      prevTasks.map(task =>
        (task._id === updatedTask._id || task.id === updatedTask.id)
          ? updatedTask
          : task
      )
    );
  };

  // Filter tasks based on active filter
  const getFilteredTasks = () => {
    if (activeFilter === 'all') {
      return tasks;
    }
    return tasks.filter(task => task.status === activeFilter);
  };

  const filteredTasks = getFilteredTasks();

  // Get task counts by status
  const getTaskCount = (status) => {
    if (status === 'all') {
      return tasks.length;
    }
    return tasks.filter(task => task.status === status).length;
  };

  // Calculate stats
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const notStartedTasks = tasks.filter((t) => t.status === 'not-started');
  const pendingReviewTasks = tasks.filter((t) => t.status === 'pending-review');

  const totalPoints = tasks.reduce((acc, t) => acc + (t.points || 0), 0);
  const earnedPoints = completedTasks.reduce((acc, t) => acc + (t.points || 0), 0);
  const progressPercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const streak = 7; // Mock streak

  // Stats Card Component
  const StatsCard = ({ title, value, subtitle, icon: Icon, iconColor, iconBg }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:bg-white/[0.05] transition-all duration-300 group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">{title}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
              <span className="text-sm text-gray-500">{subtitle}</span>
            </div>
          </div>
          <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Empty State Component
  const EmptyState = ({ icon: Icon, title, description }) => (
    <div className="text-center py-16 bg-white/[0.02] rounded-3xl border border-white/5 mx-4">
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Icon className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-sm mx-auto">{description}</p>
    </div>
  );

  // Scrollable Section Component
  const ScrollableSection = ({ tasks, title, icon: Icon, color, emptyIcon, emptyTitle, emptyDescription, delay = 0 }) => {
    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(tasks.length > 3);

    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const scroll = (direction) => {
      if (scrollRef.current) {
        const scrollAmount = 400;
        scrollRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    };

    return (
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay }}
        className="relative"
      >
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className={`p-2 rounded-xl bg-white/5 border border-white/10`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <h2 className="text-xl font-semibold text-white tracking-tight">
            {title}
            <span className="ml-3 px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 text-xs font-medium border border-white/5">
              {tasks.length}
            </span>
          </h2>
        </div>

        {tasks.length > 0 ? (
          <div className="relative group/section">
            {/* Left Arrow */}
            {showLeftArrow && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 backdrop-blur-md border border-white/10 hover:bg-white/10 rounded-full transition-all -ml-4 opacity-0 group-hover/section:opacity-100 shadow-xl"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
            )}

            {/* Scrollable Container */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="no-scrollbar flex gap-6 overflow-x-auto pb-8 pt-2 px-2 scroll-smooth"
              style={{ scrollBehavior: 'smooth' }}
            >
              {tasks.map((task) => (
                <motion.div
                  key={task._id || task.id}
                  className="flex-shrink-0 w-full md:w-[45%] lg:w-[32%]"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <TaskCard task={task} onTaskUpdate={handleTaskUpdate} />
                </motion.div>
              ))}
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 backdrop-blur-md border border-white/10 hover:bg-white/10 rounded-full transition-all -mr-4 opacity-0 group-hover/section:opacity-100 shadow-xl"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            )}
          </div>
        ) : (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
          />
        )}
      </motion.section>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-indigo-500/30">
      <Navbar userName={user?.name || 'Student'} />

      {/* Header */}
      <div className="relative pt-32 pb-12 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
                My Tasks
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl font-light leading-relaxed">
              Track your progress, complete assignments, and earn points on your journey to mastery.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatsCard
            title="Total Points"
            value={earnedPoints}
            subtitle={`/ ${totalPoints} pts`}
            icon={Trophy}
            iconColor="text-yellow-400"
            iconBg="bg-yellow-400/10"
          />
          <StatsCard
            title="Completed"
            value={completedTasks.length}
            subtitle={`of ${tasks.length} tasks`}
            icon={CheckCircle2}
            iconColor="text-green-400"
            iconBg="bg-green-400/10"
          />
          <StatsCard
            title="In Progress"
            value={inProgressTasks.length}
            subtitle="active tasks"
            icon={Clock}
            iconColor="text-blue-400"
            iconBg="bg-blue-400/10"
          />
          <StatsCard
            title="Day Streak"
            value={streak}
            subtitle="days on fire"
            icon={Flame}
            iconColor="text-orange-400"
            iconBg="bg-orange-400/10"
          />
        </div>

        {/* Task Sections */}
        <div className="space-y-12">
          {/* Completed Tasks */}
          <ScrollableSection
            tasks={completedTasks}
            title="Completed"
            icon={CheckCircle2}
            color="text-green-400"
            emptyIcon={CheckCircle2}
            emptyTitle="No completed tasks yet"
            emptyDescription="Complete your tasks to see them here"
            delay={0.1}
          />

          {/* In Progress Tasks */}
          <ScrollableSection
            tasks={inProgressTasks}
            title="In Progress"
            icon={Clock}
            color="text-blue-400"
            emptyIcon={Zap}
            emptyTitle="No tasks in progress"
            emptyDescription="Start a task to see it here"
            delay={0.2}
          />

          {/* Pending Review Tasks */}
          <ScrollableSection
            tasks={pendingReviewTasks}
            title="Pending Review"
            icon={Award}
            color="text-purple-400"
            emptyIcon={AlertCircle}
            emptyTitle="No tasks pending review"
            emptyDescription="Submit your tasks for mentor review"
            delay={0.3}
          />

          {/* Not Started Tasks */}
          <ScrollableSection
            tasks={notStartedTasks}
            title="Not Started"
            icon={Target}
            color="text-gray-400"
            emptyIcon={FileText}
            emptyTitle="No tasks to start"
            emptyDescription="Your mentor will assign tasks here"
            delay={0.4}
          />
        </div>
      </main>
    </div>
  );
};

export default StudentTaskPage;
