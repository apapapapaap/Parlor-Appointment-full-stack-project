import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import AuthService from '../services/authService';

interface ResetPasswordPageProps {
  email: string;
  token: string;
  onPasswordReset: () => void;
  onBack: () => void;
  isDarkMode?: boolean;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ 
  email, 
  token,
  onPasswordReset, 
  onBack,
  isDarkMode = false
}) => {
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
    showNewPassword: false,
    showConfirmPassword: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  const authService = AuthService.getInstance();

  // Validate token on component mount
  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      setTokenValid(false);
      return;
    }

    // Check token validity
    const info = authService.getResetTokenInfo(token);
    if (!info) {
      setError('Invalid reset token. Please request a new password reset.');
      setTokenValid(false);
    } else if (!info.isValid) {
      setError('Reset token has expired. Please request a new password reset.');
      setTokenValid(false);
    } else {
      setTokenInfo(info);
      console.log('✅ Valid reset token found for:', info.email);
    }
  }, [token]);

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const getPasswordStrength = (password: string): { strength: string; color: string; percentage: number } => {
    if (password.length === 0) return { strength: '', color: '', percentage: 0 };
    if (password.length < 6) return { strength: 'Too short', color: 'red', percentage: 25 };
    if (password.length < 8) return { strength: 'Fair', color: 'yellow', percentage: 50 };
    if (password.length < 12) return { strength: 'Good', color: 'blue', percentage: 75 };
    return { strength: 'Strong', color: 'green', percentage: 100 };
  };

  const handlePasswordChange = (field: string, value: string | boolean) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!tokenValid) {
      setError('Invalid reset token. Please request a new password reset.');
      return;
    }

    if (!validatePassword(passwords.newPassword)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔄 Attempting to reset password with token:', token);
      
      const result = await authService.resetPassword(token, passwords.newPassword);
      
      if (result.success) {
        console.log('✅ Password reset successful');
        onPasswordReset();
      } else {
        console.error('❌ Password reset failed:', result.error);
        setError(result.error || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('❌ Password reset error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(passwords.newPassword);

  if (!tokenValid) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100'} flex items-center justify-center p-4 transition-all duration-500`}>
        <div className="max-w-md w-full">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-3xl shadow-2xl p-8 text-center border transition-all duration-500`}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4 shadow-lg">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2 transition-colors duration-300`}>Invalid Reset Link</h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6 transition-colors duration-300`}>
              This password reset link is invalid or has expired. Please request a new one.
            </p>

            <button
              onClick={onBack}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Request New Reset Link</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <span>Back</span>
            </button>

            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg transition-transform duration-300 hover:scale-105">
              <Shield className="w-8 h-8 text-white" />
            </div>
            
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2 transition-colors duration-300`}>Reset Password</h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 transition-colors duration-300`}>Create a new password for your account</p>
            {tokenInfo && (
              <p className={`text-sm ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-600'} px-3 py-1 rounded-full inline-block break-all transition-all duration-300`}>
                {tokenInfo.email}
              </p>
            )}
          </div>

          {/* Token Info for Development */}
          {process.env.NODE_ENV === 'development' && tokenInfo && (
            <div className={`mb-6 p-4 ${isDarkMode ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-200'} border rounded-xl transition-all duration-300`}>
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className={`font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-800'} transition-colors duration-300`}>Development Info</span>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'} transition-colors duration-300`}>
                <p>Token valid for: {tokenInfo.email}</p>
                <p>Expires: {new Date(tokenInfo.expires).toLocaleString()}</p>
                <p>Status: {tokenInfo.isValid ? '✅ Valid' : '❌ Expired'}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-4 ${isDarkMode ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-200'} border rounded-xl flex items-center space-x-2 text-red-700 transition-all duration-300`}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                New Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} transition-colors duration-300`} />
                <input
                  type={passwords.showNewPassword ? 'text' : 'password'}
                  value={passwords.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  placeholder="Enter new password"
                  className={`w-full pl-10 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => handlePasswordChange('showNewPassword', !passwords.showNewPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-300`}
                >
                  {passwords.showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {passwords.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`flex-1 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-2 transition-colors duration-300`}>
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.color === 'red' ? 'bg-red-500' :
                          passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                          passwordStrength.color === 'blue' ? 'bg-blue-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${passwordStrength.percentage}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs font-medium transition-colors duration-300 ${
                      passwordStrength.color === 'red' ? 'text-red-600' :
                      passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                      passwordStrength.color === 'blue' ? 'text-blue-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.strength}
                    </span>
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                    Password must be at least 6 characters long
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} transition-colors duration-300`} />
                <input
                  type={passwords.showConfirmPassword ? 'text' : 'password'}
                  value={passwords.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  placeholder="Confirm new password"
                  className={`w-full pl-10 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } ${
                    passwords.confirmPassword && passwords.newPassword === passwords.confirmPassword
                      ? 'border-green-300 bg-green-50'
                      : passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword
                      ? 'border-red-300 bg-red-50'
                      : ''
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => handlePasswordChange('showConfirmPassword', !passwords.showConfirmPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-300`}
                >
                  {passwords.showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Match Indicator */}
              {passwords.confirmPassword && (
                <div className="mt-2 text-xs">
                  {passwords.newPassword === passwords.confirmPassword ? (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>Passwords match</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      <span>Passwords do not match</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={
                isLoading || 
                !passwords.newPassword || 
                !passwords.confirmPassword || 
                passwords.newPassword !== passwords.confirmPassword ||
                !validatePassword(passwords.newPassword)
              }
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Resetting Password...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Reset Password</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className={`mt-8 ${isDarkMode ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-200'} rounded-xl p-4 border transition-all duration-300`}>
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className={`font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-800'} transition-colors duration-300`}>Security Tips</span>
            </div>
            <ul className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'} space-y-1 transition-colors duration-300`}>
              <li>• Use a unique password you haven't used before</li>
              <li>• Include a mix of letters, numbers, and symbols</li>
              <li>• Avoid using personal information</li>
              <li>• Consider using a password manager</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;