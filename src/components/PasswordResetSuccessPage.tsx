import React from 'react';
import { CheckCircle, ArrowRight, Shield, Home } from 'lucide-react';

interface PasswordResetSuccessPageProps {
  onBackToLogin: () => void;
  isDarkMode?: boolean;
}

const PasswordResetSuccessPage: React.FC<PasswordResetSuccessPageProps> = ({ 
  onBackToLogin,
  isDarkMode = false 
}) => {
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100'} flex items-center justify-center p-4 transition-all duration-500`}>
      <div className="max-w-md w-full">
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-3xl shadow-2xl p-8 text-center border transition-all duration-500`}>
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg transition-transform duration-300 hover:scale-105">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          {/* Success Message */}
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-4 transition-colors duration-300`}>Password Reset Successful!</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 transition-colors duration-300`}>
            Your password has been successfully updated. You can now sign in with your new password.
          </p>

          {/* Action Button */}
          <button
            onClick={onBackToLogin}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 mb-6 transform hover:scale-105 active:scale-95"
          >
            <Home className="w-5 h-5" />
            <span>Back to Login</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Security Notice */}
          <div className={`${isDarkMode ? 'bg-blue-900/50 border-blue-700' : 'bg-blue-50 border-blue-200'} rounded-xl p-4 border transition-all duration-300`}>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} transition-colors duration-300`}>Security Reminder</span>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-300`}>
              For your security, we recommend signing out of all devices and signing back in with your new password.
            </p>
          </div>

          {/* Additional Help */}
          <div className={`mt-6 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} transition-colors duration-300`}>
            <p>
              Need help?{' '}
              <a href="mailto:support@akshataparlor.com" className="text-pink-600 hover:underline font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccessPage;