import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MentorNavbar from '../components/MentorDashboard/Navbar';
import Navbar from '../components/StudentDashboard/Navbar';
import { ArrowLeft, ThumbsUp, MessageSquare, Share2, Flag } from 'lucide-react';
import * as forumService from '../services/forumService';

export default function QuestionDetailPage() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answerContent, setAnswerContent] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [answerError, setAnswerError] = useState(null);
  const [upvoted, setUpvoted] = useState(false);

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const userRole = user?.role || 'student';
  const isMentor = userRole === 'mentor';

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await forumService.getQuestionById(questionId);
        setQuestion(result.question);
      } catch (err) {
        console.error('Error fetching question:', err);
        setError(err.message || 'Failed to load question');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    if (!answerContent.trim()) {
      setAnswerError('Answer cannot be empty');
      return;
    }

    try {
      setSubmittingAnswer(true);
      setAnswerError(null);

      const result = await forumService.answerQuestion(questionId, answerContent);
      setQuestion(result.question);
      setAnswerContent('');
    } catch (err) {
      console.error('Error submitting answer:', err);
      setAnswerError(err.message || 'Failed to submit answer');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleUpvote = async () => {
    try {
      const result = await forumService.upvoteQuestion(questionId);
      setQuestion(prev => ({
        ...prev,
        upvotes: result.upvotes
      }));
      setUpvoted(!upvoted);
    } catch (err) {
      console.error('Error upvoting:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#0a0a0a] flex flex-col">
        {isMentor ? <MentorNavbar userName={user?.name} /> : <Navbar userName={user?.name} />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-400">Loading question...</div>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="h-screen bg-[#0a0a0a] flex flex-col">
        {isMentor ? <MentorNavbar userName={user?.name} /> : <Navbar userName={user?.name} />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || 'Question not found'}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const authorName = question.author?.name || "Unknown User";
  const authorInitials = getInitials(authorName);

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col">
      {isMentor ? <MentorNavbar userName={user?.name} /> : <Navbar userName={user?.name} />}
      
      <div className="flex-1 overflow-y-auto pt-14" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Forum
          </button>

          {/* Question Section */}
          <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-6 mb-8">
            {/* Question Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{question.title}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                      {authorInitials}
                    </div>
                    <span>{authorName}</span>
                  </div>
                  <span>•</span>
                  <span>{formatDate(question.createdAt)}</span>
                </div>
              </div>
              <span className="bg-[#2a2a2a] text-gray-300 text-xs px-3 py-1 rounded-full">
                {question.category || "general"}
              </span>
            </div>

            {/* Question Content */}
            <p className="text-gray-300 text-lg leading-relaxed mb-6">{question.content}</p>

            {/* Question Stats */}
            <div className="flex items-center gap-6 pt-4 border-t border-[#2a2a2a]">
              <button
                onClick={handleUpvote}
                className={`flex items-center gap-2 transition-colors ${
                  upvoted ? 'text-blue-500' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <ThumbsUp size={18} />
                <span>{question.upvotes || 0}</span>
              </button>
              <div className="flex items-center gap-2 text-gray-400">
                <MessageSquare size={18} />
                <span>{question.answers?.length || 0} Answers</span>
              </div>
              <button className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors">
                <Share2 size={18} />
                <span>Share</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors ml-auto">
                <Flag size={18} />
              </button>
            </div>
          </div>

          {/* Answers Section */}
          {question.answers && question.answers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
              </h2>
              <div className="space-y-4">
                {question.answers.map((answer, idx) => (
                  <div key={idx} className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => answer.author?.name && navigate(`/mentor-profile?mentor=${encodeURIComponent(answer.author.name)}`)}
                      >
                        <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-medium overflow-hidden flex-shrink-0">
                          {answer.author?.profilePicture ? (
                            <img 
                              src={answer.author.profilePicture} 
                              alt={answer.author?.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextElementSibling) {
                                  e.target.nextElementSibling.style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <span 
                            style={{ display: answer.author?.profilePicture ? 'none' : 'flex' }}
                            className="w-full h-full flex items-center justify-center bg-green-600"
                          >
                            {getInitials(answer.author?.name)}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium hover:text-blue-400 transition-colors">{answer.author?.name || "Anonymous"}</p>
                          <p className="text-xs text-gray-400">{formatDate(answer.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <ThumbsUp size={16} />
                        <span className="text-sm">{answer.upvotes || 0}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{answer.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answer Form */}
          <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Your Answer</h2>

            {answerError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4">
                {answerError}
              </div>
            )}

            <form onSubmit={handleAnswerSubmit}>
              {/* Answer Textarea */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Write your answer</label>
                <textarea
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder="Provide a detailed answer to help the community..."
                  rows={8}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder:text-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {answerContent.length} characters
                </p>
              </div>

              {/* Formatting Tips */}
              <div className="bg-[#0a0a0a] rounded-lg p-4 mb-4 border border-[#2a2a2a]">
                <p className="text-sm text-gray-400 mb-2">💡 Tips for a great answer:</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Be specific and provide context</li>
                  <li>• Include code examples if relevant</li>
                  <li>• Explain your reasoning</li>
                  <li>• Help others learn from your answer</li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submittingAnswer || !answerContent.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
              >
                {submittingAnswer ? 'Posting Answer...' : 'Post Your Answer'}
              </button>
            </form>
          </div>

          {/* Spacing */}
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}
