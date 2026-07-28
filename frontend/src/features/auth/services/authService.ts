import { apiClient } from '../../../services/api';
import type { AuthToken, LoginCredentials, SignupCredentials, User } from '../../../types/auth';

export const authService = {
  /**
   * Log in using JSON credentials.
   */
  async login(credentials: LoginCredentials): Promise<AuthToken> {
    const response = await apiClient.post<AuthToken>('/auth/login-json', credentials);
    return response.data;
  },

  /**
   * Register a new user account.
   */
  async signup(credentials: SignupCredentials): Promise<User> {
    const response = await apiClient.post<User>('/auth/signup', credentials);
    return response.data;
  },

  /**
   * Fetch currently authenticated user's profile.
   * Used on application startup to verify stored JWT token.
   */
  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};
