import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Send, Key, Clock, Shield } from 'lucide-react';
import AuthService from '../services/authService';

interface ForgotPasswordPageProps {
  onBack: () => void;
  onResetSent: (email: string) => void;
  isDarkMode?: boolean;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ 
  onBack, 
  onResetSent, 
  isDarkMode = false 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const authService = AuthService.getInstance();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔄 Requesting password reset for:', email);
      
      const result = await authService.requestPasswordReset(email);
      
      if (result.success) {
        console.log('✅ Password reset request successful');
        setSuccess(result.message || 'Password reset email sent successfully!');
        
        // Wait a moment to show success message, then proceed
        setTimeout(() => {
          onResetSent(email);
        }, 1500);
      } else {
        console.error('❌ Password reset request failed:', result.error);
        setError(result.error || 'Failed to send password reset email. Please try again.');
      }
    } catch (error) {
      console.error('❌ Unexpected error during password reset request:', error);
      setError('An unexpected error occurred. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  // Development helper - show stored email data
  const showDevelopmentInfo = () => {
    const storedEmail = authService.getStoredResetEmail();
    if (storedEmail) {
      const message = `📧 Development Mode - Last Reset Email:\n\n` +
        `To: ${storedEmail.to}\n` +
        `Token: ${storedEmail.resetToken}\n` +
        `Link: ${storedEmail.resetLink}\n` +
        `Time: ${new Date(storedEmail.timestamp).toLocaleString()}\n\n` +
        `Click OK to copy the reset link to clipboard.`;
      
      if (window.confirm(message)) {
        navigator.clipboard.writeText(storedEmail.resetLink).then(() => {
          alert('✅ Reset link copied to clipboard!');
        }).catch(() => {
          console.log('📋 Reset link:', storedEmail.resetLink);
        });
      }
    } else {
      alert('No stored reset email found. Try sending a reset request first.');
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100'} flex items-center justify-center p-4 transition-all duration-500`}>
      <div className="max-w-md w-full">
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-3xl shadow-2xl p-8 border transition-all duration-500`}>
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={onBack}
              className="mb-6 text-pink-600 hover:text-pink-700 font-medium flex items-center space-x-2 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>

            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg transition-transform duration-300 hover:scale-105">
              <Key className="w-8 h-8 text-white" />
            </div>
            
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2 transition-colors duration-300`}>Forgot Password?</h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Enter your email and we'll send you a reset link.</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className={`mb-6 p-4 ${isDarkMode ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-200'} border rounded-xl flex items-center space-x-2 text-green-700 transition-all duration-300`}>
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <div className="font-medium">Email Sent Successfully!</div>
                <div className="text-sm">{success}</div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-4 ${isDarkMode ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-200'} border rounded-xl flex items-center space-x-2 text-red-700 transition-all duration-300`}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <div className="font-medium">Error</div>
                <div className="text-sm">{error}</div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} transition-colors duration-300`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className={`w-full pl-10 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } ${
                    email && validateEmail(email) 
                      ? 'border-green-300 bg-green-50' 
                      : email && !validateEmail(email)
                      ? 'border-red-300 bg-red-50'
                      : ''
                  }`}
                  required
                  disabled={isLoading}
                />
                {email && validateEmail(email) && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
                {email && !validateEmail(email) && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !validateEmail(email)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending Reset Email...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>
          </form>

          {/* Development Helper */}
          {process.env.NODE_ENV === 'development' && (
            <div className={`mt-6 p-4 ${isDarkMode ? 'bg-yellow-900/50 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border rounded-xl transition-all duration-300`}>
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className={`font-semibold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'} transition-colors duration-300`}>Development Mode</span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} mb-3 transition-colors duration-300`}>
                In development, reset links are stored locally. Click below to access the last sent reset link.
              </p>
              <button
                onClick={showDevelopmentInfo}
                className="text-sm bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 transition-colors duration-300"
              >
                Show Last Reset Link
              </button>
            </div>
          )}

          {/* Real Email Notice */}
          <div className={`mt-8 ${isDarkMode ? 'bg-blue-900/50 border-blue-700' : 'bg-blue-50 border-blue-200'} rounded-xl p-4 border transition-all duration-300`}>
            <div className="flex items-center space-x-2 mb-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} transition-colors duration-300`}>Email Delivery</span>
            </div>
            <ul className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} space-y-1 transition-colors duration-300`}>
              <li>• Reset link will be sent to your email address</li>
              <li>• Check your inbox and spam/junk folder</li>
              <li>• Link expires in 15 minutes for security</li>
              <li>• Click the link in your email to reset password</li>
            </ul>
          </div>

          {/* Security Information */}
          <div className={`mt-6 ${isDarkMode ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-200'} rounded-xl p-4 border transition-all duration-300`}>
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className={`font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-800'} transition-colors duration-300`}>Security Features</span>
            </div>
            <ul className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'} space-y-1 transition-colors duration-300`}>
              <li>• Secure token-based password reset</li>
              <li>• Email verification required</li>
              <li>• Automatic token expiration</li>
              <li>• No password stored in plain text</li>
            </ul>
          </div>

          {/* Help Section */}
          <div className={`mt-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4 transition-all duration-300`}>
            <h4 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2 transition-colors duration-300`}>Need Help?</h4>
            <ul className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} space-y-1 transition-colors duration-300`}>
              <li>• Make sure you enter the correct email address</li>
              <li>• Check spam/junk folder if email doesn't arrive</li>
              <li>• Wait a few minutes - email delivery can be delayed</li>
              <li>• Contact support if you continue having issues</li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className={`mt-6 text-center text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} transition-colors duration-300`}>
            <p>
              Still having trouble?{' '}
              <a href="mailto:support@akshataparlor.com" className="text-blue-600 hover:underline font-medium">
                Contact Support
              </a>
              {' '}or call{' '}
              <a href="tel:+919876543210" className="text-blue-600 hover:underline font-medium">
                +91 98765 43210
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;