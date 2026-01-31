import { useState } from "react";
import { MessageSquare, ChevronUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as forumService from "../../services/forumService";

export function QuestionCard({ question }) {
  const navigate = useNavigate();
  const [upvoted, setUpvoted] = useState(false);
  const [currentUpvotes, setCurrentUpvotes] = useState(question.upvotes || 0);
  const [isUpvoting, setIsUpvoting] = useState(false);

  // Get author initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Format date dynamically
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

  const handleUpvote = async (e) => {
    e.stopPropagation(); // Prevent card click
    try {
      setIsUpvoting(true);
      await forumService.upvoteQuestion(question._id || question.id);

      if (upvoted) {
        setCurrentUpvotes(currentUpvotes - 1);
      } else {
        setCurrentUpvotes(currentUpvotes + 1);
      }
      setUpvoted(!upvoted);
    } catch (err) {
      console.error('Error upvoting:', err);
    } finally {
      setIsUpvoting(false);
    }
  };

  const authorName = question.author?.name || "Unknown User";
  const authorInitials = getInitials(authorName);

  return (
    <div
      onClick={() => navigate(`/student/forum/question/${question._id || question.id}`)}
      className="group bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
    >
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
          {authorInitials}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{authorName}</span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Student</span>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <span>{formatDate(question.createdAt)}</span>
          </div>
        </div>
        <div className="ml-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
            <span className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(question.category)}`}></span>
            {question.category || "General"}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="mb-5 relative z-10">
        <h3 className="text-lg font-semibold text-white mb-2 leading-tight group-hover:text-blue-100 transition-colors">{question.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{question.content}</p>
      </div>

      {/* Answer Preview */}
      {question.answers && question.answers.length > 0 && (
        <div className="mb-5 bg-black/20 rounded-xl p-4 border border-white/5 relative z-10">
          <div className="flex gap-3">
            <div className="w-0.5 bg-indigo-500/50 rounded-full h-auto"></div>
            <div>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 italic">"{question.answers[0].content}"</p>
              {question.answers.length > 1 && (
                <span className="text-xs text-indigo-400 font-medium mt-2 inline-block">
                  +{question.answers.length - 1} more answers
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={handleUpvote}
            disabled={isUpvoting}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${upvoted
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "text-gray-400 hover:bg-white/10 hover:text-white"
              } ${isUpvoting ? "opacity-50" : ""}`}
          >
            <ChevronUp className={`h-4 w-4 ${upvoted ? 'fill-indigo-300' : ''}`} />
            <span>{currentUpvotes}</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            <MessageSquare className="h-4 w-4" />
            <span>{question.answers?.length || 0} replies</span>
          </div>
        </div>

        <span className="text-indigo-400 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
          Read More <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}

const getCategoryColor = (category) => {
  switch (category?.toLowerCase()) {
    case 'engineering': return 'bg-blue-500';
    case 'data-science': return 'bg-green-500';
    case 'business': return 'bg-orange-500';
    case 'product': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
}
