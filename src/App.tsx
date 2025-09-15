import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetLinkSentPage from './components/ResetLinkSentPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import PasswordResetSuccessPage from './components/PasswordResetSuccessPage';
import Header from './components/Header';
import BookingPage from './components/BookingPage';
import PaymentPage from './components/PaymentPage';
import ReviewPage from './components/ReviewPage';
import ThankYouPage from './components/ThankYouPage';
import CustomerReviewsPage from './components/CustomerReviewsPage';
import WriteReviewPage from './components/WriteReviewPage';
import EditReviewPage from './components/EditReviewPage';
import AccountSettingsPage from './components/AccountSettingsPage';
import PaymentHistoryPage from './components/PaymentHistoryPage';
import AuthService from './services/authService';
import { User, Appointment, Review } from './types';
import { mockReviews } from './data/mockReviews';

type AppState = 
  | 'login' 
  | 'forgot-password' 
  | 'reset-link-sent' 
  | 'reset-password' 
  | 'password-reset-success'
  | 'booking' 
  | 'payment' 
  | 'review' 
  | 'thankyou' 
  | 'customer-reviews' 
  | 'write-review' 
  | 'edit-review' 
  | 'account-settings'
  | 'payment-history';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('login');
  const [user, setUser] = useState<User | null>(null);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const authService = AuthService.getInstance();

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('akshata_dark_mode');
    if (savedDarkMode) {
      const darkMode = JSON.parse(savedDarkMode);
      setIsDarkMode(darkMode);
      if (darkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('akshata_dark_mode', JSON.stringify(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setCurrentState('booking');
      }
      setIsLoading(false);
    };

    // Check for reset token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setResetToken(token);
      setCurrentState('reset-password');
      setIsLoading(false);
      return;
    }

    checkExistingSession();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentState('booking');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentAppointment(null);
    setUserReviews([]);
    setEditingReview(null);
    setResetEmail('');
    setResetToken('');
    setCurrentState('login');
  };

  const handleForgotPassword = () => {
    setCurrentState('forgot-password');
  };

  const handleBackToLogin = () => {
    setResetEmail('');
    setResetToken('');
    setCurrentState('login');
  };

  const handleResetLinkSent = (email: string) => {
    setResetEmail(email);
    setCurrentState('reset-link-sent');
  };

  const handleResendResetLink = async () => {
    // In a real app, this would trigger another API call
    try {
      const result = await authService.requestPasswordReset(resetEmail);
      if (result.success) {
        console.log('Reset link resent successfully');
      } else {
        console.error('Failed to resend reset link:', result.error);
      }
    } catch (error) {
      console.error('Error resending reset link:', error);
    }
  };

  const handlePasswordReset = () => {
    setCurrentState('password-reset-success');
  };

  const handleBookingComplete = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setCurrentState('payment');
  };

  const handlePaymentComplete = () => {
    setCurrentState('review');
  };

  const handleBackToBooking = () => {
    setCurrentAppointment(null);
    setCurrentState('booking');
  };

  const handleReviewSubmit = (review: Review) => {
    console.log('Review submitted:', review);
    // Add review to the global reviews array
    mockReviews.push(review);
    setUserReviews(prev => [...prev, review]);
    setCurrentState('thankyou');
  };

  const handleBackToHome = () => {
    setCurrentAppointment(null);
    setCurrentState('booking');
  };

  const handleViewReviews = () => {
    setCurrentState('customer-reviews');
  };

  const handleBackFromReviews = () => {
    setCurrentState('booking');
  };

  const handleWriteReview = () => {
    setCurrentState('write-review');
  };

  const handleBackFromWriteReview = () => {
    setCurrentState('customer-reviews');
  };

  const handleManualReviewSubmit = (review: Review) => {
    console.log('Manual review submitted:', review);
    // Add review to the global reviews array
    mockReviews.push(review);
    setUserReviews(prev => [...prev, review]);
    // The WriteReviewPage component handles the redirect back to customer-reviews
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setCurrentState('edit-review');
  };

  const handleBackFromEditReview = () => {
    setEditingReview(null);
    setCurrentState('customer-reviews');
  };

  const handleReviewUpdate = (updatedReview: Review) => {
    console.log('Review updated:', updatedReview);
    
    // Find and update the review in the global reviews array
    const reviewIndex = mockReviews.findIndex(r => r.id === updatedReview.id);
    if (reviewIndex !== -1) {
      mockReviews[reviewIndex] = updatedReview;
    }
    
    // Update local state
    setUserReviews(prev => 
      prev.map(r => r.id === updatedReview.id ? updatedReview : r)
    );
    
    setEditingReview(null);
    // The EditReviewPage component handles the redirect back to customer-reviews
  };

  const handleAccountSettings = () => {
    setCurrentState('account-settings');
  };

  const handleBackFromAccountSettings = () => {
    setCurrentState('booking');
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handlePaymentHistory = () => {
    setCurrentState('payment-history');
  };

  const handleBackFromPaymentHistory = () => {
    setCurrentState('booking');
  };

  // Show loading screen while checking session
  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>AKSHATA PARLOR</h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading your session...</p>
        </div>
      </div>
    );
  }

  // Password Recovery Flow
  if (currentState === 'login') {
    return <LoginPage onLogin={handleLogin} onForgotPassword={handleForgotPassword} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />;
  }

  if (currentState === 'forgot-password') {
    return <ForgotPasswordPage onBack={handleBackToLogin} onResetSent={handleResetLinkSent} isDarkMode={isDarkMode} />;
  }

  if (currentState === 'reset-link-sent') {
    return (
      <ResetLinkSentPage 
        email={resetEmail}
        onBack={handleBackToLogin}
        onResendLink={handleResendResetLink}
        isDarkMode={isDarkMode}
      />
    );
  }

  if (currentState === 'reset-password') {
    return (
      <ResetPasswordPage 
        email={resetEmail}
        token={resetToken}
        onPasswordReset={handlePasswordReset}
        onBack={() => setCurrentState('reset-link-sent')}
        isDarkMode={isDarkMode}
      />
    );
  }

  if (currentState === 'password-reset-success') {
    return <PasswordResetSuccessPage onBackToLogin={handleBackToLogin} isDarkMode={isDarkMode} />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {user && currentState !== 'customer-reviews' && currentState !== 'write-review' && currentState !== 'edit-review' && currentState !== 'account-settings' && currentState !== 'payment-history' && (
        <Header 
          user={user} 
          onLogout={handleLogout}
          onAccountSettings={handleAccountSettings}
          onPaymentHistory={handlePaymentHistory}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}
      
      {currentState === 'booking' && user && (
        <BookingPage 
          onBookingComplete={handleBookingComplete} 
          onViewReviews={handleViewReviews}
          userId={user.id}
          isDarkMode={isDarkMode}
        />
      )}
      
      {currentState === 'payment' && currentAppointment && (
        <PaymentPage 
          appointment={currentAppointment} 
          onPaymentComplete={handlePaymentComplete}
          onBack={handleBackToBooking}
          isDarkMode={isDarkMode}
        />
      )}
      
      {currentState === 'review' && currentAppointment && (
        <ReviewPage 
          appointment={currentAppointment} 
          onReviewSubmit={handleReviewSubmit}
          isDarkMode={isDarkMode}
        />
      )}
      
      {currentState === 'thankyou' && (
        <ThankYouPage onBackToHome={handleBackToHome} isDarkMode={isDarkMode} />
      )}

      {currentState === 'customer-reviews' && (
        <CustomerReviewsPage 
          onBack={handleBackFromReviews}
          onWriteReview={handleWriteReview}
          onEditReview={handleEditReview}
          currentUserId={user?.id}
          isDarkMode={isDarkMode}
        />
      )}

      {currentState === 'write-review' && (
        <WriteReviewPage 
          onBack={handleBackFromWriteReview}
          onReviewSubmit={handleManualReviewSubmit}
          userId={user?.id}
          isDarkMode={isDarkMode}
        />
      )}

      {currentState === 'edit-review' && editingReview && (
        <EditReviewPage 
          review={editingReview}
          onBack={handleBackFromEditReview}
          onReviewUpdate={handleReviewUpdate}
          userId={user?.id}
          isDarkMode={isDarkMode}
        />
      )}

      {currentState === 'account-settings' && user && (
        <AccountSettingsPage 
          user={user}
          onBack={handleBackFromAccountSettings}
          onUserUpdate={handleUserUpdate}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}

      {currentState === 'payment-history' && user && (
        <PaymentHistoryPage 
          user={user}
          onBack={handleBackFromPaymentHistory}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

export default App;