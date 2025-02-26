import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from  '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import Login from '../../../components/auth/Login.jsx';
import { loginUser } from '../../../features/auth/authSlice.js';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

jest.mock('../../../features/auth/authSlice.js', () => ({
  loginUser: jest.fn()
}));

const mockStore = configureStore([thunk]);

describe('Login Component', () => {
  let store;
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore({
      auth: {
        isLoading: false
      }
    });
    
    
    require('react-router-dom').useNavigate.mockImplementation(() => navigate);
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders login form correctly', () => {
    renderComponent();
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Please sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('updates form values when user types', async () => {
    renderComponent();
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const roleSelect = screen.getByLabelText(/select role/i);

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.selectOptions(roleSelect, 'ADMIN');

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
    expect(roleSelect.value).toBe('ADMIN');
  });

  test('shows loading state when submitting the form', async () => {
    // Mock that auth slice is in loading state
    store = mockStore({
      auth: {
        isLoading: true
      }
    });

    renderComponent();
   
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton.textContent).toBe('Sign In');
    

    fireEvent.click(submitButton);
    

    store = mockStore({
      auth: {
        isLoading: true
      }
    });
    renderComponent();
    
    expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });

  test('navigates to user dashboard on successful login as USER', async () => {

    loginUser.mockImplementation(() => {
      return {
        type: 'auth/loginUser/fulfilled',
        payload: { role: 'USER' }
      };
    });
    

    loginUser.fulfilled = {
      match: action => action.type === 'auth/loginUser/fulfilled'
    };

    renderComponent();
    

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.selectOptions(screen.getByLabelText(/select role/i), 'USER');
    

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({ 
        username: 'testuser', 
        password: 'password123' 
      });
      expect(navigate).toHaveBeenCalledWith('/user/dashboard');
    });
  });

  test('navigates to admin dashboard on successful login as ADMIN', async () => {

    loginUser.mockImplementation(() => {
      return {
        type: 'auth/loginUser/fulfilled',
        payload: { role: 'ADMIN' }
      };
    });
    

    loginUser.fulfilled = {
      match: action => action.type === 'auth/loginUser/fulfilled'
    };

    renderComponent();
    

    await userEvent.type(screen.getByLabelText(/username/i), 'adminuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'admin123');
    await userEvent.selectOptions(screen.getByLabelText(/select role/i), 'ADMIN');
    

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({ 
        username: 'adminuser', 
        password: 'admin123' 
      });
      expect(navigate).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  test('shows error when server returns an error', async () => {

    loginUser.mockImplementation(() => {
      return {
        type: 'auth/loginUser/rejected',
        error: { message: 'Invalid credentials' }
      };
    });
    

    loginUser.fulfilled = {
      match: action => action.type === 'auth/loginUser/fulfilled'
    };

    renderComponent();
    

    await userEvent.type(screen.getByLabelText(/username/i), 'baduser');
    await userEvent.type(screen.getByLabelText(/password/i), 'badpass');
    

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials or server error/i)).toBeInTheDocument();
    });
  });

  test('shows error when selected role does not match user role', async () => {

    loginUser.mockImplementation(() => {
      return {
        type: 'auth/loginUser/fulfilled',
        payload: { role: 'USER' }  
      };
    });
    

    loginUser.fulfilled = {
      match: action => action.type === 'auth/loginUser/fulfilled'
    };

    renderComponent();
    

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.selectOptions(screen.getByLabelText(/select role/i), 'ADMIN');
    

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Incorrect role selected/i)).toBeInTheDocument();
      expect(navigate).not.toHaveBeenCalled();
    });
  });
});