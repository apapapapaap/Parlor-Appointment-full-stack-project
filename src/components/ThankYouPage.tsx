import React from 'react';
import { CheckCircle, Calendar, Home } from 'lucide-react';

interface ThankYouPageProps {
  onBackToHome: () => void;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ onBackToHome }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden text-center">
        {/* Success Icon */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 p-8">
          <CheckCircle className="w-20 h-20 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Review Submitted!</h2>
          <p className="text-green-100">Thank you for your valuable feedback</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              We appreciate your time at Akshata Parlor
            </h3>
            <p className="text-gray-600 mb-6">
              Your review helps us maintain our high standards and serve you better in the future.
            </p>
            
            <div className="bg-pink-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-pink-800 mb-3">What's Next?</h4>
              <ul className="text-sm text-pink-700 space-y-2 text-left">
                <li>• We'll send you appointment reminders via email</li>
                <li>• Check out our seasonal offers and packages</li>
                <li>• Follow us on social media for beauty tips</li>
                <li>• Refer friends and get exclusive discounts</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onBackToHome}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Book Another Appointment</span>
            </button>
            
            <button
              onClick={onBackToHome}
              className="w-full bg-white border-2 border-pink-200 text-pink-600 py-3 rounded-xl font-semibold hover:bg-pink-50 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>View Services</span>
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Visit us again soon! 💄✨</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;