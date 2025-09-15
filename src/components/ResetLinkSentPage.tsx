import React, { useState, useEffect } from 'react';
import { Mail, Clock, RefreshCw, ArrowLeft, CheckCircle, AlertTriangle, ExternalLink, Smartphone } from 'lucide-react';
import AuthService from '../services/authService';

interface ResetLinkSentPageProps {
  email: string;
  onBack: () => void;
  onResendLink: () => void;
  isDarkMode?: boolean;
}

const ResetLinkSentPage: React.FC<ResetLinkSentPageProps> = ({ 
  email, 
  onBack, 
  onResendLink,
  isDarkMode = false
}) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const authService = AuthService.getInstance();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResend = async () => {
    setIsResending(true);
    setTimeLeft(60);
    setCanResend(false);
    
    try {
      console.log('🔄 Resending password reset email to:', email);
      
      const result = await authService.requestPasswordReset(email);
      
      if (result.success) {
        console.log('✅ Password reset email resent successfully');
        onResendLink();
      } else {
        console.error('❌ Failed to resend password reset email:', result.error);
        alert(result.error || 'Failed to resend email. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error resending password reset email:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmailProvider = (email: string): string => {
    const domain = email.split('@')[1]?.toLowerCase();
    switch (domain) {
      case 'gmail.com':
        return 'Gmail';
      case 'yahoo.com':
      case 'yahoo.co.in':
        return 'Yahoo Mail';
      case 'outlook.com':
      case 'hotmail.com':
      case 'live.com':
        return 'Outlook';
      case 'icloud.com':
        return 'iCloud Mail';
      default:
        return 'your email provider';
    }
  };

  const getEmailProviderUrl = (email: string): string => {
    const domain = email.split('@')[1]?.toLowerCase();
    switch (domain) {
      case 'gmail.com':
        return 'https://mail.google.com';
      case 'yahoo.com':
      case 'yahoo.co.in':
        return 'https://mail.yahoo.com';
      case 'outlook.com':
      case 'hotmail.com':
      case 'live.com':
        return 'https://outlook.live.com';
      case 'icloud.com':
        return 'https://www.icloud.com/mail';
      default:
        return '#';
    }
  };

  const getEmailProviderIcon = (email: string): string => {
    const domain = email.split('@')[1]?.toLowerCase();
    switch (domain) {
      case 'gmail.com':
        return '📧';
      case 'yahoo.com':
      case 'yahoo.co.in':
        return '📮';
      case 'outlook.com':
      case 'hotmail.com':
      case 'live.com':
        return '📨';
      case 'icloud.com':
        return '☁️';
      default:
        return '📬';
    }
  };

  // Development helper - show stored email data
  const showDevelopmentInfo = () => {
    const storedEmail = authService.getStoredResetEmail();
    if (storedEmail && storedEmail.to === email) {
      const message = `📧 Development Mode - Reset Email Details:\n\n` +
        `To: ${storedEmail.to}\n` +
        `Token: ${storedEmail.resetToken}\n` +
        `Link: ${storedEmail.resetLink}\n` +
        `Sent: ${new Date(storedEmail.timestamp).toLocaleString()}\n\n` +
        `Click OK to copy the reset link to clipboard.`;
      
      if (window.confirm(message)) {
        navigator.clipboard.writeText(storedEmail.resetLink).then(() => {
          alert('✅ Reset link copied to clipboard! You can paste it in the address bar to test the password reset.');
        }).catch(() => {
          console.log('📋 Reset link:', storedEmail.resetLink);
        });
      }
    } else {
      alert('No stored reset email found for this email address.');
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

            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg transition-transform duration-300 hover:scale-105">
              <Mail className="w-8 h-8 text-white" />
            </div>
            
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2 transition-colors duration-300`}>Email Sent Successfully!</h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 transition-colors duration-300`}>
              We've sent a password reset link to your email:
            </p>
            <div className={`${isDarkMode ? 'bg-blue-900/50 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-xl p-4 mb-4 transition-all duration-300`}>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">{getEmailProviderIcon(email)}</span>
                <div>
                  <p className={`text-lg font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} break-all transition-colors duration-300`}>{email}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-300`}>{getEmailProvider(email)} Account</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access to Email */}
          <div className="mb-6">
            <a
              href={getEmailProviderUrl(email)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 active:scale-95"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Open {getEmailProvider(email)}</span>
            </a>
          </div>

          {/* Development Helper */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6">
              <button
                onClick={showDevelopmentInfo}
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 active:scale-95"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Development: Show Reset Link</span>
              </button>
            </div>
          )}

          {/* Mobile App Suggestion */}
          {(email.includes('gmail.com') || email.includes('yahoo.com') || email.includes('outlook.com')) && (
            <div className={`mb-6 ${isDarkMode ? 'bg-purple-900/50 border-purple-700' : 'bg-purple-50 border-purple-200'} border rounded-xl p-4 transition-all duration-300`}>
              <div className="flex items-center space-x-2 mb-2">
                <Smartphone className="w-5 h-5 text-purple-600" />
                <span className={`font-semibold ${isDarkMode ? 'text-purple-300' : 'text-purple-800'} transition-colors duration-300`}>Mobile App</span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} transition-colors duration-300`}>
                You can also check your email using the {getEmailProvider(email)} mobile app on your phone.
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className={`${isDarkMode ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-200'} rounded-xl p-6 border mb-6 transition-all duration-300`}>
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className={`font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-800'} transition-colors duration-300`}>Next Steps:</span>
            </div>
            <ol className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'} space-y-2 transition-colors duration-300`}>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-green-700">1.</span>
                <span>Open your email inbox (check spam/junk folder too)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-green-700">2.</span>
                <span>Look for an email from "AKSHATA PARLOR"</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-green-700">3.</span>
                <span>Click the "Reset My Password" button in the email</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-green-700">4.</span>
                <span>Create your new secure password</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-green-700">5.</span>
                <span>Sign in with your new password</span>
              </li>
            </ol>
          </div>

          {/* Security Notice */}
          <div className={`${isDarkMode ? 'bg-yellow-900/50 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} rounded-xl p-4 border mb-6 transition-all duration-300`}>
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className={`font-semibold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'} transition-colors duration-300`}>Important Security Notice</span>
            </div>
            <ul className={`text-sm ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'} space-y-1 transition-colors duration-300`}>
              <li>• The reset link expires in 15 minutes for security</li>
              <li>• Only use the link if you requested this reset</li>
              <li>• Never share the reset link with anyone</li>
              <li>• If you didn't request this, you can safely ignore the email</li>
            </ul>
          </div>

          {/* Resend Section */}
          <div className="text-center mb-6">
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 transition-colors duration-300`}>Didn't receive the email?</p>
            
            {!canResend ? (
              <div className={`flex items-center justify-center space-x-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mb-4 transition-colors duration-300`}>
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  Resend available in {formatTime(timeLeft)}
                </span>
              </div>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="bg-white border-2 border-blue-200 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto mb-4 transform hover:scale-105 active:scale-95"
              >
                {isResending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    <span>Resend Reset Email</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Troubleshooting */}
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4 mb-6 transition-all duration-300`}>
            <h4 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2 transition-colors duration-300`}>Email Not Arriving?</h4>
            <ul className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} space-y-1 transition-colors duration-300`}>
              <li>• Check your spam, junk, or promotions folder</li>
              <li>• Make sure you entered the correct email address</li>
              <li>• Add noreply@akshataparlor.com to your contacts</li>
              <li>• Wait a few minutes - emails can sometimes be delayed</li>
              <li>• Try resending the link after the timer expires</li>
              <li>• Check if your email provider is blocking emails</li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className={`text-center text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} transition-colors duration-300`}>
            <p className="mb-2">Still need help?</p>
            <div className="space-y-1">
              <p>
                📧 Email:{' '}
                <a href="mailto:support@akshataparlor.com" className="text-blue-600 hover:underline font-medium">
                  support@akshataparlor.com
                </a>
              </p>
              <p>
                📞 Phone:{' '}
                <a href="tel:+919876543210" className="text-blue-600 hover:underline font-medium">
                  +91 98765 43210
                </a>
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-400'} mt-2 transition-colors duration-300`}>
                Support available Monday-Saturday, 9 AM - 8 PM IST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetLinkSentPage;