import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import MentorNavbar from '../components/MentorDashboard/Navbar';
import PageLoader from '../components/PageLoader';
import { getApiUrl } from '../config/backendConfig';

const MentorReviewsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);

  const API_URL = getApiUrl().replace(/\/$/, '');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch(`${API_URL}/user/me`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Failed to load profile');
        setProfile(data.user);
      } catch (e) {
        console.error('MentorReviewsPage profile error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API_URL, navigate]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const mentorId = profile?._id;
        if (!token || !mentorId) {
          setReviewsLoading(false);
          return;
        }

        setReviewsLoading(true);
        const base = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;
        const res = await fetch(`${base}/api/reviews?mentor=${mentorId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Failed to load reviews');
        setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
      } catch (e) {
        console.error('MentorReviewsPage reviews error:', e);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [API_URL, profile?._id]);

  const groups = useMemo(() => {
    const isVideo = (r) => typeof r?.review === 'string' && r.review.trim().toLowerCase().startsWith('http');
    const hasText = (r) => typeof r?.review === 'string' && r.review.trim().length > 0;

    const videos = reviews.filter(isVideo);
    const ratings = reviews.filter((r) => typeof r?.rating === 'number');
    const sessionReviews = reviews.filter((r) => hasText(r) && !isVideo(r));
    const trialReviews = [];

    return { videos, ratings, sessionReviews, trialReviews };
  }, [reviews]);

  const formatWhen = (createdAt) => {
    try {
      return createdAt ? new Date(createdAt).toLocaleDateString() : '';
    } catch {
      return '';
    }
  };

  const ReviewHeader = ({ review }) => (
    <div className="flex items-center min-w-0">
      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 overflow-hidden">
        {review.student?.profilePicture ? (
          <img
            src={review.student.profilePicture}
            alt={review.student?.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-semibold text-sm">{review.student?.name?.charAt(0) || 'S'}</span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-white font-medium text-sm truncate">{review.student?.name || 'Anonymous'}</p>
        <p className="text-gray-400 text-xs truncate">{formatWhen(review.createdAt)}</p>
      </div>
    </div>
  );

  const RatingStars = ({ value }) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <FiStar
          key={i}
          className={`w-3.5 h-3.5 ${i < value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
        />
      ))}
    </div>
  );

  const ColumnShell = ({ title, count, children }) => (
    <div className="bg-[#121212] rounded-xl border border-gray-700 p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <span className="text-xs text-gray-400">{count}</span>
      </div>
      <div className="space-y-3 max-h-[70vh] overflow-y-auto custom-scroll pr-1">
        {children}
      </div>
    </div>
  );

  const EmptyState = ({ label }) => (
    <div className="text-center py-10">
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  );

  if (loading) return <PageLoader label="Loading reviews..." />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <MentorNavbar userName={profile?.name || 'Mentor'} />

      <div className="pt-20 px-6 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-white">All Reviews</h1>
              <p className="text-sm text-gray-400">Videos, ratings, and session feedback</p>
            </div>
            <button
              onClick={() => navigate('/mentor/dashboard')}
              className="px-3 py-2 bg-[#202327] hover:bg-[#2a3038] border border-gray-600/60 rounded-md text-sm text-white transition-colors"
            >
              Back
            </button>
          </div>

          {reviewsLoading ? (
            <div className="text-center py-10 text-gray-400">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <ColumnShell title="Videos" count={groups.videos.length}>
                {groups.videos.length === 0 ? (
                  <EmptyState label="No video testimonials" />
                ) : (
                  groups.videos.map((review) => (
                    <div
                      key={review._id}
                      className="w-full px-3 py-2 bg-[#202327] rounded-md border border-gray-600/60"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <ReviewHeader review={review} />
                        {typeof review.rating === 'number' && <RatingStars value={review.rating} />}
                      </div>
                      <div className="bg-[#0f1115] rounded-md px-3 py-2 flex items-center justify-between">
                        <p className="text-gray-400 text-xs">Video</p>
                        <a
                          href={review.review}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-200 hover:text-white text-xs font-medium underline underline-offset-4"
                        >
                          Watch
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </ColumnShell>

              <ColumnShell title="Ratings" count={groups.ratings.length}>
                {groups.ratings.length === 0 ? (
                  <EmptyState label="No ratings yet" />
                ) : (
                  groups.ratings.map((review) => (
                    <div
                      key={review._id}
                      className="w-full px-3 py-2 bg-[#202327] rounded-md border border-gray-600/60"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <ReviewHeader review={review} />
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-white leading-none">{review.rating}</span>
                            <span className="text-gray-400 text-xs">/5</span>
                          </div>
                          <RatingStars value={review.rating} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </ColumnShell>

              <ColumnShell title="Session Reviews" count={groups.sessionReviews.length}>
                {groups.sessionReviews.length === 0 ? (
                  <EmptyState label="No session reviews" />
                ) : (
                  groups.sessionReviews.map((review) => {
                    const text = review.review || '';
                    const truncated = text.length > 140 ? `${text.slice(0, 140)}...` : text;
                    const isTruncated = text.length > 140;

                    return (
                      <button
                        key={review._id}
                        type="button"
                        onClick={() => setSelectedReview(review)}
                        className="w-full text-left px-3 py-2 bg-[#202327] rounded-md border border-gray-600/60 hover:border-gray-500/70 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <ReviewHeader review={review} />
                          {typeof review.rating === 'number' && <RatingStars value={review.rating} />}
                        </div>
                        <p className="text-gray-300 text-sm leading-snug">{truncated}</p>
                        {isTruncated && <p className="text-xs text-gray-400 mt-1">Read more...</p>}
                      </button>
                    );
                  })
                )}
              </ColumnShell>

              <ColumnShell title="Trial Reviews" count={groups.trialReviews.length}>
                <EmptyState label="No trial reviews yet" />
              </ColumnShell>
            </div>
          )}
        </div>
      </div>

      {selectedReview && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1f1f1f] border border-[#333] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1f1f1f] border-b border-[#333] px-5 py-4 flex items-start justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#202327] flex items-center justify-center text-white font-bold text-base flex-shrink-0 overflow-hidden">
                  {selectedReview.student?.profilePicture ? (
                    <img
                      src={selectedReview.student.profilePicture}
                      alt={selectedReview.student?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (selectedReview.student?.name || 'A')?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-white truncate">{selectedReview.student?.name || 'Anonymous'}</h3>
                  <p className="text-sm text-gray-400">{formatWhen(selectedReview.createdAt)}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-4">
              {typeof selectedReview.rating === 'number' && (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-white leading-none">{selectedReview.rating}</span>
                    <span className="text-gray-400 text-xs">/5</span>
                  </div>
                  <RatingStars value={selectedReview.rating} />
                </div>
              )}
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedReview.review}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorReviewsPage;
