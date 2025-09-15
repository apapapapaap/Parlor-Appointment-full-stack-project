import React, { useState } from 'react';
import { QrCode, CreditCard, Smartphone, CheckCircle, Banknote, MapPin, Clock, AlertCircle, Phone, ArrowLeft, X, Calendar } from 'lucide-react';
import { Appointment } from '../types';
import SMSService from '../services/smsService';

interface PaymentPageProps {
  appointment: Appointment;
  onPaymentComplete: () => void;
  onBack?: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ appointment, onPaymentComplete, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const smsService = SMSService.getInstance();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Different processing times based on payment method
    const processingTime = paymentMethod === 'cash' ? 1000 : 2000;
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, processingTime));

      // Update appointment with payment details
      const updatedAppointment = {
        ...appointment,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
        paymentId: paymentMethod !== 'cash' ? `PAY_${Date.now()}` : undefined,
        completedAt: new Date().toISOString()
      };

      // Send payment confirmation SMS to Akshata
      if (paymentMethod !== 'cash') {
        try {
          const userData = JSON.parse(localStorage.getItem('akshata_users') || '{}');
          const userEmail = Object.keys(userData)[0] || 'customer@example.com';
          const userName = userData[userEmail]?.name || 'Customer';

          const paymentSMSData = {
            customerName: userName,
            customerEmail: userEmail,
            services: appointment.services.map(service => service.name),
            appointmentDate: appointment.date,
            appointmentTime: appointment.time,
            totalAmount: appointment.totalPrice,
            appointmentId: appointment.id
          };

          const paymentNotificationMessage = `💰 PAYMENT RECEIVED - AKSHATA PARLOR

Customer: ${userName}
Email: ${userEmail}

💳 Payment Method: ${paymentMethod === 'upi' ? 'UPI Payment' : 'Card Payment'}
💰 Amount: ₹${appointment.totalPrice.toLocaleString()}
📋 Booking ID: ${appointment.id}
🆔 Payment ID: ${updatedAppointment.paymentId}

📅 Appointment: ${appointment.date} at ${appointment.time}
💄 Services: ${appointment.services.map(s => s.name).join(', ')}

✅ Payment confirmed and appointment secured!

- AKSHATA PARLOR System`;

          await smsService.sendSMS({
            to: smsService.getAkshataNumber(),
            message: paymentNotificationMessage
          });

          console.log('✅ Payment confirmation sent to Akshata');
        } catch (smsError) {
          console.error('❌ Failed to send payment confirmation SMS:', smsError);
        }
      }

      setIsProcessing(false);
      onPaymentComplete();
    } catch (error) {
      console.error('Payment processing error:', error);
      setIsProcessing(false);
      alert('Payment processing failed. Please try again.');
    }
  };

  const handleCancelPayment = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancelPayment = () => {
    if (onBack) {
      onBack();
    } else {
      // If no onBack prop, redirect to booking page
      window.location.reload();
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardInputChange = (field: string, value: string) => {
    if (field === 'number') {
      value = formatCardNumber(value);
    } else if (field === 'expiry') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substr(0, 5);
    } else if (field === 'cvv') {
      value = value.replace(/\D/g, '').substr(0, 3);
    }
    
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const upiId = "akshata.parlor@paytm";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with Navigation */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {/* Back to Booking Button */}
              <button
                onClick={onBack || (() => window.location.reload())}
                className="text-white/80 hover:text-white font-medium flex items-center space-x-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Booking</span>
              </button>
              
              {/* Book New Appointment Link */}
              <div className="text-white/60">|</div>
              <button
                onClick={onBack || (() => window.location.reload())}
                className="text-white/80 hover:text-white font-medium flex items-center space-x-2 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Book New Appointment</span>
              </button>
            </div>

            {/* Cancel Payment Button */}
            <button
              onClick={handleCancelPayment}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel Payment</span>
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-2">Complete Payment</h2>
          <p className="opacity-90">Choose your preferred payment method</p>
        </div>

        {/* Appointment Summary */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-medium">{appointment.date} at {appointment.time}</span>
            </div>
            <div className="space-y-2">
              <span className="text-gray-600">Services:</span>
              {appointment.services.map((service, index) => (
                <div key={index} className="flex justify-between ml-4">
                  <span className="text-sm">{service.name}</span>
                  <span className="text-sm font-medium">₹{service.price}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-lg font-bold text-pink-600 pt-2 border-t">
              <span>Total Amount:</span>
              <span>₹{appointment.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* SMS Notification Info */}
        <div className="p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center space-x-2 mb-2">
            <Phone className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Instant Payment Notification</span>
          </div>
          <p className="text-sm text-blue-600">
            📱 Akshata will be notified immediately at <strong>{smsService.getAkshataNumber()}</strong> when payment is completed
          </p>
          <p className="text-sm text-blue-600 mt-1">
            ✅ Your appointment will be automatically confirmed upon successful payment
          </p>
        </div>

        {/* Payment Methods */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Payment Method</h3>
          
          <div className="space-y-4 mb-6">
            {/* UPI Payment Option */}
            <button
              onClick={() => setPaymentMethod('upi')}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'upi'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <QrCode className="w-6 h-6 text-pink-600" />
                <div className="text-left">
                  <div className="font-semibold">UPI Payment</div>
                  <div className="text-sm text-gray-600">Pay using any UPI app - Instant & Secure</div>
                </div>
                {paymentMethod === 'upi' && (
                  <CheckCircle className="w-5 h-5 text-pink-600 ml-auto" />
                )}
              </div>
            </button>

            {/* Card Payment Option */}
            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'card'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6 text-pink-600" />
                <div className="text-left">
                  <div className="font-semibold">Card Payment</div>
                  <div className="text-sm text-gray-600">Credit/Debit card - All major cards accepted</div>
                </div>
                {paymentMethod === 'card' && (
                  <CheckCircle className="w-5 h-5 text-pink-600 ml-auto" />
                )}
              </div>
            </button>

            {/* Cash Payment Option */}
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'cash'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Banknote className="w-6 h-6 text-green-600" />
                <div className="text-left">
                  <div className="font-semibold">Pay at Parlor</div>
                  <div className="text-sm text-gray-600">Pay with cash when you arrive - No advance payment</div>
                </div>
                {paymentMethod === 'cash' && (
                  <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                )}
              </div>
            </button>
          </div>

          {/* UPI Payment Details */}
          {paymentMethod === 'upi' && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="text-center">
                <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-sm">
                  <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-gray-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Scan QR code with any UPI app</p>
                <p className="font-mono text-sm bg-white px-3 py-2 rounded-lg inline-block border">
                  {upiId}
                </p>
                <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-500">
                  <span>Supported apps:</span>
                  <div className="flex space-x-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Paytm</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">PhonePe</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">GPay</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card Payment Details */}
          {paymentMethod === 'card' && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) => handleCardInputChange('number', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="text"
                      value={cardDetails.cvv}
                      onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                      placeholder="123"
                      maxLength={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardDetails.name}
                    onChange={(e) => handleCardInputChange('name', e.target.value)}
                    placeholder="John Doe"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cash Payment Details */}
          {paymentMethod === 'cash' && (
            <div className="bg-green-50 rounded-xl p-6 mb-6 border border-green-200">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Banknote className="w-8 h-8 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-green-800">Pay at Parlor</h4>
                    <p className="text-sm text-green-600">No advance payment required</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h5 className="font-medium text-gray-800 mb-3">Important Information:</h5>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Location:</span> AKSHATA PARLOR, Main Street, Beauty Plaza
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Clock className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Arrival:</span> Please arrive 10 minutes before your appointment time
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Banknote className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Payment:</span> Cash payment accepted at the counter after service completion
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Phone className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Notification:</span> Akshata will still be notified about your booking
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 mb-1">Please Note:</p>
                      <ul className="text-yellow-700 space-y-1">
                        <li>• Exact change is appreciated but not required</li>
                        <li>• We accept denominations of ₹10 and above</li>
                        <li>• Receipt will be provided after payment</li>
                        <li>• Cancellation must be done 2 hours before appointment</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="text-sm">
                      <span className="font-medium text-green-800">Booking Confirmed!</span>
                      <p className="text-green-700">Your appointment is reserved. Pay when you arrive.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing || (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name))}
            className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
              paymentMethod === 'cash'
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>
                  {paymentMethod === 'cash' ? 'Confirming Booking & Notifying Akshata...' : 'Processing Payment & Notifying Akshata...'}
                </span>
              </>
            ) : (
              <>
                {paymentMethod === 'cash' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Confirm Booking (Pay at Parlor)</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-5 h-5" />
                    <span>Pay ₹{appointment.totalPrice}</span>
                  </>
                )}
              </>
            )}
          </button>

          {/* Security Notice */}
          <div className="mt-4 text-center text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 inline mr-1" />
            {paymentMethod === 'cash' 
              ? 'Your booking is secure and Akshata will be notified immediately'
              : 'Secure payment with instant notification to Akshata'
            }
          </div>

          {/* Payment Method Benefits */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className={`p-3 rounded-lg border ${paymentMethod === 'upi' ? 'bg-pink-50 border-pink-200' : 'bg-gray-50 border-gray-200'}`}>
              <QrCode className="w-5 h-5 text-pink-600 mb-2" />
              <div className="font-medium text-gray-800">UPI Payment</div>
              <div className="text-gray-600">Instant & Secure</div>
            </div>
            <div className={`p-3 rounded-lg border ${paymentMethod === 'card' ? 'bg-pink-50 border-pink-200' : 'bg-gray-50 border-gray-200'}`}>
              <CreditCard className="w-5 h-5 text-pink-600 mb-2" />
              <div className="font-medium text-gray-800">Card Payment</div>
              <div className="text-gray-600">All Cards Accepted</div>
            </div>
            <div className={`p-3 rounded-lg border ${paymentMethod === 'cash' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <Banknote className="w-5 h-5 text-green-600 mb-2" />
              <div className="font-medium text-gray-800">Cash Payment</div>
              <div className="text-gray-600">Pay at Parlor</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Payment Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Cancel Payment?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this payment? You'll be redirected back to the booking page and will need to start over.
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Continue Payment
                </button>
                <button
                  onClick={confirmCancelPayment}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;