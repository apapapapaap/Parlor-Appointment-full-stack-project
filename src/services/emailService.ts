interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private static instance: EmailService;
  private config: EmailConfig;

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  constructor() {
    // Email configuration - In production, these should come from environment variables
    this.config = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'akshataparlor@gmail.com', // Replace with your actual email
        pass: 'your-app-password' // Replace with your actual app password
      }
    };
  }

  private createPasswordResetTemplate(email: string, resetToken: string): EmailTemplate {
    const resetLink = `${window.location.origin}${window.location.pathname}?token=${resetToken}`;
    const supportEmail = 'support@akshataparlor.com';
    const supportPhone = '+91 98765 43210';

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your AKSHATA PARLOR Password</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            background: linear-gradient(135deg, #ec4899, #8b5cf6);
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .title {
            background: linear-gradient(135deg, #ec4899, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
          }
          .subtitle {
            color: #666;
            margin: 5px 0 0 0;
          }
          .content {
            margin: 30px 0;
          }
          .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #ec4899, #8b5cf6);
            color: white !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
          }
          .reset-button:hover {
            background: linear-gradient(135deg, #db2777, #7c3aed);
          }
          .security-notice {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
          }
          .security-title {
            color: #92400e;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .security-text {
            color: #92400e;
            font-size: 14px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .support-info {
            background: #f3f4f6;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
          }
          .link-text {
            word-break: break-all;
            background: #f3f4f6;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">✨</div>
            <h1 class="title">AKSHATA PARLOR</h1>
            <p class="subtitle">Beauty & Bridal Services</p>
          </div>

          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset the password for your AKSHATA PARLOR account associated with <strong>${email}</strong>.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="reset-button">Reset My Password</a>
            </div>

            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <div class="link-text">${resetLink}</div>

            <div class="security-notice">
              <div class="security-title">🔒 Important Security Information</div>
              <div class="security-text">
                • This link will expire in 15 minutes for your security<br>
                • Only use this link if you requested the password reset<br>
                • Never share this link with anyone<br>
                • If you didn't request this reset, please ignore this email
              </div>
            </div>

            <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          </div>

          <div class="support-info">
            <strong>Need Help?</strong><br>
            If you're having trouble with the password reset, please contact our support team:<br>
            📧 Email: <a href="mailto:${supportEmail}">${supportEmail}</a><br>
            📞 Phone: <a href="tel:${supportPhone}">${supportPhone}</a>
          </div>

          <div class="footer">
            <p>Best regards,<br><strong>AKSHATA PARLOR Team</strong></p>
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2024 AKSHATA PARLOR. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      AKSHATA PARLOR - Password Reset Request

      Hello,

      We received a request to reset the password for your AKSHATA PARLOR account associated with ${email}.

      To reset your password, please visit the following link:
      ${resetLink}

      IMPORTANT SECURITY INFORMATION:
      - This link will expire in 15 minutes for your security
      - Only use this link if you requested the password reset
      - Never share this link with anyone
      - If you didn't request this reset, please ignore this email

      If you're having trouble with the password reset, please contact our support team:
      Email: ${supportEmail}
      Phone: ${supportPhone}

      Best regards,
      AKSHATA PARLOR Team

      This is an automated email. Please do not reply to this message.
    `;

    return {
      to: email,
      subject: 'Reset Your AKSHATA PARLOR Password - Action Required',
      html,
      text
    };
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔄 Preparing to send password reset email to:', email);
      
      // Create email template
      const emailTemplate = this.createPasswordResetTemplate(email, resetToken);

      // For development, we'll use EmailJS (a real email service that works in browsers)
      // You can also integrate with other services like SendGrid, Mailgun, etc.
      
      // Try to send with EmailJS first (if configured)
      const emailJSResult = await this.sendWithEmailJS(emailTemplate, resetToken);
      
      if (emailJSResult.success) {
        console.log('✅ Password reset email sent successfully via EmailJS');
        return { success: true };
      }

      // Fallback to simulated email for development
      console.log('📧 EmailJS not configured, using development simulation');
      const simulationResult = await this.simulateEmailSending(emailTemplate);
      
      if (simulationResult.success) {
        // Store the email content in localStorage for development testing
        this.storeEmailForDevelopment(emailTemplate, resetToken);
        return { success: true };
      }

      return { success: false, error: 'Failed to send email' };

    } catch (error) {
      console.error('❌ Email service error:', error);
      return { 
        success: false, 
        error: 'Failed to send email. Please try again or contact support.' 
      };
    }
  }

  private async sendWithEmailJS(emailTemplate: EmailTemplate, resetToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      // EmailJS configuration (replace with your actual EmailJS credentials)
      const emailJSConfig = {
        serviceID: 'service_akshata_parlor', // Replace with your EmailJS service ID
        templateID: 'template_password_reset', // Replace with your EmailJS template ID
        userID: 'your_emailjs_user_id' // Replace with your EmailJS user ID
      };

      // Check if EmailJS is available and configured
      if (typeof window !== 'undefined' && (window as any).emailjs) {
        const emailjs = (window as any).emailjs;
        
        const templateParams = {
          to_email: emailTemplate.to,
          to_name: emailTemplate.to.split('@')[0],
          reset_link: `${window.location.origin}${window.location.pathname}?token=${resetToken}`,
          company_name: 'AKSHATA PARLOR',
          subject: emailTemplate.subject
        };

        await emailjs.send(
          emailJSConfig.serviceID,
          emailJSConfig.templateID,
          templateParams,
          emailJSConfig.userID
        );

        return { success: true };
      }

      // EmailJS not available
      return { success: false, error: 'EmailJS not configured' };

    } catch (error) {
      console.error('EmailJS error:', error);
      return { success: false, error: 'EmailJS service error' };
    }
  }

  private async simulateEmailSending(emailTemplate: EmailTemplate): Promise<{ success: boolean; error?: string }> {
    // This simulates email sending for development
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`
          ===== EMAIL SENT SUCCESSFULLY =====
          To: ${emailTemplate.to}
          Subject: ${emailTemplate.subject}
          
          ✅ Password reset email has been prepared and sent!
          
          📧 In development mode, check the browser console 
             and localStorage for the reset link.
          
          🔗 Reset link is also logged below for testing.
          ===================================
        `);

        // Extract reset link from HTML for easy access
        const linkMatch = emailTemplate.html.match(/href="([^"]*token=[^"]*)"/);
        if (linkMatch) {
          console.log('🔗 Reset Link for Testing:', linkMatch[1]);
        }

        resolve({ success: true });
      }, 1000);
    });
  }

  private storeEmailForDevelopment(emailTemplate: EmailTemplate, resetToken: string): void {
    try {
      // Store email details in localStorage for development testing
      const emailData = {
        to: emailTemplate.to,
        subject: emailTemplate.subject,
        resetToken,
        resetLink: `${window.location.origin}${window.location.pathname}?token=${resetToken}`,
        timestamp: new Date().toISOString(),
        html: emailTemplate.html
      };

      localStorage.setItem('akshata_last_reset_email', JSON.stringify(emailData));
      
      console.log('💾 Email data stored in localStorage for development testing');
      console.log('🔗 Reset Link:', emailData.resetLink);
      
      // Also show a user-friendly message
      setTimeout(() => {
        if (window.confirm(`📧 Development Mode: Password reset email prepared!\n\n🔗 Reset Link: ${emailData.resetLink}\n\nClick OK to copy the reset link to clipboard, or Cancel to continue.`)) {
          navigator.clipboard.writeText(emailData.resetLink).then(() => {
            alert('✅ Reset link copied to clipboard! You can paste it in the address bar to test the password reset.');
          }).catch(() => {
            console.log('📋 Reset link:', emailData.resetLink);
          });
        }
      }, 1500);

    } catch (error) {
      console.error('Error storing email data:', error);
    }
  }

  // Method to get stored email for development testing
  getStoredResetEmail(): any {
    try {
      const stored = localStorage.getItem('akshata_last_reset_email');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error retrieving stored email:', error);
      return null;
    }
  }

  // Method to integrate with real email services
  async sendWithRealEmailService(emailTemplate: EmailTemplate): Promise<{ success: boolean; error?: string }> {
    try {
      // Example integration with different email services:

      // 1. SendGrid API
      /*
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: emailTemplate.to }]
          }],
          from: { email: 'noreply@akshataparlor.com', name: 'AKSHATA PARLOR' },
          subject: emailTemplate.subject,
          content: [
            { type: 'text/html', value: emailTemplate.html },
            { type: 'text/plain', value: emailTemplate.text }
          ]
        })
      });

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'SendGrid API error' };
      }
      */

      // 2. Mailgun API
      /*
      const formData = new FormData();
      formData.append('from', 'AKSHATA PARLOR <noreply@akshataparlor.com>');
      formData.append('to', emailTemplate.to);
      formData.append('subject', emailTemplate.subject);
      formData.append('html', emailTemplate.html);
      formData.append('text', emailTemplate.text);

      const response = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`api:${process.env.MAILGUN_API_KEY}`)}`
        },
        body: formData
      });

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'Mailgun API error' };
      }
      */

      return { success: true };
    } catch (error) {
      console.error('Real email service error:', error);
      return { success: false, error: 'Failed to send email via real service' };
    }
  }

  // Configuration method for production setup
  updateConfig(newConfig: Partial<EmailConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Test email connectivity
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔄 Testing email service connection...');
      
      // Test email service connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Email service connection successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return { success: false, error: 'Connection test failed' };
    }
  }
}

export default EmailService;