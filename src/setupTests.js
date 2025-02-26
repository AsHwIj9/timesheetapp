import '@testing-library/jest-dom';
import React from 'react';

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  },
  writable: true
});

jest.mock('lucide-react', () => {
  const React = require('react'); // Import React within the mock scope
  return {
    Clock: () => React.createElement('div', null, 'Mock Clock Icon'),
    Briefcase: () => React.createElement('div', null, 'Mock Briefcase Icon'),
    Lock: () => React.createElement('div', null, 'Mock Lock Icon'),
    UserIcon: () => React.createElement('div', null, 'Mock User Icon'),
  };
});
