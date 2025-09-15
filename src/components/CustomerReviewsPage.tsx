import React, { useState, useEffect } from 'react';
import { Star, Users, TrendingUp, Award, Filter, Edit3, MessageSquare, Edit, Trash2, Sparkles, Heart } from 'lucide-react';
import { mockReviews } from '../data/mockReviews';
import { Review } from '../types';

interface CustomerReviewsPageProps {
  onBack: () => void;
  onWriteReview: () => void;
  onEditReview?: (review: Review) => void;
  currentUserId?: string;
  isDarkMode?: boolean;
}

const CustomerReviewsPage: React.FC<CustomerReviewsPageProps> = ({ 
  onBack, 
  onWriteReview, 
  onEditReview,
  currentUserId,
  isDarkMode = false
}) => {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [isVisible, setIsVisible] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [animateReviews, setAnimateReviews] = useState(false);
  const [hoveredReview, setHoveredReview] = useState<string | null>(null);

  // Trigger animations on mount
  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    const timer2 = setTimeout(() => setAnimateStats(true), 300);
    const timer3 = setTimeout(() => setAnimateReviews(true), 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const filteredReviews = mockReviews
    .filter(review => filterRating ? review.rating === filterRating : true)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  const averageRating = mockReviews.length > 0 
    ? mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: mockReviews.filter(review => review.rating === rating).length,
    percentage: mockReviews.length > 0 
      ? (mockReviews.filter(review => review.rating === rating).length / mockReviews.length) * 100 
      : 0
  }));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditReview = (review: Review) => {
    if (onEditReview) {
      onEditReview(review);
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      const reviewIndex = mockReviews.findIndex(r => r.id === reviewId);
      if (reviewIndex !== -1) {
        mockReviews.splice(reviewIndex, 1);
        window.location.reload();
      }
    }
  };

  const canEditReview = (review: Review): boolean => {
    return currentUserId === review.userId;
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} transition-all duration-300 ${
              star <= rating 
                ? 'text-yellow-400 fill-current animate-pulse' 
                : isDarkMode ? 'text-gray-600' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getInitials = (name: string): string => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const getAvatarColor = (name: string): string => {
    const colors = [
      'from-pink-500 to-rose-500',
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-orange-500',
      'from-red-500 to-pink-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-green-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-1000 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Animated Header */}
      <div className={`mb-8 transform transition-all duration-1000 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        <div className="flex justify-between items-start mb-4">
          <button
            onClick={onBack}
            className={`transition-all duration-300 font-medium flex items-center space-x-2 hover:scale-105 ${
              isDarkMode 
                ? 'text-pink-400 hover:text-pink-300' 
                : 'text-pink-600 hover:text-pink-700'
            }`}
          >
            <span>← Back to Booking</span>
          </button>
          <button
            onClick={onWriteReview}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg"
          >
            <Edit3 className="w-5 h-5" />
            <span>Write a Review</span>
          </button>
        </div>
        
        {/* Animated Title with Sparkles */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl animate-pulse"></div>
          <div className="relative">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-pulse">
              <Sparkles className="inline w-8 h-8 mr-2 text-pink-500 animate-bounce" />
              Customer Reviews
              <Heart className="inline w-6 h-6 ml-2 text-purple-500 animate-pulse" />
            </h1>
            <p className={`transition-colors duration-500 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              See what our valued customers say about AKSHATA PARLOR
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Animated Stats Sidebar */}
        <div className={`lg:col-span-1 transform transition-all duration-1000 ease-out ${
          animateStats ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
        }`}>
          <div className={`rounded-2xl shadow-lg p-6 sticky top-4 transition-all duration-500 hover:shadow-2xl ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            {/* Overall Rating with Animation */}
            <div className="text-center mb-6">
              <div className={`text-4xl font-bold mb-2 animate-bounce transition-colors duration-500 ${
                isDarkMode ? 'text-pink-400' : 'text-pink-600'
              }`}>
                {mockReviews.length > 0 ? averageRating.toFixed(1) : '0.0'}
              </div>
              <div className="transform hover:scale-110 transition-transform duration-300">
                {renderStars(Math.round(averageRating), 'lg')}
              </div>
              <p className={`mt-2 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Based on {mockReviews.length} reviews
              </p>
            </div>

            {/* Animated Rating Distribution */}
            <div className="mb-6">
              <h3 className={`font-semibold mb-3 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Rating Distribution
              </h3>
              {ratingDistribution.map(({ rating, count, percentage }, index) => (
                <div 
                  key={rating} 
                  className={`flex items-center space-x-2 mb-2 transform transition-all duration-700 hover:scale-105 ${
                    animateStats ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <span className={`text-sm font-medium w-3 transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {rating}
                  </span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current animate-pulse" />
                  <div className={`flex-1 h-2 rounded-full transition-colors duration-500 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        animationDelay: `${index * 200}ms`
                      }}
                    ></div>
                  </div>
                  <span className={`text-sm w-8 transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {count}
                  </span>
                </div>
              ))}
            </div>

            {/* Animated Quick Stats */}
            <div className="space-y-4">
              {[
                { icon: Users, title: 'Happy Customers', value: `${mockReviews.length}+ served`, color: 'pink', delay: '0ms' },
                { icon: Award, title: 'Excellence Rate', value: `${mockReviews.length > 0 ? Math.round((mockReviews.filter(r => r.rating === 5).length / mockReviews.length) * 100) : 0}% 5-star`, color: 'purple', delay: '100ms' },
                { icon: TrendingUp, title: 'Repeat Clients', value: 'Growing daily', color: 'green', delay: '200ms' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-700 hover:scale-105 cursor-pointer ${
                    stat.color === 'pink' ? (isDarkMode ? 'bg-pink-900/30 border border-pink-700 hover:bg-pink-900/50' : 'bg-pink-50 hover:bg-pink-100') :
                    stat.color === 'purple' ? (isDarkMode ? 'bg-purple-900/30 border border-purple-700 hover:bg-purple-900/50' : 'bg-purple-50 hover:bg-purple-100') :
                    (isDarkMode ? 'bg-green-900/30 border border-green-700 hover:bg-green-900/50' : 'bg-green-50 hover:bg-green-100')
                  } ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  style={{ transitionDelay: stat.delay }}
                >
                  <stat.icon className={`w-5 h-5 animate-pulse ${
                    stat.color === 'pink' ? 'text-pink-600' :
                    stat.color === 'purple' ? 'text-purple-600' :
                    'text-green-600'
                  }`} />
                  <div>
                    <div className={`font-semibold transition-colors duration-500 ${
                      stat.color === 'pink' ? (isDarkMode ? 'text-pink-300' : 'text-pink-800') :
                      stat.color === 'purple' ? (isDarkMode ? 'text-purple-300' : 'text-purple-800') :
                      (isDarkMode ? 'text-green-300' : 'text-green-800')
                    }`}>
                      {stat.title}
                    </div>
                    <div className={`text-sm transition-colors duration-500 ${
                      stat.color === 'pink' ? (isDarkMode ? 'text-pink-400' : 'text-pink-600') :
                      stat.color === 'purple' ? (isDarkMode ? 'text-purple-400' : 'text-purple-600') :
                      (isDarkMode ? 'text-green-400' : 'text-green-600')
                    }`}>
                      {stat.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Animated Write Review CTA */}
            <div className={`mt-6 p-4 rounded-xl border transition-all duration-1000 hover:scale-105 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-pink-900/50 to-purple-900/50 border-pink-700' 
                : 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200'
            } ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: '400ms' }}>
              <h4 className={`font-semibold mb-2 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Share Your Experience
              </h4>
              <p className={`text-sm mb-3 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Help others by sharing your experience at AKSHATA PARLOR
              </p>
              <button
                onClick={onWriteReview}
                className={`w-full py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-2 border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-gray-900' 
                    : 'bg-white border-2 border-pink-200 text-pink-600 hover:bg-pink-50'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>Write Review</span>
              </button>
            </div>
          </div>
        </div>

        {/* Animated Reviews List */}
        <div className={`lg:col-span-3 transform transition-all duration-1000 ease-out ${
          animateReviews ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
        }`}>
          {mockReviews.length > 0 ? (
            <>
              {/* Animated Filters */}
              <div className={`rounded-xl shadow-md p-4 mb-6 transition-all duration-500 hover:shadow-lg ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <Filter className={`w-5 h-5 animate-pulse transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <span className={`font-medium transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Filter by rating:
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setFilterRating(null)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                          filterRating === null
                            ? 'bg-pink-600 text-white shadow-lg'
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-pink-900/50'
                              : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                        }`}
                      >
                        All
                      </button>
                      {[5, 4, 3, 2, 1].map(rating => (
                        <button
                          key={rating}
                          onClick={() => setFilterRating(rating)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                            filterRating === rating
                              ? 'bg-pink-600 text-white shadow-lg'
                              : isDarkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-pink-900/50'
                                : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                          }`}
                        >
                          {rating}★
                        </button>
                      ))}
                    </div>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-200' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                  </select>
                </div>
              </div>

              {/* Animated Reviews */}
              <div className="space-y-6">
                {filteredReviews.map((review, index) => (
                  <div 
                    key={review.id} 
                    className={`rounded-xl shadow-md hover:shadow-xl transition-all duration-500 p-6 transform hover:scale-105 cursor-pointer ${
                      isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                    } ${animateReviews ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                    onMouseEnter={() => setHoveredReview(review.id)}
                    onMouseLeave={() => setHoveredReview(null)}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Animated Avatar */}
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 bg-gradient-to-r ${getAvatarColor(review.customerName || 'User')} rounded-full flex items-center justify-center border-2 border-white shadow-md transition-all duration-300 ${
                          hoveredReview === review.id ? 'scale-110 rotate-12' : ''
                        }`}>
                          <span className="text-white font-bold text-lg">
                            {getInitials(review.customerName || 'User')}
                          </span>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className={`font-semibold transition-colors duration-500 ${
                                isDarkMode ? 'text-gray-200' : 'text-gray-800'
                              }`}>
                                {review.customerName || 'Anonymous Customer'}
                              </h3>
                              {review.isEdited && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full animate-pulse">
                                  Edited
                                </span>
                              )}
                            </div>
                            <p className={`text-sm transition-colors duration-500 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {formatDate(review.date)}
                              {review.isEdited && review.editedAt && (
                                <span className="ml-2 text-xs text-blue-600">
                                  • Last edited {formatDate(review.editedAt)}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`transform transition-all duration-300 ${
                              hoveredReview === review.id ? 'scale-110' : ''
                            }`}>
                              {renderStars(review.rating)}
                            </div>
                            {canEditReview(review) && (
                              <div className="flex items-center space-x-1 ml-4">
                                <button
                                  onClick={() => handleEditReview(review)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110"
                                  title="Edit review"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
                                  title="Delete review"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Animated Services */}
                        {review.services && review.services.length > 0 && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-2">
                              {review.services.map((service, serviceIndex) => (
                                <span
                                  key={serviceIndex}
                                  className={`px-2 py-1 text-xs rounded-full transition-all duration-500 hover:scale-105 ${
                                    isDarkMode 
                                      ? 'bg-pink-900/50 text-pink-300 border border-pink-700' 
                                      : 'bg-pink-100 text-pink-700'
                                  }`}
                                  style={{ 
                                    animationDelay: `${serviceIndex * 50}ms`,
                                    animation: hoveredReview === review.id ? 'pulse 1s infinite' : 'none'
                                  }}
                                >
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Review Text with Hover Effect */}
                        <p className={`leading-relaxed transition-all duration-500 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        } ${hoveredReview === review.id ? 'text-lg' : ''}`}>
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Animated Empty State */
            <div className={`text-center py-16 transform transition-all duration-1000 ${
              animateReviews ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className={`mb-6 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <MessageSquare className="w-24 h-24 mx-auto mb-4 animate-bounce" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No Reviews Yet
              </h3>
              <p className={`mb-8 max-w-md mx-auto transition-colors duration-500 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Be the first to share your experience at AKSHATA PARLOR! Your review will help other customers and improve our services.
              </p>
              <button
                onClick={onWriteReview}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 mx-auto transform hover:scale-105 hover:shadow-lg"
              >
                <Edit3 className="w-5 h-5" />
                <span>Write the First Review</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-pulse ${
              i % 2 === 0 ? 'bg-pink-400' : 'bg-purple-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 500}ms`,
              animationDuration: `${2000 + Math.random() * 2000}ms`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomerReviewsPage;