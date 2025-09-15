export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  category: 'regular' | 'bridal';
  description?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  services: Service[];
  date: string;
  time: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  paymentMethod?: 'upi' | 'card' | 'cash';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  completedAt?: string;
}

export interface PaymentHistory {
  id: string;
  appointmentId: string;
  userId: string;
  amount: number;
  paymentMethod: 'upi' | 'card' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  transactionDate: string;
  services: Service[];
  customerName: string;
  customerEmail: string;
  notes?: string;
}

export interface Review {
  id: string;
  userId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  date: string;
  customerName?: string;
  customerAvatar?: string;
  services?: string[];
  isEdited?: boolean;
  editedAt?: string;
}