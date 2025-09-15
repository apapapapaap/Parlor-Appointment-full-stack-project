import React, { useState } from 'react';
import { Star, Send, Heart } from 'lucide-react';
import { Appointment, Review } from '../types';

interface ReviewPageProps {
  appointment: Appointment;
  onReviewSubmit: (review: Review) => void;
}

const ReviewPage: React.FC<ReviewPageProps> = ({ appointment, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userId: appointment.userId,
      appointmentId: appointment.id,
      rating,
      comment,
      date: new Date().toISOString()
    };

    onReviewSubmit(review);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6 text-white text-center">
          <Heart className="w-12 h-12 mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="opacity-90">Your appointment is complete. How was your experience?</p>
        </div>

        {/* Appointment Summary */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Completed Services</h3>
          <div className="space-y-2">
            {appointment.services.map((service, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{service.name}</span>
                <span className="text-pink-600 font-medium">₹{service.price}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
            <span className="font-semibold text-gray-800">Total Paid:</span>
            <span className="text-xl font-bold text-pink-600">₹{appointment.totalPrice}</span>
          </div>
        </div>

        {/* Review Form */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Rate Your Experience</h3>
          
          {/* Star Rating */}
          <div className="mb-6">
            <div className="flex justify-center space-x-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">
              {rating === 0 && 'Click to rate'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share your feedback (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience at Akshata Parlor..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Submit Review</span>
          </button>

          <div className="mt-4 text-center text-sm text-gray-500">
            Your feedback helps us improve our services
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;