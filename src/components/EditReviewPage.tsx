import React, { useState, useEffect } from 'react';
import { Star, Send, User, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Review } from '../types';

interface EditReviewPageProps {
  review: Review;
  onBack: () => void;
  onReviewUpdate: (updatedReview: Review) => void;
  userId?: string;
}

const EditReviewPage: React.FC<EditReviewPageProps> = ({ 
  review, 
  onBack, 
  onReviewUpdate, 
  userId 
}) => {
  const [rating, setRating] = useState(review.rating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(review.comment);
  const [customerName, setCustomerName] = useState(review.customerName || '');
  const [services, setServices] = useState<string[]>(review.services || []);
  const [newService, setNewService] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const serviceOptions = [
    'Basic Facial', 'Gold Facial', 'Diamond Facial',
    'Hair Cut & Styling', 'Hair Wash & Blow Dry',
    'Manicure', 'Pedicure', 'Eyebrow Threading',
    'Basic Bridal Makeup', 'Premium Bridal Makeup', 'Luxury Bridal Makeup',
    'Bridal Hair Styling', 'Saree Draping', 'Bridal Mehendi',
    'Pre-Bridal Package'
  ];

  // Check for changes
  useEffect(() => {
    const hasRatingChanged = rating !== review.rating;
    const hasCommentChanged = comment.trim() !== review.comment;
    const hasNameChanged = customerName.trim() !== (review.customerName || '');
    const hasServicesChanged = JSON.stringify(services.sort()) !== JSON.stringify((review.services || []).sort());
    
    setHasChanges(hasRatingChanged || hasCommentChanged || hasNameChanged || hasServicesChanged);
  }, [rating, comment, customerName, services, review]);

  const handleAddService = (service: string) => {
    if (service && !services.includes(service)) {
      setServices([...services, service]);
    }
    setNewService('');
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setServices(services.filter(service => service !== serviceToRemove));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }

    if (!customerName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    if (!hasChanges) {
      alert('No changes detected. Please make some changes before updating.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const updatedReview: Review = {
        ...review,
        rating,
        comment: comment.trim(),
        customerName: customerName.trim(),
        services: services.length > 0 ? services : undefined,
        isEdited: true,
        editedAt: new Date().toISOString()
      };

      onReviewUpdate(updatedReview);
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form after 2 seconds and go back
      setTimeout(() => {
        setIsSubmitted(false);
        onBack();
      }, 2000);
    }, 1500);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to go back?')) {
        onBack();
      }
    } else {
      onBack();
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Click to rate';
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden text-center">
          <div className="bg-gradient-to-r from-green-400 to-green-600 p-8">
            <CheckCircle className="w-20 h-20 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Review Updated!</h2>
            <p className="text-green-100">Your review has been successfully updated</p>
          </div>
          <div className="p-8">
            <p className="text-gray-600 mb-4">
              Your updated review is now live and will help other customers make informed decisions.
            </p>
            <div className="animate-pulse text-pink-600">
              Redirecting you back...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <button
            onClick={handleCancel}
            className="mb-4 text-white/80 hover:text-white font-medium flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h2 className="text-2xl font-bold mb-2">Edit Your Review</h2>
          <p className="opacity-90">Update your experience at AKSHATA PARLOR</p>
        </div>

        {/* Changes Indicator */}
        {hasChanges && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                You have unsaved changes. Don't forget to update your review!
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="p-6">
          {/* Customer Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Services Used */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services You Used (Optional)
            </label>
            
            {/* Selected Services */}
            {services.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {services.map((service, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {service}
                      <button
                        onClick={() => handleRemoveService(service)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Service Selection */}
            <div className="flex space-x-2">
              <select
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a service</option>
                {serviceOptions
                  .filter(service => !services.includes(service))
                  .map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
              </select>
              <button
                onClick={() => handleAddService(newService)}
                disabled={!newService}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>

          {/* Star Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Rating *
            </label>
            <div className="text-center">
              <div className="flex justify-center space-x-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-all duration-200 hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-12 h-12 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-lg font-medium text-gray-700">
                {getRatingText(hoveredRating || rating)}
              </div>
            </div>
          </div>

          {/* Review Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience at Akshata Parlor. What did you like? How was the service? Would you recommend us to others?"
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {comment.length}/500 characters
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Cancel</span>
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0 || !customerName.trim() || !comment.trim() || !hasChanges}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Updating Review...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Update Review</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 inline mr-1" />
            Your updated review will be visible to other customers
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditReviewPage;