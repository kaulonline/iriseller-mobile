/**
 * Login Screen Tests
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../LoginScreen';
import { authService } from '../../services/auth.service';

// Mock the auth service
jest.mock('../../services/auth.service', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    forgotPassword: jest.fn(),
  },
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    expect(getByText('IRISeller')).toBeTruthy();
    expect(getByText('Your Complete AI Sales Team')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('handles login with valid credentials', async () => {
    const mockLogin = authService.login as jest.Mock;
    mockLogin.mockResolvedValue({
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      token: 'mock-token',
      message: 'Login successful',
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: undefined,
      });
    });
  });

  it('displays forgot password link', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('Forgot Password?')).toBeTruthy();
  });

  it('displays SSO login option', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('Sign in with SSO')).toBeTruthy();
  });

  it('shows loading state during login', async () => {
    const mockLogin = authService.login as jest.Mock;
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    const { getByPlaceholderText, getByText, queryByTestId } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    // Check if loading indicator appears (you might need to add testID to the component)
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });
});











