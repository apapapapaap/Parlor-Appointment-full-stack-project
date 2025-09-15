interface SMSConfig {
  apiKey: string;
  senderId: string;
  baseUrl: string;
}

interface SMSTemplate {
  to: string;
  message: string;
}

interface AppointmentSMSData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  services: string[];
  appointmentDate: string;
  appointmentTime: string;
  totalAmount: number;
  appointmentId: string;
}

export class SMSService {
  private static instance: SMSService;
  private config: SMSConfig;
  private akshataNumber = '+919740303404'; // Akshata's actual number

  static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  constructor() {
    // SMS configuration for production
    this.config = {
      apiKey: import.meta.env.VITE_SMS_API_KEY || 'demo-api-key',
      senderId: 'AKSHATA',
      baseUrl: 'https://api.textlocal.in/send/'
    };
  }

  private createAppointmentBookingMessage(data: AppointmentSMSData): SMSTemplate {
    const servicesList = data.services.join(', ');
    const formattedDate = new Date(data.appointmentDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const message = `🌟 NEW APPOINTMENT BOOKED! 🌟

Customer: ${data.customerName}
Email: ${data.customerEmail}
${data.customerPhone ? `Phone: +91${data.customerPhone}` : 'Phone: Not provided'}

📅 Date: ${formattedDate}
⏰ Time: ${data.appointmentTime}

💄 Services:
${servicesList}

💰 Total Amount: ₹${data.totalAmount.toLocaleString()}

📋 Booking ID: ${data.appointmentId}

Please confirm the appointment with the customer.

- AKSHATA PARLOR System`;

    return {
      to: this.akshataNumber,
      message
    };
  }

  private createCustomerConfirmationMessage(data: AppointmentSMSData): SMSTemplate {
    const servicesList = data.services.slice(0, 2).join(', ') + (data.services.length > 2 ? ` +${data.services.length - 2} more` : '');
    const formattedDate = new Date(data.appointmentDate).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const message = `✨ AKSHATA PARLOR - Booking Confirmed! ✨

Hi ${data.customerName}!

Your appointment is confirmed:
📅 ${formattedDate} at ${data.appointmentTime}
💄 Services: ${servicesList}
💰 Amount: ₹${data.totalAmount.toLocaleString()}

📋 Booking ID: ${data.appointmentId}

We'll call you 1 day before to confirm. For any changes, call +91 98765 43210.

Thank you for choosing AKSHATA PARLOR! 💖`;

    return {
      to: data.customerPhone ? `+91${data.customerPhone}` : '',
      message
    };
  }

  async sendAppointmentNotification(appointmentData: AppointmentSMSData): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📱 Sending REAL-TIME appointment notification SMS to Akshata:', this.akshataNumber);

      // Create SMS template for Akshata
      const smsTemplate = this.createAppointmentBookingMessage(appointmentData);

      // Send SMS using multiple providers for reliability
      const result = await this.sendSMSWithFallback(smsTemplate);

      if (result.success) {
        console.log('✅ Appointment notification sent successfully to Akshata:', this.akshataNumber);
        
        // Also send confirmation to customer if phone number is available
        if (appointmentData.customerPhone) {
          await this.sendCustomerConfirmation(appointmentData);
        }

        return { success: true };
      } else {
        console.error('❌ Failed to send appointment notification:', result.error);
        return { success: false, error: result.error };
      }

    } catch (error) {
      console.error('❌ SMS service error:', error);
      return { 
        success: false, 
        error: 'Failed to send SMS notification. Please contact Akshata directly.' 
      };
    }
  }

  async sendCustomerConfirmation(appointmentData: AppointmentSMSData): Promise<{ success: boolean; error?: string }> {
    try {
      if (!appointmentData.customerPhone) {
        return { success: false, error: 'Customer phone number not provided' };
      }

      console.log('📱 Sending confirmation SMS to customer...');

      const smsTemplate = this.createCustomerConfirmationMessage(appointmentData);
      const result = await this.sendSMSWithFallback(smsTemplate);

      if (result.success) {
        console.log('✅ Customer confirmation sent successfully to:', `+91${appointmentData.customerPhone}`);
        return { success: true };
      } else {
        console.error('❌ Failed to send customer confirmation:', result.error);
        return { success: false, error: result.error };
      }

    } catch (error) {
      console.error('❌ Customer SMS error:', error);
      return { success: false, error: 'Failed to send customer confirmation SMS' };
    }
  }

  async sendSMSWithFallback(smsTemplate: SMSTemplate): Promise<{ success: boolean; error?: string }> {
    try {
      // Try multiple SMS providers for reliability
      
      // 1. Try TextLocal (Primary - Indian SMS service)
      console.log('🔄 Attempting to send SMS via TextLocal...');
      const textLocalResult = await this.sendWithTextLocal(smsTemplate);
      if (textLocalResult.success) {
        console.log('✅ SMS sent successfully via TextLocal');
        return textLocalResult;
      }
      console.log('⚠️ TextLocal failed, trying Twilio...');

      // 2. Try Twilio (Secondary - International service)
      const twilioResult = await this.sendWithTwilio(smsTemplate);
      if (twilioResult.success) {
        console.log('✅ SMS sent successfully via Twilio');
        return twilioResult;
      }
      console.log('⚠️ Twilio failed, trying AWS SNS...');

      // 3. Try AWS SNS (Tertiary - Cloud service)
      const awsResult = await this.sendWithAWSSNS(smsTemplate);
      if (awsResult.success) {
        console.log('✅ SMS sent successfully via AWS SNS');
        return awsResult;
      }
      console.log('⚠️ All SMS providers failed, using webhook fallback...');

      // 4. Try Webhook/API fallback
      const webhookResult = await this.sendWithWebhook(smsTemplate);
      if (webhookResult.success) {
        console.log('✅ SMS sent successfully via Webhook');
        return webhookResult;
      }

      // 5. Final fallback - Log for manual processing
      console.error('❌ All SMS providers failed, logging for manual processing');
      this.logForManualProcessing(smsTemplate);
      
      return { 
        success: false, 
        error: 'All SMS providers failed. Message logged for manual processing.' 
      };

    } catch (error) {
      console.error('❌ SMS sending error:', error);
      return { success: false, error: 'Failed to send SMS' };
    }
  }

  // Primary SMS Provider - TextLocal (Indian SMS service)
  private async sendWithTextLocal(smsTemplate: SMSTemplate): Promise<{ success: boolean; error?: string }> {
    try {
      // Remove +91 prefix for TextLocal API
      const phoneNumber = smsTemplate.to.replace('+91', '');
      
      const formData = new FormData();
      formData.append('apikey', this.config.apiKey);
      formData.append('numbers', `91${phoneNumber}`);
      formData.append('message', smsTemplate.message);
      formData.append('sender', this.config.senderId);

      const response = await fetch(this.config.baseUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === 'success') {
        console.log('✅ TextLocal SMS sent successfully:', result);
        return { success: true };
      } else {
        console.error('❌ TextLocal SMS failed:', result);
        return { 
          success: false, 
          error: result.errors?.[0]?.message || 'TextLocal SMS sending failed' 
        };
      }

    } catch (error) {
      console.error('❌ TextLocal SMS error:', error);
      return { success: false, error: `TextLocal error: ${error.message}` };
    }
  }

  // Secondary SMS Provider - Twilio
  private async sendWithTwilio(smsTemplate: SMSTemplate): Promise<{ success: boolean; error?: string }> {
    try {
      const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
      const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
      const fromNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

      if (!accountSid || !authToken || !fromNumber) {
        return { success: false, error: 'Twilio credentials not configured' };
      }

      const credentials = btoa(`${accountSid}:${authToken}`);
      
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: smsTemplate.to,
          Body: smsTemplate.message
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Twilio SMS sent successfully:', result.sid);
        return { success: true };
      } else {
        const error = await response.json();
        console.error('❌ Twilio SMS failed:', error);
        return { success: false, error: error.message || 'Twilio SMS failed' };
      }

    } catch (error) {
      console.error('❌ Twilio SMS error:', error);
      return { success: false, error: `Twilio error: ${error.message}` };
    }
  }

  // Tertiary SMS Provider - AWS SNS
  private async sendWithAWSSNS(smsTemplate: SMSTemplate): Promise<{ success: boolean; error?: string }> {
    try {
      // AWS SNS requires AWS SDK or direct API calls
      // For browser environment, we'll use a serverless function or API gateway
      
      const awsApiEndpoint = import.meta.env.VITE_AWS_SMS_ENDPOINT;
      
      if (!awsApiEndpoint) {
        return { success: false, error: 'AWS SMS endpoint not configured' };
      }

      const response = await fetch(awsApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_AWS_API_KEY}`
        },
        body: JSON.stringify({
          phoneNumber: smsTemplate.to,
          message: smsTemplate.message,
          senderId: this.config.senderId
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ AWS SNS SMS sent successfully:', result);
        return { success: true };
      } else {
        const error = await response.json();
        console.error('❌ AWS SNS SMS failed:', error);
        return { success: false, error: error.message || 'AWS SNS SMS failed' };
      }

    } catch (error) {
      console.error('❌ AWS SNS SMS error:', error);
      return { success: false, error: `AWS SNS error: ${error.message}` };
    }
  }

  // Webhook Fallback
  private async sendWithWebhook(smsTemplate: SMSTemplate): Promise<{ success: boolean; error?: string }> {
    try {
      const webhookUrl = import.meta.env.VITE_SMS_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/your-webhook-id/';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: smsTemplate.to,
          message: smsTemplate.message,
          timestamp: new Date().toISOString(),
          source: 'AKSHATA_PARLOR_BOOKING'
        })
      });

      if (response.ok) {
        console.log('✅ Webhook SMS notification sent successfully');
        return { success: true };
      } else {
        console.error('❌ Webhook SMS failed:', response.statusText);
        return { success: false, error: 'Webhook SMS failed' };
      }

    } catch (error) {
      console.error('❌ Webhook SMS error:', error);
      return { success: false, error: `Webhook error: ${error.message}` };
    }
  }

  // Log for manual processing
  private logForManualProcessing(smsTemplate: SMSTemplate): void {
    const logData = {
      timestamp: new Date().toISOString(),
      to: smsTemplate.to,
      message: smsTemplate.message,
      status: 'FAILED_AUTO_SEND',
      requiresManualProcessing: true
    };

    // Store in localStorage for admin review
    const existingLogs = JSON.parse(localStorage.getItem('failed_sms_logs') || '[]');
    existingLogs.push(logData);
    localStorage.setItem('failed_sms_logs', JSON.stringify(existingLogs));

    // Also log to console for immediate attention
    console.error('🚨 URGENT: SMS FAILED - MANUAL PROCESSING REQUIRED 🚨');
    console.error('📱 Phone:', smsTemplate.to);
    console.error('💬 Message:', smsTemplate.message);
    console.error('⏰ Time:', new Date().toLocaleString());
    
    // Show alert to user
    alert(`⚠️ SMS notification failed to send automatically.\n\n📱 Please manually notify Akshata at ${this.akshataNumber}\n\n💬 Message: New appointment booking received!`);
  }

  // Send payment confirmation SMS
  async sendPaymentConfirmation(appointmentData: AppointmentSMSData, paymentMethod: string, paymentId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const paymentMethodName = paymentMethod === 'upi' ? 'UPI Payment' : 
                               paymentMethod === 'card' ? 'Card Payment' : 'Cash Payment';

      const paymentMessage = `💰 PAYMENT RECEIVED - AKSHATA PARLOR

Customer: ${appointmentData.customerName}
Email: ${appointmentData.customerEmail}
${appointmentData.customerPhone ? `Phone: +91${appointmentData.customerPhone}` : 'Phone: Not provided'}

💳 Payment Method: ${paymentMethodName}
💰 Amount: ₹${appointmentData.totalAmount.toLocaleString()}
📋 Booking ID: ${appointmentData.appointmentId}
${paymentId ? `🆔 Payment ID: ${paymentId}` : ''}

📅 Appointment: ${new Date(appointmentData.appointmentDate).toLocaleDateString('en-IN')} at ${appointmentData.appointmentTime}
💄 Services: ${appointmentData.services.join(', ')}

✅ Payment confirmed and appointment secured!

- AKSHATA PARLOR System`;

      const smsTemplate: SMSTemplate = {
        to: this.akshataNumber,
        message: paymentMessage
      };

      return await this.sendSMSWithFallback(smsTemplate);

    } catch (error) {
      console.error('❌ Payment confirmation SMS error:', error);
      return { success: false, error: 'Failed to send payment confirmation' };
    }
  }

  // Test SMS service with real number
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🧪 Testing SMS service connection to Akshata...');
      
      const testMessage: SMSTemplate = {
        to: this.akshataNumber,
        message: `🧪 TEST MESSAGE - ${new Date().toLocaleString()}

This is a test message from AKSHATA PARLOR booking system.

✅ SMS service is working correctly!
📱 Real-time notifications are active.

- AKSHATA PARLOR System`
      };

      const result = await this.sendSMSWithFallback(testMessage);
      
      if (result.success) {
        console.log('✅ SMS service test successful - Akshata should receive the test message');
        return { success: true };
      } else {
        console.error('❌ SMS service test failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ SMS service test error:', error);
      return { success: false, error: 'SMS service test failed' };
    }
  }

  // Get Akshata's number
  getAkshataNumber(): string {
    return this.akshataNumber;
  }

  // Update configuration for production
  updateConfig(newConfig: Partial<SMSConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('📱 SMS configuration updated');
  }

  // Get failed SMS logs for admin review
  getFailedSMSLogs(): any[] {
    try {
      return JSON.parse(localStorage.getItem('failed_sms_logs') || '[]');
    } catch (error) {
      console.error('Error retrieving failed SMS logs:', error);
      return [];
    }
  }

  // Clear failed SMS logs
  clearFailedSMSLogs(): void {
    localStorage.removeItem('failed_sms_logs');
    console.log('🧹 Failed SMS logs cleared');
  }
}

export default SMSService;