import EmailService from './emailService';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  lastLogin: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

interface PasswordResetResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export class AuthService {
  private static instance: AuthService;
  private users: Map<string, User & { password: string }> = new Map();
  private currentUser: User | null = null;
  private passwordResetTokens: Map<string, { email: string; token: string; expires: number }> = new Map();
  private emailService: EmailService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  constructor() {
    this.emailService = EmailService.getInstance();
    this.loadUsersFromStorage();
    this.loadResetTokensFromStorage();
    // Clean up expired tokens on initialization
    this.cleanupExpiredTokens();
    
    // Set up periodic cleanup every 5 minutes
    setInterval(() => {
      this.cleanupExpiredTokens();
    }, 5 * 60 * 1000);
  }

  private loadUsersFromStorage(): void {
    try {
      const storedUsers = localStorage.getItem('akshata_users');
      if (storedUsers) {
        const usersData = JSON.parse(storedUsers);
        this.users = new Map(Object.entries(usersData));
      }
    } catch (error) {
      console.error('Error loading users from storage:', error);
    }
  }

  private saveUsersToStorage(): void {
    try {
      const usersData = Object.fromEntries(this.users);
      localStorage.setItem('akshata_users', JSON.stringify(usersData));
    } catch (error) {
      console.error('Error saving users to storage:', error);
    }
  }

  private loadResetTokensFromStorage(): void {
    try {
      const storedTokens = localStorage.getItem('akshata_reset_tokens');
      if (storedTokens) {
        const tokensData = JSON.parse(storedTokens);
        this.passwordResetTokens = new Map(Object.entries(tokensData));
      }
    } catch (error) {
      console.error('Error loading reset tokens from storage:', error);
    }
  }

  private saveResetTokensToStorage(): void {
    try {
      const tokensData = Object.fromEntries(this.passwordResetTokens);
      localStorage.setItem('akshata_reset_tokens', JSON.stringify(tokensData));
    } catch (error) {
      console.error('Error saving reset tokens to storage:', error);
    }
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePassword(password: string): boolean {
    return password.length >= 6;
  }

  private hashPassword(password: string): string {
    // Simple hash function for demo purposes
    // In production, use proper hashing like bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateResetToken(): string {
    // Generate a more secure token
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 15);
    const extraRandom = Math.random().toString(36).substr(2, 10);
    return `${timestamp}_${randomPart}_${extraRandom}`;
  }

  private extractNameFromEmail(email: string): string {
    const localPart = email.split('@')[0];
    return localPart
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ') || 'User';
  }

