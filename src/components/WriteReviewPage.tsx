import React, { useState } from 'react';
import { Star, Send, User, ArrowLeft, CheckCircle } from 'lucide-react';
import { Review } from '../types';

interface WriteReviewPageProps {
  onBack: () => void;
  onReviewSubmit: (review: Review) => void;
  userId?: string;
}

const WriteReviewPage: React.FC<WriteReviewPageProps> = ({ onBack, onReviewSubmit, userId }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const serviceOptions = [
    'Basic Facial', 'Gold Facial', 'Diamond Facial',
    'Hair Cut & Styling', 'Hair Wash & Blow Dry',
    'Manicure', 'Pedicure', 'Eyebrow Threading',
    'Basic Bridal Makeup', 'Premium Bridal Makeup', 'Luxury Bridal Makeup',
    'Bridal Hair Styling', 'Saree Draping', 'Bridal Mehendi',
    'Pre-Bridal Package'
  ];

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

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const review: Review = {
        id: Date.now().toString(),
        userId: userId || 'anonymous',
        appointmentId: 'manual-' + Date.now(),
        rating,
        comment: comment.trim(),
        date: new Date().toISOString(),
        customerName: customerName.trim(),
        services: services.length > 0 ? services : undefined
      };

      onReviewSubmit(review);
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form after 2 seconds and go back
      setTimeout(() => {
        setRating(0);
        setComment('');
        setCustomerName('');
        setServices([]);
        setIsSubmitted(false);
        onBack();
      }, 2000);
    }, 1500);
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
            <h2 className="text-3xl font-bold text-white mb-2">Review Submitted!</h2>
            <p className="text-green-100">Thank you for your valuable feedback</p>
          </div>
          <div className="p-8">
            <p className="text-gray-600 mb-4">
              Your review has been successfully submitted and will help other customers make informed decisions.
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
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6 text-white">
          <button
            onClick={onBack}
            className="mb-4 text-white/80 hover:text-white font-medium flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h2 className="text-2xl font-bold mb-2">Write a Review</h2>
          <p className="opacity-90">Share your experience at AKSHATA PARLOR</p>
        </div>

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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                      className="inline-flex items-center px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full"
                    >
                      {service}
                      <button
                        onClick={() => handleRemoveService(service)}
                        className="ml-2 text-pink-500 hover:text-pink-700"
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              required
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {comment.length}/500 characters
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0 || !customerName.trim() || !comment.trim()}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting Review...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Review</span>
              </>
            )}
          </button>

          <div className="mt-4 text-center text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 inline mr-1" />
            Your review will be visible to other customers
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteReviewPage;