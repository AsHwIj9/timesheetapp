// Import testing utilities
const React = require('react');
const { render } = require('@testing-library/react');

// Set up localStorage mock
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
    removeItem: jest.fn()
  },
  writable: true
});

// Mock react-router-dom Navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  Navigate: (props) => {
    mockNavigate(props);
    return null;
  }
}));

// Mock useSelector from react-redux
const mockUseSelector = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: () => mockUseSelector()
}));

// Import the actual component (not mocked)
const ProtectedRoute = require('../ProtectedRoute');

describe('ProtectedRoute', () => {
  const mockChildren = React.createElement('div', { 
    'data-testid': 'protected-content' 
  }, 'Protected Content');
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    window.localStorage.getItem.mockClear();
    window.localStorage.setItem.mockClear();
    window.localStorage.clear.mockClear();
  });

  test('redirects to login when no user is authenticated', () => {
    // Setup for this test
    window.localStorage.getItem.mockReturnValue(null);
    mockUseSelector.mockReturnValue({ user: null });
    
    render(React.createElement(ProtectedRoute, {
      allowedRoles: ['admin']
    }, mockChildren));
    
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/login', replace: true });
  });

  test('shows unauthorized message when user role is not allowed', () => {
    window.localStorage.getItem.mockReturnValue(null);
    mockUseSelector.mockReturnValue({ user: { role: 'user' } });
    
    const { getByTestId } = render(React.createElement(ProtectedRoute, {
      allowedRoles: ['admin']
    }, mockChildren));
    
    expect(getByTestId('unauthorized-message')).toBeTruthy();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('renders children when user role is allowed', () => {
    window.localStorage.getItem.mockReturnValue(null);
    mockUseSelector.mockReturnValue({ user: { role: 'admin' } });
    
    const { getByTestId } = render(React.createElement(ProtectedRoute, {
      allowedRoles: ['admin']
    }, mockChildren));
    
    expect(getByTestId('protected-content')).toBeTruthy();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('falls back to localStorage user when Redux user is null', () => {
    window.localStorage.getItem.mockReturnValue(JSON.stringify({ role: 'admin' }));
    mockUseSelector.mockReturnValue({ user: null });
    
    const { getByTestId } = render(React.createElement(ProtectedRoute, {
      allowedRoles: ['admin']
    }, mockChildren));
    
    expect(getByTestId('protected-content')).toBeTruthy();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});