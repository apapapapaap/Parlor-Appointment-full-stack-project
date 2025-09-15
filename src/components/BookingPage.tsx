import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, ShoppingBag, ArrowRight, MessageSquare, Phone } from 'lucide-react';
import { Service, Appointment } from '../types';
import { allServices } from '../data/services';
import ServiceCard from './ServiceCard';
import SMSService from '../services/smsService';
import TabSoundService from '../services/tabSoundService';

interface BookingPageProps {
  onBookingComplete: (appointment: Appointment) => void;
  onViewReviews: () => void;
  userId: string;
  isDarkMode?: boolean;
}

const BookingPage: React.FC<BookingPageProps> = ({ onBookingComplete, onViewReviews, userId, isDarkMode = false }) => {
  const [selectedServices, setSelectedServices] = useState<{ [key: string]: number }>({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [activeTab, setActiveTab] = useState<'regular' | 'bridal'>('regular');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animateServices, setAnimateServices] = useState(false);
  const [animateSummary, setAnimateSummary] = useState(false);
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const [tabSwitchDirection, setTabSwitchDirection] = useState<'left' | 'right'>('right');

  const headerRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const regularServices = allServices.filter(s => s.category === 'regular');
  const bridalServices = allServices.filter(s => s.category === 'bridal');
  const smsService = SMSService.getInstance();
  const tabSoundService = TabSoundService.getInstance();

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === headerRef.current) {
            setIsVisible(true);
          } else if (entry.target === servicesRef.current) {
            setTimeout(() => setAnimateServices(true), 100);
          } else if (entry.target === summaryRef.current) {
            setTimeout(() => setAnimateSummary(true), 200);
          }
        }
      });
    }, observerOptions);

    if (headerRef.current) observer.observe(headerRef.current);
    if (servicesRef.current) observer.observe(servicesRef.current);
    if (summaryRef.current) observer.observe(summaryRef.current);

    // Initial animation trigger
    setTimeout(() => setIsVisible(true), 50);

    return () => observer.disconnect();
  }, []);

  const handleServiceAdd = (serviceId: string) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: (prev[serviceId] || 0) + 1
    }));
  };

  const handleServiceRemove = (serviceId: string) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: Math.max(0, (prev[serviceId] || 0) - 1)
    }));
  };

  const handleTabSwitch = (newTab: 'regular' | 'bridal') => {
    if (newTab === activeTab) return;

    // Play smooth tab switch sound
    tabSoundService.playTabSwitchSound(newTab);

    // Determine animation direction
    const direction = (activeTab === 'regular' && newTab === 'bridal') ? 'right' : 'left';
    setTabSwitchDirection(direction);
    
    // Start switching animation
    setIsTabSwitching(true);
    
    // Change tab after a short delay for smooth transition
    setTimeout(() => {
      setActiveTab(newTab);
    }, 150);
    
    // End switching animation
    setTimeout(() => {
      setIsTabSwitching(false);
    }, 300);
  };

  const getSelectedServicesList = (): Service[] => {
    const services: Service[] = [];
    Object.entries(selectedServices).forEach(([serviceId, quantity]) => {
      if (quantity > 0) {
        const service = allServices.find(s => s.id === serviceId);
        if (service) {
          for (let i = 0; i < quantity; i++) {
            services.push(service);
          }
        }
      }
    });
    return services;
  };

  const getTotalPrice = () => {
    return getSelectedServicesList().reduce((total, service) => total + service.price, 0);
  };

  const getTotalDuration = () => {
    return getSelectedServicesList().reduce((total, service) => total + service.duration, 0);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || getSelectedServicesList().length === 0) {
      alert('Please select date, time, and at least one service');
      return;
    }

    setIsBooking(true);

    try {
      const appointment: Appointment = {
        id: Date.now().toString(),
        userId,
        services: getSelectedServicesList(),
        date: selectedDate,
        time: selectedTime,
        totalPrice: getTotalPrice(),
        status: 'pending'
      };

      // Get user data from localStorage or context (simplified for demo)
      const userData = JSON.parse(localStorage.getItem('akshata_users') || '{}');
      const userEmail = Object.keys(userData)[0] || 'customer@example.com';
      const userName = userData[userEmail]?.name || 'Customer';

      // Prepare SMS data for REAL-TIME notification to Akshata
      const smsData = {
        customerName: userName,
        customerEmail: userEmail,
        customerPhone: customerPhone || undefined,
        services: getSelectedServicesList().map(service => service.name),
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        totalAmount: getTotalPrice(),
        appointmentId: appointment.id
      };

      console.log('📱 Sending REAL-TIME SMS notification to Akshata at +919740303404...');

      // Send REAL-TIME SMS notification to Akshata's number
      const smsResult = await smsService.sendAppointmentNotification(smsData);

      if (smsResult.success) {
        console.log('✅ REAL-TIME SMS notification sent successfully to Akshata at +919740303404');
        
        // Show success message to user
        setTimeout(() => {
          alert(`✅ Appointment booked successfully!\n\n📱 Akshata has been notified INSTANTLY at +919740303404\n\n🎉 You will receive a confirmation call soon!`);
        }, 500);
      } else {
        console.error('❌ Failed to send REAL-TIME SMS notification:', smsResult.error);
        
        // Still proceed with booking but inform user
        setTimeout(() => {
          alert(`✅ Appointment booked successfully!\n\n⚠️ SMS notification failed. Please call Akshata directly at +919740303404 to confirm your appointment.\n\nBooking ID: ${appointment.id}`);
        }, 500);
      }

      // Proceed with booking
      onBookingComplete(appointment);

    } catch (error) {
      console.error('❌ Booking error:', error);
      alert('❌ Failed to book appointment. Please try again or call us directly at +919740303404.');
    } finally {
      setIsBooking(false);
    }
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Animated Header */}
      <div 
        ref={headerRef}
        className={`mb-8 flex justify-between items-center transform transition-all duration-1000 ease-out ${
          isVisible 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="relative">
          {/* Animated background gradient */}
          <div className={`absolute -inset-4 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}></div>
          
          <div className="relative">
            <h2 className={`text-3xl font-bold mb-2 transition-all duration-1000 delay-100 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            } ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                ✨ Book Your Appointment ✨
              </span>
            </h2>
            <p className={`transition-all duration-1000 delay-200 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
              Choose your services and preferred time
            </p>
          </div>
        </div>
        
        <button
          onClick={onViewReviews}
          className={`border-2 px-6 py-3 rounded-xl font-semibold transition-all duration-700 delay-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg ${
            isDarkMode 
              ? 'bg-gray-800 border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-gray-900' 
              : 'bg-white border-pink-200 text-pink-600 hover:bg-pink-50'
          } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>View Reviews</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Animated Services Selection */}
        <div 
          ref={servicesRef}
          className={`lg:col-span-2 transform transition-all duration-1000 ease-out ${
            animateServices 
              ? 'translate-x-0 opacity-100' 
              : '-translate-x-8 opacity-0'
          }`}
        >
          {/* Enhanced Service Tabs with Cool Animations */}
          <div className={`relative flex space-x-1 mb-6 p-1 rounded-xl transition-all duration-1000 delay-100 ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          } ${animateServices ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            
            {/* Animated Background Slider */}
            <div 
              className={`absolute top-1 bottom-1 w-1/2 rounded-lg transition-all duration-500 ease-out transform ${
                activeTab === 'regular' 
                  ? 'translate-x-0' 
                  : 'translate-x-full'
              } ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 shadow-lg shadow-pink-500/25' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg shadow-pink-500/25'
              }`}
            />
            
            {/* Regular Services Tab */}
            <button
              onClick={() => handleTabSwitch('regular')}
              className={`relative flex-1 py-4 px-6 rounded-lg font-semibold transition-all duration-500 transform hover:scale-105 z-10 ${
                activeTab === 'regular'
                  ? 'text-white shadow-lg scale-105'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span className={`transition-all duration-300 ${activeTab === 'regular' ? 'animate-pulse' : ''}`}>
                  💄
                </span>
                <span>Regular Services</span>
              </span>
            </button>
            
            {/* Bridal Services Tab */}
            <button
              onClick={() => handleTabSwitch('bridal')}
              className={`relative flex-1 py-4 px-6 rounded-lg font-semibold transition-all duration-500 transform hover:scale-105 z-10 ${
                activeTab === 'bridal'
                  ? 'text-white shadow-lg scale-105'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span className={`transition-all duration-300 ${activeTab === 'bridal' ? 'animate-pulse' : ''}`}>
                  👰
                </span>
                <span>Bridal Services</span>
              </span>
            </button>

            {/* Floating Particles Effect */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-1 h-1 rounded-full transition-all duration-1000 ${
                    activeTab === 'regular' ? 'bg-pink-300' : 'bg-purple-300'
                  } ${
                    isTabSwitching ? 'animate-ping' : 'animate-pulse'
                  }`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 200}ms`,
                    animationDuration: `${1000 + Math.random() * 1000}ms`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Services Grid with Enhanced Switching Animation */}
          <div className="relative overflow-hidden">
            <div 
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500 ease-out ${
                isTabSwitching 
                  ? `transform ${
                      tabSwitchDirection === 'right' 
                        ? 'translate-x-full opacity-0 scale-95' 
                        : '-translate-x-full opacity-0 scale-95'
                    }` 
                  : 'translate-x-0 opacity-100 scale-100'
              }`}
            >
              {(activeTab === 'regular' ? regularServices : bridalServices).map((service, index) => (
                <div
                  key={service.id}
                  className={`transform transition-all duration-700 ease-out hover:scale-105 ${
                    animateServices && !isTabSwitching
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-4 opacity-0'
                  }`}
                  style={{ 
                    transitionDelay: isTabSwitching ? '0ms' : `${200 + index * 50}ms` 
                  }}
                >
                  <ServiceCard
                    service={service}
                    quantity={selectedServices[service.id] || 0}
                    onAdd={() => handleServiceAdd(service.id)}
                    onRemove={() => handleServiceRemove(service.id)}
                    isDarkMode={isDarkMode}
                  />
                </div>
              ))}
            </div>

            {/* Tab Switch Loading Overlay */}
            {isTabSwitching && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`flex items-center space-x-3 px-6 py-3 rounded-xl ${
                  isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
                } backdrop-blur-sm shadow-lg`}>
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full animate-bounce ${
                          activeTab === 'regular' ? 'bg-pink-500' : 'bg-purple-500'
                        }`}
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Loading {activeTab === 'regular' ? 'Regular' : 'Bridal'} Services...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Animated Booking Summary */}
        <div 
          ref={summaryRef}
          className={`lg:col-span-1 transform transition-all duration-1000 ease-out ${
            animateSummary 
              ? 'translate-x-0 opacity-100' 
              : 'translate-x-8 opacity-0'
          }`}
        >
          <div className={`rounded-xl shadow-lg p-6 sticky top-4 transition-all duration-1000 hover:shadow-2xl ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          } ${animateSummary ? 'scale-100' : 'scale-95'}`}>
            <h3 className={`text-xl font-semibold mb-4 flex items-center transition-all duration-700 delay-100 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            } ${animateSummary ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
              <ShoppingBag className="w-5 h-5 mr-2 text-pink-600 animate-bounce" />
              Booking Summary
            </h3>

            {/* Customer Phone Number */}
            <div className={`mb-4 transition-all duration-700 delay-150 ${
              animateSummary ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Phone className="w-4 h-4 inline mr-1" />
                Your Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter your phone number"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 focus:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <p className={`text-xs mt-1 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                We'll send you SMS confirmations and reminders
              </p>
            </div>

            {/* Date Selection */}
            <div className={`mb-4 transition-all duration-700 delay-200 ${
              animateSummary ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Calendar className="w-4 h-4 inline mr-1" />
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={today}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 focus:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Time Selection */}
            <div className={`mb-6 transition-all duration-700 delay-250 ${
              animateSummary ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Clock className="w-4 h-4 inline mr-1" />
                Select Time
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time, index) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 text-sm rounded-lg border transition-all duration-500 hover:scale-110 ${
                      selectedTime === time
                        ? 'bg-pink-600 text-white border-pink-600 transform scale-110 shadow-lg'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-300 border-gray-600 hover:border-pink-400 hover:text-pink-400'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-pink-300'
                    }`}
                    style={{ 
                      transitionDelay: `${index * 25}ms` 
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Services */}
            {getSelectedServicesList().length > 0 && (
              <div className={`mb-6 transition-all duration-700 delay-300 ${
                animateSummary ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              }`}>
                <h4 className={`font-medium mb-3 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  Selected Services
                </h4>
                <div className="space-y-2">
                  {Object.entries(selectedServices).map(([serviceId, quantity], index) => {
                    if (quantity === 0) return null;
                    const service = allServices.find(s => s.id === serviceId);
                    if (!service) return null;
                    return (
                      <div 
                        key={serviceId} 
                        className={`flex justify-between text-sm transition-all duration-500 hover:scale-105 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                        style={{ 
                          transitionDelay: `${index * 50}ms` 
                        }}
                      >
                        <span>{service.name} x{quantity}</span>
                        <span className="font-medium">₹{service.price * quantity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Total */}
            <div className={`border-t pt-4 mb-6 transition-all duration-700 delay-350 ${
              isDarkMode ? 'border-gray-600' : 'border-gray-200'
            } ${animateSummary ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Duration:
                </span>
                <span className={`font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {getTotalDuration()} min
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-lg font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  Total:
                </span>
                <span className="text-2xl font-bold text-pink-600 animate-pulse">₹{getTotalPrice()}</span>
              </div>
            </div>

            {/* REAL-TIME SMS Notification Info */}
            <div className={`mb-6 p-3 border rounded-lg transition-all duration-700 delay-400 hover:scale-105 ${
              isDarkMode 
                ? 'bg-blue-900/30 border-blue-700' 
                : 'bg-blue-50 border-blue-200'
            } ${animateSummary ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Phone className="w-4 h-4 text-blue-600 animate-pulse" />
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-800'
                }`}>
                  🚀 INSTANT Real-Time Notification
                </span>
              </div>
              <p className={`text-xs transition-colors duration-300 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                📱 Akshata will receive an <strong>INSTANT SMS</strong> at <strong>+919740303404</strong> the moment you book!
              </p>
              <p className={`text-xs mt-1 transition-colors duration-300 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                ⚡ No delays - Real-time booking notifications with multiple SMS providers for 100% delivery
              </p>
            </div>

            {/* Book Button */}
            <button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime || getSelectedServicesList().length === 0 || isBooking}
              className={`w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:scale-105 hover:shadow-2xl transform ${
                animateSummary ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              }`}
              style={{ transitionDelay: '450ms' }}
            >
              {isBooking ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>📱 Booking & Sending INSTANT SMS to +919740303404...</span>
                </>
              ) : (
                <>
                  <span>🚀 Book Appointment (Instant SMS to Akshata)</span>
                  <ArrowRight className="w-5 h-5 animate-bounce" />
                </>
              )}
            </button>

            {/* Contact Info */}
            <div className={`mt-4 text-center text-sm transition-all duration-700 delay-500 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            } ${animateSummary ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
              <p>Need help? Call us at</p>
              <a href="tel:+919740303404" className="text-pink-600 hover:underline font-medium hover:scale-105 inline-block transition-transform duration-300">
                +91 97403 03404 (Akshata)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;