  private getRandomAvatar(): string {
    const avatars = [
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  async register(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Validate email format
    if (!this.validateEmail(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    // Validate password strength
    if (!this.validatePassword(password)) {
      return { success: false, error: 'Password must be at least 6 characters long' };
    }

    // Check if user already exists
    if (this.users.has(email)) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Create new user
    const userId = this.generateUserId();
    const hashedPassword = this.hashPassword(password);
    const now = new Date().toISOString();

    const newUser = {
      id: userId,
      email,
      password: hashedPassword,
      name: this.extractNameFromEmail(email),
      avatar: this.getRandomAvatar(),
      createdAt: now,
      lastLogin: now
    };

    // Save user
    this.users.set(email, newUser);
    this.saveUsersToStorage();

    // Set current user (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;
    this.currentUser = userWithoutPassword;

    return { success: true, user: userWithoutPassword };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Validate email format
    if (!this.validateEmail(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    // Check if user exists
    const user = this.users.get(email);
    if (!user) {
      // Auto-register new users for better UX
      return this.register(credentials);
    }

    // Verify password
    const hashedPassword = this.hashPassword(password);
    if (user.password !== hashedPassword) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    this.users.set(email, user);
    this.saveUsersToStorage();

    // Set current user (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    this.currentUser = userWithoutPassword;

    return { success: true, user: userWithoutPassword };
  }

  async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    try {
      console.log('🔄 Processing password reset request for:', email);

      // Validate email format
      if (!this.validateEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      // Check if user exists
      const user = this.users.get(email);
      if (!user) {
        // For security, don't reveal if email exists or not
        // But still return success to prevent email enumeration
        console.log('⚠️ Password reset requested for non-existent email:', email);
        return { 
          success: true, 
          message: 'If an account with this email exists, you will receive a password reset link.' 
        };
      }

      // Generate reset token
      const token = this.generateResetToken();
      const expires = Date.now() + (15 * 60 * 1000); // 15 minutes

      console.log('🔑 Generated reset token:', token);
      console.log('⏰ Token expires at:', new Date(expires).toLocaleString());

      // Store reset token
      this.passwordResetTokens.set(token, { email, token, expires });
      this.saveResetTokensToStorage();

      console.log('💾 Reset token stored successfully');

      // Send password reset email using EmailService
      console.log('📧 Sending password reset email...');
      
      const emailResult = await this.emailService.sendPasswordResetEmail(email, token);
      
      if (emailResult.success) {
        console.log('✅ Password reset email sent successfully');
        return { 
          success: true, 
          message: 'Password reset link has been sent to your email address. Please check your inbox and spam folder.' 
        };
      } else {
        console.error('❌ Failed to send password reset email:', emailResult.error);
        return { 
          success: false, 
          error: emailResult.error || 'Failed to send password reset email. Please try again.' 
        };
      }

    } catch (error) {
      console.error('❌ Password reset request error:', error);
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again or contact support.' 
      };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<PasswordResetResponse> {
    try {
      console.log('🔄 Processing password reset with token:', token);

      // Validate password
      if (!this.validatePassword(newPassword)) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      }

      // Check if token exists and is valid
      const resetData = this.passwordResetTokens.get(token);
      if (!resetData) {
        console.error('❌ Invalid reset token:', token);
        return { success: false, error: 'Invalid or expired reset token. Please request a new password reset.' };
      }

      console.log('🔍 Found reset data for token:', resetData);

      // Check if token has expired
      if (Date.now() > resetData.expires) {
        console.error('❌ Reset token has expired:', new Date(resetData.expires).toLocaleString());
        this.passwordResetTokens.delete(token);
        this.saveResetTokensToStorage();
        return { success: false, error: 'Reset token has expired. Please request a new password reset.' };
      }

      // Get user
      const user = this.users.get(resetData.email);
      if (!user) {
        console.error('❌ User not found for email:', resetData.email);
        return { success: false, error: 'User account not found. Please contact support.' };
      }

      console.log('👤 Found user for password reset:', resetData.email);

      // Update password
      const hashedPassword = this.hashPassword(newPassword);
      user.password = hashedPassword;
      user.lastLogin = new Date().toISOString();

      // Save updated user
      this.users.set(resetData.email, user);
      this.saveUsersToStorage();

      // Remove used token
      this.passwordResetTokens.delete(token);
      this.saveResetTokensToStorage();

      console.log('✅ Password reset successful for:', resetData.email);

      return { 
        success: true, 
        message: 'Password has been successfully reset. You can now sign in with your new password.' 
      };

    } catch (error) {
      console.error('❌ Password reset error:', error);
      return { 
        success: false, 
        error: 'An unexpected error occurred during password reset. Please try again.' 
      };
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    // Clear any session data if needed
    sessionStorage.removeItem('akshata_session');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // Get user statistics
  getUserStats(): { totalUsers: number; newUsersToday: number } {
    const today = new Date().toDateString();
    const newUsersToday = Array.from(this.users.values()).filter(
      user => new Date(user.createdAt).toDateString() === today
    ).length;

    return {
      totalUsers: this.users.size,
      newUsersToday
    };
  }

  // Clean up expired reset tokens
  private cleanupExpiredTokens(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [token, data] of this.passwordResetTokens.entries()) {
      if (now > data.expires) {
        this.passwordResetTokens.delete(token);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} expired reset tokens`);
      this.saveResetTokensToStorage();
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    const userEntry = Array.from(this.users.entries()).find(([_, user]) => user.id === userId);
    
    if (!userEntry) {
      return { success: false, error: 'User not found' };
    }

    const [email, user] = userEntry;
    
    // Update user data
    const updatedUser = {
      ...user,
      ...updates,
      id: userId, // Ensure ID doesn't change
      email: user.email // Ensure email doesn't change through this method
    };

    // Save updated user
    this.users.set(email, updatedUser);
    this.saveUsersToStorage();

    // Update current user if it's the same user
    if (this.currentUser && this.currentUser.id === userId) {
      const { password: _, ...userWithoutPassword } = updatedUser;
      this.currentUser = userWithoutPassword;
    }

    const { password: _, ...userWithoutPassword } = updatedUser;
    return { success: true, user: userWithoutPassword };
  }

  // Test email service
  async testEmailService(): Promise<{ success: boolean; error?: string }> {
    return await this.emailService.testConnection();
  }

  // Get reset token info (for debugging)
  getResetTokenInfo(token: string): { email: string; expires: number; isValid: boolean } | null {
    const resetData = this.passwordResetTokens.get(token);
    if (!resetData) return null;
    
    return { 
      email: resetData.email, 
      expires: resetData.expires,
      isValid: Date.now() <= resetData.expires
    };
  }

  // Get all active reset tokens (for debugging)
  getAllResetTokens(): Array<{ token: string; email: string; expires: number; isValid: boolean }> {
    const now = Date.now();
    return Array.from(this.passwordResetTokens.entries()).map(([token, data]) => ({
      token,
      email: data.email,
      expires: data.expires,
      isValid: now <= data.expires
    }));
  }

  // Validate reset token without using it
  isValidResetToken(token: string): boolean {
    const resetData = this.passwordResetTokens.get(token);
    return resetData ? Date.now() <= resetData.expires : false;
  }

  // Get stored email for development testing
  getStoredResetEmail(): any {
    return this.emailService.getStoredResetEmail();
  }
}

export default AuthService;