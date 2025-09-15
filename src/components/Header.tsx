import React, { useState } from 'react';
import { User, LogOut, Sparkles, ChevronDown, Settings, Mail, Calendar, Clock, Receipt } from 'lucide-react';
import { User as UserType } from '../types';
import AuthService from '../services/authService';
import AnimatedDarkModeToggle from './AnimatedDarkModeToggle';

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
  onAccountSettings?: () => void;
  onPaymentHistory?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  onLogout, 
  onAccountSettings, 
  onPaymentHistory,
  isDarkMode = false,
  onToggleDarkMode
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const authService = AuthService.getInstance();

  const handleLogout = async () => {
    try {
      setIsSigningOut(true);
      await authService.logout();
      
      // Simulate logout process for better UX
      setTimeout(() => {
        setShowDropdown(false);
        onLogout();
        setIsSigningOut(false);
      }, 800);
    } catch (error) {
      console.error('Logout error:', error);
      onLogout();
      setIsSigningOut(false);
    }
  };

  const handleAccountSettings = () => {
    setShowDropdown(false);
    if (onAccountSettings) {
      onAccountSettings();
    }
  };

  const handlePaymentHistory = () => {
    setShowDropdown(false);
    if (onPaymentHistory) {
      onPaymentHistory();
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Get first letter of user's name for avatar
  const getInitials = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  // Generate consistent color based on user's name
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
    <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-pink-100'} shadow-lg border-b sticky top-0 z-50 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                AKSHATA PARLOR
              </h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} hidden sm:block`}>Beauty & Bridal Services</p>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Compact Animated Dark Mode Toggle */}
            {onToggleDarkMode && (
              <AnimatedDarkModeToggle
                isDarkMode={isDarkMode}
                onToggle={onToggleDarkMode}
                size="xs"
                className="transition-all duration-300 hover:shadow-lg"
              />
            )}

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center space-x-3 p-2 rounded-xl transition-all duration-200 border ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 border-transparent hover:border-pink-500 text-gray-200' 
                    : 'hover:bg-gray-50 border-transparent hover:border-pink-200 text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2`}
                disabled={isSigningOut}
              >
                {/* User Avatar - First Letter Only */}
                <div className={`w-10 h-10 bg-gradient-to-r ${getAvatarColor(user.name)} rounded-full flex items-center justify-center border-2 border-white shadow-md transition-transform duration-200 hover:scale-105`}>
                  <span className="text-white font-bold text-lg">
                    {getInitials(user.name)}
                  </span>
                </div>
                
                {/* User Info */}
                <div className="text-left hidden sm:block">
                  <div className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} truncate max-w-32`}>{user.name}</div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate max-w-32`}>{user.email}</div>
                </div>
                
                {/* Dropdown Arrow */}
                <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''} ${isSigningOut ? 'opacity-50' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className={`absolute right-0 mt-2 w-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-xl border py-2 z-50 animate-in slide-in-from-top-2 duration-200`}>
                  {/* User Profile Header */}
                  <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className="flex items-center space-x-4">
                      {/* Larger Avatar for Dropdown */}
                      <div className={`w-14 h-14 bg-gradient-to-r ${getAvatarColor(user.name)} rounded-full flex items-center justify-center border-3 border-white shadow-lg`}>
                        <span className="text-white font-bold text-2xl">
                          {getInitials(user.name)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} truncate text-lg`}>{user.name}</div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate flex items-center space-x-1`}>
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                        <div className="text-xs text-green-400 mt-1 flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          Online
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className={`px-6 py-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Calendar className="w-3 h-3" />
                        <div>
                          <div className="font-medium">Member since</div>
                          <div>{formatDate(user.createdAt || new Date().toISOString())}</div>
                        </div>
                      </div>
                      <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Clock className="w-3 h-3" />
                        <div>
                          <div className="font-medium">Last login</div>
                          <div>{getTimeAgo(user.lastLogin || new Date().toISOString())}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={handleAccountSettings}
                      className={`w-full px-6 py-3 text-left text-sm transition-all duration-300 flex items-center space-x-3 group ${
                        isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-pink-400' 
                          : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                      }`}
                    >
                      <Settings className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 ${
                        isDarkMode ? 'group-hover:text-pink-400' : 'group-hover:text-pink-600'
                      }`} />
                      <div>
                        <div className={`font-medium transition-colors duration-300 ${
                          isDarkMode ? 'group-hover:text-pink-400' : 'group-hover:text-pink-600'
                        }`}>Account Settings</div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-500 group-hover:text-pink-300' : 'text-gray-500 group-hover:text-pink-500'} transition-colors duration-300`}>
                          Manage your profile
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={handlePaymentHistory}
                      className={`w-full px-6 py-3 text-left text-sm transition-all duration-300 flex items-center space-x-3 group ${
                        isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400' 
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <Receipt className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 ${
                        isDarkMode ? 'group-hover:text-blue-400' : 'group-hover:text-blue-600'
                      }`} />
                      <div>
                        <div className={`font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-200 group-hover:text-blue-400' : 'text-gray-800 group-hover:text-blue-600'
                        }`}>Payment History</div>
                        <div className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400 group-hover:text-blue-300' : 'text-gray-500 group-hover:text-blue-500'
                        }`}>
                          View all your appointments and payment details
                        </div>
                      </div>
                    </button>
                    
                    <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} my-2`}></div>
                    
                    <button
                      onClick={handleLogout}
                      disabled={isSigningOut}
                      className={`w-full px-6 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-all duration-300 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed group ${
                        isDarkMode ? 'hover:bg-red-900/20' : ''
                      }`}
                    >
                      {isSigningOut ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          <div>
                            <div className="font-medium">Signing out...</div>
                            <div className="text-xs text-red-500">Please wait</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4 transition-all duration-300 group-hover:scale-110" />
                          <div>
                            <div className="font-medium">Sign Out</div>
                            <div className="text-xs text-red-500">End your session</div>
                          </div>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Footer */}
                  <div className={`px-6 py-3 border-t ${isDarkMode ? 'border-gray-700 bg-gradient-to-r from-pink-900/20 to-purple-900/20' : 'border-gray-100 bg-gradient-to-r from-pink-50 to-purple-50'} rounded-b-2xl`}>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                      Welcome to <span className="font-semibold text-pink-600">AKSHATA PARLOR</span>
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} text-center mt-1`}>
                      Your beauty journey starts here ✨
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
};

export default Header;