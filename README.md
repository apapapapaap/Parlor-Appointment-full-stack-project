AKSHATA PARLOR - Modern Appointment Booking System
A comprehensive web application for parlor appointment booking with real-time SMS notifications, payment processing, and customer review management.

🌟 Overview
Akshata Parlor is a full-featured appointment booking system designed specifically for beauty parlors and salons. The application provides seamless booking experience with automated notifications, multiple payment options, and customer feedback management.

📋 Table of Contents
Features

Technology Stack

Project Architecture

Getting Started

Usage

API Services

Contributing

✨ Features
Core Functionality
User Authentication - Secure login/register with auto-registration for new users

Service Booking - Multi-service selection with dynamic pricing

Real-time Notifications - Instant SMS alerts to business owner

Payment Processing - Multiple payment options (UPI, Card, Cash)

Review System - Customer feedback and rating management

Account Management - Profile settings and preferences

Advanced Features
🌙 Dark Mode - Complete theme switching capability

📱 Mobile Responsive - Mobile-first design approach

📄 PDF Generation - Professional receipt generation

💳 Payment History - Complete transaction tracking

🔒 Password Recovery - Email-based password reset

✨ Smooth Animations - Professional UI transitions

State Management
React Hooks - useState, useEffect for local state

Context Pattern - Global state management

Local Storage - Persistent data storage

Services & Integrations
SMS Services - Multi-provider notification system

TextLocal (Primary - Indian SMS)

Twilio (Backup - International)

AWS SNS (Cloud backup)

Email Service - Password reset functionality

PDF Service - Receipt generation with jsPDF

Authentication - Custom user management system

🏗️ Project Architecture
  graph TD
    A[User Opens App] --> B{User Authenticated?}
    B -->|No| C[Login/Register Page]
    B -->|Yes| D[Dashboard/Booking Page]
    
    C --> E[Email/Password Input]
    E --> F[Auto-Registration if New User]
    F --> G[Authentication Service]
    G --> H{Login Success?}
    H -->|No| I[Show Error Message]
    H -->|Yes| D
    
    D --> J[Service Selection]
    J --> K[Date/Time Selection]
    K --> L[Customer Phone Input]
    L --> M[Book Appointment Button]
    
    M --> N[Real-time SMS to Akshata]
    N --> O[Payment Page]
    O --> P{Payment Method?}
    
    P -->|UPI| Q[UPI Payment Processing]
    P -->|Card| R[Card Payment Processing]
    P -->|Cash| S[Pay at Parlor Option]
    
    Q --> T[Payment Confirmation SMS]
    R --> T
    S --> U[Booking Confirmation]
    
    T --> V[Review Page]
    U --> V
    V --> W[Submit Review]
    W --> X[Thank You Page]
    
    D --> Y[View Reviews]
    Y --> Z[Customer Reviews Page]
    Z --> AA[Write/Edit Reviews]
    
    D --> BB[Account Settings]
    BB --> CC[Profile/Security/Preferences]
    
    D --> DD[Payment History]
    DD --> EE[View Receipts/Download PDF]
    
    G --> FF[Password Reset Flow]
    FF --> GG[Email Service]
    GG --> HH[Reset Link Sent]
    HH --> II[New Password Setup]
or Customers
Registration - Automatic account creation during first booking

Service Selection - Browse and select from available services

Appointment Booking - Choose date, time, and add contact details

Payment - Complete payment via UPI, card, or cash option

Reviews - Share feedback after service completion

For Business Owner
Real-time Notifications - Receive SMS alerts for new bookings

Customer Management - Access to customer details and booking history

Review Monitoring - Track customer feedback and ratings

📡 API Services
SMS Notification System
Primary: TextLocal (Indian market)

Backup: Twilio (International)

Fallback: AWS SNS

Webhook support for delivery confirmations

Payment Integration
UPI - Unified Payment Interface

Card Payments - Secure card processing

Cash Option - Pay-at-parlor functionality

🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request