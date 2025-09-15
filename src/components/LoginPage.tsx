import React, { useState, useEffect } from 'react';
import { Mail, Sparkles, Shield, Clock, Users, Award, User, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Heart, Star } from 'lucide-react';
import AuthService from '../services/authService';
import AnimatedDarkModeToggle from './AnimatedDarkModeToggle';

interface LoginPageProps {
  onLogin: (user: any) => void;
  onForgotPassword: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ 
  onLogin, 
  onForgotPassword, 
  isDarkMode = false,
  onToggleDarkMode 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);
  const [animateFeatures, setAnimateFeatures] = useState(false);
  const [floatingElements, setFloatingElements] = useState<Array<{id: number, x: number, y: number, delay: number, type: string}>>([]);
  
  const authService = AuthService.getInstance();

  // Trigger animations on mount
  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    const timer2 = setTimeout(() => setAnimateForm(true), 300);
    const timer3 = setTimeout(() => setAnimateFeatures(true), 600);

    // Generate floating elements
    const elements = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      type: ['sparkle', 'heart', 'star', 'circle'][Math.floor(Math.random() * 4)]
    }));
    setFloatingElements(elements);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await authService.login({ email, password });
      
      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getEmailDomain = (email: string): string => {
    return email.split('@')[1] || '';
  };

  const isPopularEmailProvider = (email: string): boolean => {
    const domain = getEmailDomain(email).toLowerCase();
    const popularDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
    return popularDomains.includes(domain);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-1000 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' 
        : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100'
    }`}>
      {/* Enhanced Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating bubbles */}
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 transition-all duration-1000 ${
          isDarkMode ? 'bg-pink-500' : 'bg-pink-300'
        } ${isVisible ? 'scale-100 animate-float' : 'scale-0'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-20 transition-all duration-1000 delay-300 ${
          isDarkMode ? 'bg-purple-500' : 'bg-purple-300'
        } ${isVisible ? 'scale-100 animate-float-delayed' : 'scale-0'}`}></div>
        <div className={`absolute top-1/2 right-1/3 w-32 h-32 rounded-full opacity-20 transition-all duration-1000 delay-500 ${
          isDarkMode ? 'bg-indigo-500' : 'bg-indigo-300'
        } ${isVisible ? 'scale-100 animate-bounce-slow' : 'scale-0'}`}></div>
        
        {/* Floating cartoon elements */}
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className={`absolute transition-all duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`
            }}
          >
            {element.type === 'sparkle' && (
              <Sparkles className={`w-4 h-4 animate-twinkle ${
                isDarkMode ? 'text-yellow-300' : 'text-yellow-500'
              }`} />
            )}
            {element.type === 'heart' && (
              <Heart className={`w-3 h-3 animate-heartbeat ${
                isDarkMode ? 'text-pink-300' : 'text-pink-500'
              }`} />
            )}
            {element.type === 'star' && (
              <Star className={`w-3 h-3 animate-twinkle ${
                isDarkMode ? 'text-purple-300' : 'text-purple-500'
              }`} />
            )}
            {element.type === 'circle' && (
              <div className={`w-2 h-2 rounded-full animate-bounce-gentle ${
                isDarkMode ? 'bg-indigo-300' : 'bg-indigo-500'
              }`} />
            )}
          </div>
        ))}
        
        {/* Animated gradient orbs */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-30 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-10 w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-full opacity-30 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className={`rounded-3xl shadow-2xl p-8 text-center border backdrop-blur-sm transition-all duration-1000 transform ${
          isDarkMode 
            ? 'bg-gray-800/90 border-gray-700' 
            : 'bg-white/90 border-white/50'
        } ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
          
          {/* Dark Mode Toggle */}
          {onToggleDarkMode && (
            <div className={`flex justify-end mb-4 transition-all duration-700 delay-200 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
            }`}>
              <AnimatedDarkModeToggle
                isDarkMode={isDarkMode}
                onToggle={onToggleDarkMode}
                size="sm"
                className="transition-all duration-300 hover:shadow-lg"
              />
            </div>
          )}

          {/* Logo and Title with enhanced animations */}
          <div className={`mb-8 transition-all duration-1000 delay-100 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4 shadow-lg transition-transform duration-500 hover:scale-110 hover:rotate-12 animate-logo-bounce">
              <Sparkles className="w-10 h-10 text-white animate-spin-slow" />
              {/* Orbiting elements around logo */}
              <div className="absolute inset-0 animate-spin-reverse">
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute top-1/2 -right-1 transform -translate-y-1/2">
                  <div className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
                <div className="absolute top-1/2 -left-1 transform -translate-y-1/2">
                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 animate-text-shimmer">
              AKSHATA
            </h1>
            <h2 className={`text-2xl font-semibold mb-1 transition-colors duration-500 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              PARLOR
            </h2>
            <p className={`text-sm transition-colors duration-500 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Beauty & Bridal Services
            </p>
          </div>

          {/* Welcome Message */}
          <div className={`mb-8 transition-all duration-1000 delay-200 ${
            animateForm ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-500 animate-bounce-gentle ${
              isDarkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
              <span className="inline-block animate-wave">👋</span> Welcome! ✨
            </h3>
            <p className={`transition-colors duration-500 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Sign in with your email to book appointments
            </p>
          </div>

          {/* Error Message with animation */}
          {error && (
            <div className={`mb-4 p-3 border rounded-xl flex items-center space-x-2 text-red-700 transition-all duration-500 animate-shake-wiggle ${
              isDarkMode 
                ? 'bg-red-900/50 border-red-700' 
                : 'bg-red-50 border-red-200'
            }`}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 animate-bounce" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Login Form with staggered animations */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Email Input */}
            <div className={`relative transition-all duration-700 delay-300 ${
              animateForm ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
            }`}>
              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-500 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-400'
              } ${email ? 'animate-bounce-gentle' : ''}`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-500 focus:scale-105 hover:shadow-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:bg-gray-600' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-gray-50'
                } ${
                  email && validateEmail(email) 
                    ? isDarkMode
                      ? 'border-green-400 bg-green-900/20 animate-pulse-green'
                      : 'border-green-300 bg-green-50 animate-pulse-green' 
                    : email && !validateEmail(email)
                    ? isDarkMode
                      ? 'border-red-400 bg-red-900/20 animate-shake-subtle'
                      : 'border-red-300 bg-red-50 animate-shake-subtle'
                    : ''
                }`}
                required
              />
              {email && validateEmail(email) && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 animate-check-success" />
              )}
              {email && !validateEmail(email) && (
                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 animate-shake-wiggle" />
              )}
            </div>

            {/* Email Provider Indicator */}
            {email && validateEmail(email) && (
              <div className={`text-xs flex items-center justify-center space-x-2 transition-all duration-500 animate-slide-up ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {isPopularEmailProvider(email) ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500 animate-check-success" />
                    <span>Recognized email provider: {getEmailDomain(email)}</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-blue-500 animate-bounce-gentle" />
                    <span>Email domain: {getEmailDomain(email)}</span>
                  </>
                )}
              </div>
            )}
            
            {/* Password Input */}
            <div className={`relative transition-all duration-700 delay-400 ${
              animateForm ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
            }`}>
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-500 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-400'
              } ${password ? 'animate-bounce-gentle' : ''}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-500 focus:scale-105 hover:shadow-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:bg-gray-600' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-gray-50'
                } ${
                  password.length >= 6 
                    ? isDarkMode
                      ? 'border-green-400 bg-green-900/20 animate-pulse-green'
                      : 'border-green-300 bg-green-50 animate-pulse-green' 
                    : password.length > 0
                    ? isDarkMode
                      ? 'border-yellow-400 bg-yellow-900/20 animate-pulse-yellow'
                      : 'border-yellow-300 bg-yellow-50 animate-pulse-yellow'
                    : ''
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-500 hover:scale-110 hover:rotate-12 ${
                  isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {showPassword ? <EyeOff className="w-5 h-5 animate-bounce-gentle" /> : <Eye className="w-5 h-5 animate-bounce-gentle" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className={`text-xs transition-all duration-500 animate-slide-up ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <div className="flex items-center space-x-2">
                  <div className={`w-full h-1 rounded-full transition-all duration-500 ${
                    isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    <div className={`h-1 rounded-full transition-all duration-1000 animate-progress-fill ${
                      password.length >= 8 ? 'bg-green-500 w-full' :
                      password.length >= 6 ? 'bg-yellow-500 w-2/3' :
                      'bg-red-500 w-1/3'
                    }`}></div>
                  </div>
                </div>
                <p className="mt-1 animate-bounce-gentle">
                  {password.length >= 8 ? '✅ Strong password' :
                   password.length >= 6 ? '⚠️ Good password' :
                   '❌ Password too short (min 6 characters)'}
                </p>
              </div>
            )}

            {/* Forgot Password Link */}
            <div className={`text-right transition-all duration-700 delay-500 ${
              animateForm ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-pink-600 hover:text-pink-700 hover:underline transition-all duration-300 hover:scale-105"
              >
                Forgot your password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password || !validateEmail(email)}
              className={`w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105 active:scale-95 hover:shadow-2xl animate-button-glow ${
                animateForm ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin-fast rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 animate-bounce-gentle" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Auto-Registration Notice */}
          <div className={`mb-6 p-4 border rounded-xl transition-all duration-1000 delay-700 ${
            isDarkMode 
              ? 'bg-blue-900/50 border-blue-700' 
              : 'bg-blue-50 border-blue-200'
          } ${animateFeatures ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600 animate-check-success" />
              <span className={`text-sm font-medium transition-colors duration-500 ${
                isDarkMode ? 'text-blue-300' : 'text-blue-800'
              }`}>
                <span className="animate-bounce-gentle">New User? 🎉</span>
              </span>
            </div>
            <p className={`text-xs transition-colors duration-500 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              Don't worry! We'll automatically create your account when you sign in for the first time.
            </p>
          </div>

          {/* Security Notice */}
          <div className={`mb-6 p-4 rounded-xl border transition-all duration-1000 delay-800 ${
            isDarkMode 
              ? 'bg-green-900/50 border-green-700' 
              : 'bg-green-50 border-green-200'
          } ${animateFeatures ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-green-600 animate-shield-glow" />
              <span className={`text-sm font-medium transition-colors duration-500 ${
                isDarkMode ? 'text-green-300' : 'text-green-800'
              }`}>
                <span className="animate-bounce-gentle">Secure & Private 🔒</span>
              </span>
            </div>
            <p className={`text-xs transition-colors duration-500 ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}>
              Your email and data are securely stored and never shared with third parties
            </p>
          </div>

          {/* Features with staggered animations */}
          <div className={`pt-6 border-t transition-all duration-500 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <div className={`grid grid-cols-2 gap-4 text-sm transition-colors duration-500 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {[
                { icon: Clock, text: 'Quick Booking', color: 'text-pink-500', delay: '900ms', animation: 'animate-bounce-gentle' },
                { icon: Users, text: 'Expert Stylists', color: 'text-purple-500', delay: '1000ms', animation: 'animate-pulse-slow' },
                { icon: Shield, text: 'Secure Payment', color: 'text-indigo-500', delay: '1100ms', animation: 'animate-shield-glow' },
                { icon: Award, text: 'Premium Care', color: 'text-pink-500', delay: '1200ms', animation: 'animate-twinkle' }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-2 transition-all duration-700 hover:scale-110 hover:rotate-1 ${
                    animateFeatures ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{ transitionDelay: feature.delay }}
                >
                  <feature.icon className={`w-4 h-4 ${feature.color} ${feature.animation}`} />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className={`mt-6 text-xs transition-all duration-1000 delay-1300 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-500'
          } ${animateFeatures ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <p>
              By signing in, you agree to our{' '}
              <a href="#" className="text-pink-600 hover:underline transition-colors duration-300">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-pink-600 hover:underline transition-colors duration-300">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake-wiggle {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-2px) rotate(-1deg); }
          20% { transform: translateX(2px) rotate(1deg); }
          30% { transform: translateX(-2px) rotate(-1deg); }
          40% { transform: translateX(2px) rotate(1deg); }
          50% { transform: translateX(-1px) rotate(-0.5deg); }
          60% { transform: translateX(1px) rotate(0.5deg); }
        }
        
        @keyframes shake-subtle {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-1px); }
          75% { transform: translateX(1px); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
        }
        
        @keyframes logo-bounce {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-5px) rotate(5deg) scale(1.05); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes check-success {
          0% { transform: scale(0) rotate(0deg); }
          50% { transform: scale(1.2) rotate(180deg); }
          100% { transform: scale(1) rotate(360deg); }
        }
        
        @keyframes pulse-green {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
        }
        
        @keyframes pulse-yellow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(251, 191, 36, 0); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: var(--progress-width, 100%); }
        }
        
        @keyframes button-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.3); }
          50% { box-shadow: 0 0 30px rgba(236, 72, 153, 0.6); }
        }
        
        @keyframes shield-glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(34, 197, 94, 0.5)); }
          50% { filter: drop-shadow(0 0 15px rgba(34, 197, 94, 0.8)); }
        }
        
        .animate-shake-wiggle {
          animation: shake-wiggle 0.6s ease-in-out;
        }
        
        .animate-shake-subtle {
          animation: shake-subtle 0.3s ease-in-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
        
        .animate-logo-bounce {
          animation: logo-bounce 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 10s linear infinite;
        }
        
        .animate-spin-fast {
          animation: spin-fast 1s linear infinite;
        }
        
        .animate-text-shimmer {
          background: linear-gradient(90deg, #ec4899, #8b5cf6, #6366f1, #ec4899);
          background-size: 200% auto;
          animation: text-shimmer 3s linear infinite;
          -webkit-background-clip: text;
          background-clip: text;
        }
        
        .animate-check-success {
          animation: check-success 0.6s ease-out;
        }
        
        .animate-pulse-green {
          animation: pulse-green 2s infinite;
        }
        
        .animate-pulse-yellow {
          animation: pulse-yellow 2s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-progress-fill {
          animation: progress-fill 1s ease-out;
        }
        
        .animate-button-glow {
          animation: button-glow 2s ease-in-out infinite;
        }
        
        .animate-shield-glow {
          animation: shield-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;