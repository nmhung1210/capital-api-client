// Test setup file
import 'jest';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress console logs during tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Mock WebSocket for tests
jest.mock('ws', () => {
  const mockWs = {
    on: jest.fn(),
    send: jest.fn(),
    close: jest.fn(),
    readyState: 1, // OPEN
    OPEN: 1,
    CLOSED: 3
  };
  
  return jest.fn(() => mockWs);
});

// Set default timeout for all tests
jest.setTimeout(10000);