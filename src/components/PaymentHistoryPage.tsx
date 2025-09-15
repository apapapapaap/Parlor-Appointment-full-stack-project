import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Receipt, 
  Download, 
  Eye, 
  Calendar, 
  CreditCard, 
  Smartphone, 
  Banknote,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Filter,
  Search,
  TrendingUp,
  DollarSign,
  FileText,
  Star,
  Sparkles,
  Heart
} from 'lucide-react';
import { User, PaymentHistory } from '../types';
import PDFService from '../services/pdfService';

interface PaymentHistoryPageProps {
  user: User;
  onBack: () => void;
  isDarkMode?: boolean;
}

const PaymentHistoryPage: React.FC<PaymentHistoryPageProps> = ({ 
  user, 
  onBack, 
  isDarkMode = false 
}) => {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentHistory[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [animateFilters, setAnimateFilters] = useState(false);
  const [animatePayments, setAnimatePayments] = useState(false);
  const [hoveredPayment, setHoveredPayment] = useState<string | null>(null);

  const pdfService = PDFService.getInstance();

  // Trigger animations on mount
  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    const timer2 = setTimeout(() => setAnimateHeader(true), 200);
    const timer3 = setTimeout(() => setAnimateStats(true), 400);
    const timer4 = setTimeout(() => setAnimateFilters(true), 600);
    const timer5 = setTimeout(() => setAnimatePayments(true), 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  // Load payment history
  useEffect(() => {
    const loadPaymentHistory = async () => {
      setIsLoading(true);
      
      // Simulate loading delay for animation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock payment data - in real app, this would come from API
      const mockPayments: PaymentHistory[] = [
        {
          id: 'PAY_001',
          appointmentId: 'APT_001',
          userId: user.id,
          amount: 2500,
          paymentMethod: 'upi',
          paymentStatus: 'paid',
          paymentId: 'UPI_123456789',
          transactionDate: '2024-01-15T10:30:00Z',
          customerName: user.name,
          customerEmail: user.email,
          services: [
            { id: '1', name: 'Gold Facial', price: 1500, duration: 90, category: 'regular' },
            { id: '2', name: 'Manicure', price: 500, duration: 45, category: 'regular' },
            { id: '3', name: 'Pedicure', price: 600, duration: 60, category: 'regular' }
          ],
          notes: 'Excellent service, very satisfied!'
        },
        {
          id: 'PAY_002',
          appointmentId: 'APT_002',
          userId: user.id,
          amount: 15000,
          paymentMethod: 'card',
          paymentStatus: 'paid',
          paymentId: 'CARD_987654321',
          transactionDate: '2024-01-10T14:15:00Z',
          customerName: user.name,
          customerEmail: user.email,
          services: [
            { id: '4', name: 'Premium Bridal Makeup', price: 15000, duration: 240, category: 'bridal' }
          ],
          notes: 'Wedding makeup for sister\'s wedding'
        },
        {
          id: 'PAY_003',
          appointmentId: 'APT_003',
          userId: user.id,
          amount: 800,
          paymentMethod: 'cash',
          paymentStatus: 'pending',
          transactionDate: '2024-01-20T16:45:00Z',
          customerName: user.name,
          customerEmail: user.email,
          services: [
            { id: '5', name: 'Basic Facial', price: 800, duration: 60, category: 'regular' }
          ],
          notes: 'Pay at parlor'
        }
      ];

      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
      setIsLoading(false);
    };

    loadPaymentHistory();
  }, [user]);

  // Filter payments
  useEffect(() => {
    let filtered = payments;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(payment => payment.paymentStatus === filterStatus);
    }

    if (filterMethod !== 'all') {
      filtered = filtered.filter(payment => payment.paymentMethod === filterMethod);
    }

    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.paymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.services.some(service => 
          service.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredPayments(filtered);
  }, [payments, filterStatus, filterMethod, searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'upi':
        return <Smartphone className="w-5 h-5" />;
      case 'card':
        return <CreditCard className="w-5 h-5" />;
      case 'cash':
        return <Banknote className="w-5 h-5" />;
      default:
        return <Receipt className="w-5 h-5" />;
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'upi':
        return 'UPI Payment';
      case 'card':
        return 'Card Payment';
      case 'cash':
        return 'Cash Payment';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'refunded':
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return isDarkMode ? 'bg-green-900/50 text-green-300 border-green-700' : 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return isDarkMode ? 'bg-yellow-900/50 text-yellow-300 border-yellow-700' : 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'failed':
        return isDarkMode ? 'bg-red-900/50 text-red-300 border-red-700' : 'bg-red-100 text-red-700 border-red-200';
      case 'refunded':
        return isDarkMode ? 'bg-blue-900/50 text-blue-300 border-blue-700' : 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700';
    }
  };

  const handleDownloadReceipt = (payment: PaymentHistory) => {
    try {
      pdfService.generateReceipt(payment);
    } catch (error) {
      alert('Failed to generate receipt. Please try again.');
    }
  };

  const handlePreviewReceipt = (payment: PaymentHistory) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  const calculateStats = () => {
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const paidAmount = payments
      .filter(payment => payment.paymentStatus === 'paid')
      .reduce((sum, payment) => sum + payment.amount, 0);
    const pendingAmount = payments
      .filter(payment => payment.paymentStatus === 'pending')
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      totalTransactions: payments.length,
      totalAmount,
      paidAmount,
      pendingAmount,
      averageAmount: payments.length > 0 ? totalAmount / payments.length : 0
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-1000 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4 shadow-lg animate-pulse">
            <Receipt className="w-8 h-8 text-white animate-bounce" />
          </div>
          <h2 className={`text-xl font-semibold mb-2 transition-colors duration-500 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Loading Payment History
          </h2>
          <div className="flex items-center justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full animate-bounce ${
                  isDarkMode ? 'bg-pink-400' : 'bg-pink-600'
                }`}
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Animated Header */}
        <div className={`mb-8 transform transition-all duration-1000 ease-out ${
          animateHeader ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className={`transition-all duration-300 font-medium flex items-center space-x-2 hover:scale-105 ${
                isDarkMode 
                  ? 'text-pink-400 hover:text-pink-300' 
                  : 'text-pink-600 hover:text-pink-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4 animate-bounce" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          {/* Animated Title with Effects */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl animate-pulse"></div>
            <div className="relative">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 animate-pulse">
                <Receipt className="inline w-10 h-10 mr-3 text-pink-500 animate-bounce" />
                Payment History
                <Sparkles className="inline w-6 h-6 ml-2 text-purple-500 animate-spin" />
              </h1>
              <p className={`transition-colors duration-500 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Track all your transactions and download receipts
              </p>
            </div>
          </div>
        </div>

        {/* Animated Stats Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transform transition-all duration-1000 ease-out ${
          animateStats ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {[
            {
              title: 'Total Transactions',
              value: stats.totalTransactions,
              icon: FileText,
              color: 'pink',
              prefix: '',
              delay: '0ms'
            },
            {
              title: 'Total Amount',
              value: stats.totalAmount,
              icon: DollarSign,
              color: 'purple',
              prefix: '₹',
              delay: '100ms'
            },
            {
              title: 'Amount Paid',
              value: stats.paidAmount,
              icon: CheckCircle,
              color: 'green',
              prefix: '₹',
              delay: '200ms'
            },
            {
              title: 'Pending Amount',
              value: stats.pendingAmount,
              icon: Clock,
              color: 'yellow',
              prefix: '₹',
              delay: '300ms'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className={`rounded-2xl shadow-lg p-6 transition-all duration-700 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              } ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: stat.delay }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {stat.prefix}{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                  stat.color === 'pink' ? 'bg-pink-100 text-pink-600' :
                  stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  stat.color === 'green' ? 'bg-green-100 text-green-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  <stat.icon className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Animated Filters */}
        <div className={`rounded-2xl shadow-lg p-6 mb-8 transition-all duration-1000 ease-out ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        } ${animateFilters ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, payment ID, or service..."
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 focus:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className={`w-5 h-5 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Method Filter */}
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Methods</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
            </select>
          </div>
        </div>

        {/* Animated Payment List */}
        <div className={`space-y-6 transform transition-all duration-1000 ease-out ${
          animatePayments ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment, index) => (
              <div
                key={payment.id}
                className={`rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 transform hover:scale-105 cursor-pointer ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                } ${animatePayments ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredPayment(payment.id)}
                onMouseLeave={() => setHoveredPayment(null)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {/* Animated Payment Method Icon */}
                    <div className={`p-3 rounded-full transition-all duration-300 ${
                      payment.paymentMethod === 'upi' ? 'bg-blue-100 text-blue-600' :
                      payment.paymentMethod === 'card' ? 'bg-purple-100 text-purple-600' :
                      'bg-green-100 text-green-600'
                    } ${hoveredPayment === payment.id ? 'scale-110 rotate-12' : ''}`}>
                      {getPaymentMethodIcon(payment.paymentMethod)}
                    </div>
                    
                    <div>
                      <h3 className={`text-lg font-semibold transition-all duration-300 ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      } ${hoveredPayment === payment.id ? 'text-pink-600' : ''}`}>
                        {payment.id}
                      </h3>
                      <p className={`text-sm transition-colors duration-500 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {formatDate(payment.transactionDate)}
                      </p>
                    </div>
                  </div>

                  {/* Animated Status Badge */}
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border transition-all duration-300 ${
                    getStatusColor(payment.paymentStatus)
                  } ${hoveredPayment === payment.id ? 'scale-110' : ''}`}>
                    {getStatusIcon(payment.paymentStatus)}
                    <span className="text-sm font-medium capitalize">
                      {payment.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Services List with Animation */}
                <div className="mb-4">
                  <h4 className={`text-sm font-medium mb-2 transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Services:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {payment.services.map((service, serviceIndex) => (
                      <span
                        key={serviceIndex}
                        className={`px-3 py-1 text-xs rounded-full transition-all duration-500 hover:scale-105 ${
                          service.category === 'bridal'
                            ? isDarkMode
                              ? 'bg-purple-900/50 text-purple-300 border border-purple-700'
                              : 'bg-purple-100 text-purple-700'
                            : isDarkMode
                              ? 'bg-pink-900/50 text-pink-300 border border-pink-700'
                              : 'bg-pink-100 text-pink-700'
                        }`}
                        style={{ 
                          animationDelay: `${serviceIndex * 50}ms`,
                          animation: hoveredPayment === payment.id ? 'pulse 1s infinite' : 'none'
                        }}
                      >
                        {service.name} - ₹{service.price}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Payment Details with Animation */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className={`text-sm transition-colors duration-500 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Payment Method
                      </p>
                      <p className={`font-medium transition-colors duration-500 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {getPaymentMethodName(payment.paymentMethod)}
                      </p>
                    </div>
                    
                    {payment.paymentId && (
                      <div>
                        <p className={`text-sm transition-colors duration-500 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Payment ID
                        </p>
                        <p className={`font-mono text-sm transition-colors duration-500 ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {payment.paymentId}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Animated Amount */}
                    <div className="text-right">
                      <p className={`text-sm transition-colors duration-500 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Total Amount
                      </p>
                      <p className={`text-2xl font-bold transition-all duration-300 ${
                        hoveredPayment === payment.id ? 'text-pink-600 scale-110' : isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}>
                        ₹{payment.amount.toLocaleString()}
                      </p>
                    </div>

                    {/* Animated Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreviewReceipt(payment)}
                        className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                          isDarkMode
                            ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800'
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                        title="Preview Receipt"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => handleDownloadReceipt(payment)}
                        className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                          isDarkMode
                            ? 'bg-green-900/50 text-green-300 hover:bg-green-800'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                        title="Download Receipt"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notes with Animation */}
                {payment.notes && (
                  <div className={`mt-4 p-3 rounded-lg transition-all duration-500 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } ${hoveredPayment === payment.id ? 'bg-opacity-80' : ''}`}>
                    <p className={`text-sm transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <strong>Notes:</strong> {payment.notes}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            /* Animated Empty State */
            <div className={`text-center py-16 transform transition-all duration-1000 ${
              animatePayments ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className={`mb-6 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <Receipt className="w-24 h-24 mx-auto mb-4 animate-bounce" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No Payment History Found
              </h3>
              <p className={`mb-8 max-w-md mx-auto transition-colors duration-500 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {searchTerm || filterStatus !== 'all' || filterMethod !== 'all'
                  ? 'No payments match your current filters. Try adjusting your search criteria.'
                  : 'You haven\'t made any payments yet. Book your first appointment to see your payment history here.'
                }
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterMethod('all');
                }}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 mx-auto transform hover:scale-105 hover:shadow-lg"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Clear Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Floating Animation Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-pulse ${
                i % 2 === 0 ? 'bg-pink-400' : 'bg-purple-400'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 500}ms`,
                animationDuration: `${2000 + Math.random() * 2000}ms`
              }}
            />
          ))}
        </div>
      </div>

      {/* Receipt Preview Modal */}
      {showReceiptModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className={`max-w-2xl w-full rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  Receipt Preview
                </h3>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Receipt Content Preview */}
              <div className={`border rounded-xl p-6 mb-6 transition-colors duration-500 ${
                isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-pink-600 mb-2">AKSHATA PARLOR</h2>
                  <p className={`text-sm transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Beauty & Bridal Services
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className={`transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Receipt No:
                    </span>
                    <span className={`font-medium transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {selectedPayment.id}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={`transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Date:
                    </span>
                    <span className={`font-medium transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {formatDate(selectedPayment.transactionDate)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className={`transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Payment Method:
                    </span>
                    <span className={`font-medium transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {getPaymentMethodName(selectedPayment.paymentMethod)}
                    </span>
                  </div>

                  <div className={`border-t pt-4 transition-colors duration-500 ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}>
                    <h4 className={`font-semibold mb-2 transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      Services:
                    </h4>
                    {selectedPayment.services.map((service, index) => (
                      <div key={index} className="flex justify-between mb-1">
                        <span className={`text-sm transition-colors duration-500 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {service.name}
                        </span>
                        <span className={`text-sm font-medium transition-colors duration-500 ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          ₹{service.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className={`border-t pt-4 flex justify-between text-lg font-bold transition-colors duration-500 ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}>
                    <span className={`transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      Total:
                    </span>
                    <span className="text-pink-600">₹{selectedPayment.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleDownloadReceipt(selectedPayment)}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </button>
                
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>Close</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryPage;