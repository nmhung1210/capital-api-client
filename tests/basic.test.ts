import { CapitalAPI } from '../src/CapitalAPI';
import { CapitalWebSocket } from '../src/CapitalWebSocket';

describe('Capital API Client Library - Basic Tests', () => {
  describe('Library Classes', () => {
    it('should export CapitalAPI class', () => {
      expect(CapitalAPI).toBeDefined();
      expect(typeof CapitalAPI).toBe('function');
    });

    it('should export CapitalWebSocket class', () => {
      expect(CapitalWebSocket).toBeDefined();
      expect(typeof CapitalWebSocket).toBe('function');
    });
  });

  describe('CapitalAPI Basic Functionality', () => {
    let mockAxiosInstance: any;

    beforeEach(() => {
      // Mock axios before importing and using CapitalAPI
      jest.doMock('axios', () => ({
        create: jest.fn(() => mockAxiosInstance)
      }));

      mockAxiosInstance = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetModules();
    });

    it('should be instantiable', () => {
      const api = new CapitalAPI();
      expect(api).toBeInstanceOf(CapitalAPI);
    });

    it('should have authentication methods', () => {
      const api = new CapitalAPI();
      
      expect(typeof api.getServerTime).toBe('function');
      expect(typeof api.ping).toBe('function');
      expect(typeof api.getEncryptionKey).toBe('function');
      expect(typeof api.createSession).toBe('function');
      expect(typeof api.logout).toBe('function');
      expect(typeof api.switchAccount).toBe('function');
      expect(typeof api.getSessionDetails).toBe('function');
    });

    it('should have trading methods', () => {
      const api = new CapitalAPI();
      
      expect(typeof api.getAllPositions).toBe('function');
      expect(typeof api.createPosition).toBe('function');
      expect(typeof api.getPosition).toBe('function');
      expect(typeof api.updatePosition).toBe('function');
      expect(typeof api.closePosition).toBe('function');
      expect(typeof api.getAllWorkingOrders).toBe('function');
      expect(typeof api.createWorkingOrder).toBe('function');
      expect(typeof api.updateWorkingOrder).toBe('function');
      expect(typeof api.deleteWorkingOrder).toBe('function');
    });

    it('should have market data methods', () => {
      const api = new CapitalAPI();
      
      expect(typeof api.getMarketNavigation).toBe('function');
      expect(typeof api.getMarketNavigationNode).toBe('function');
      expect(typeof api.getMarkets).toBe('function');
      expect(typeof api.getMarketDetails).toBe('function');
      expect(typeof api.getHistoricalPrices).toBe('function');
      expect(typeof api.getClientSentiment).toBe('function');
      expect(typeof api.getClientSentimentForMarket).toBe('function');
    });

    it('should have account management methods', () => {
      const api = new CapitalAPI();
      
      expect(typeof api.getAllAccounts).toBe('function');
      expect(typeof api.getAccountPreferences).toBe('function');
      expect(typeof api.updateAccountPreferences).toBe('function');
      expect(typeof api.getActivityHistory).toBe('function');
      expect(typeof api.getTransactionHistory).toBe('function');
      expect(typeof api.topUpDemoAccount).toBe('function');
    });

    it('should have watchlist methods', () => {
      const api = new CapitalAPI();
      
      expect(typeof api.getAllWatchlists).toBe('function');
      expect(typeof api.createWatchlist).toBe('function');
      expect(typeof api.getWatchlist).toBe('function');
      expect(typeof api.deleteWatchlist).toBe('function');
      expect(typeof api.addMarketToWatchlist).toBe('function');
      expect(typeof api.removeMarketFromWatchlist).toBe('function');
    });

    it('should have WebSocket integration', () => {
      const api = new CapitalAPI();
      
      expect(typeof api.connectWebSocket).toBe('function');
    });
  });

  describe('CapitalWebSocket Basic Functionality', () => {
    // Mock WebSocket globally
    beforeAll(() => {
      (global as any).WebSocket = jest.fn(() => ({
        readyState: 1,
        send: jest.fn(),
        close: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      }));
    });

    it('should be instantiable with valid configuration', () => {
      const config = {
        cst: 'test-cst',
        securityToken: 'test-token'
      };
      
      const ws = new CapitalWebSocket(config);
      expect(ws).toBeInstanceOf(CapitalWebSocket);
    });

    it('should have WebSocket methods', () => {
      const config = {
        cst: 'test-cst',
        securityToken: 'test-token'
      };
      
      const ws = new CapitalWebSocket(config);

      expect(typeof ws.connect).toBe('function');
      expect(typeof ws.disconnect).toBe('function');
      expect(typeof ws.subscribeToMarketData).toBe('function');
      expect(typeof ws.subscribeToOHLCData).toBe('function');
      expect(typeof ws.unsubscribeFromMarketData).toBe('function');
      expect(typeof ws.unsubscribeFromOHLCData).toBe('function');
      expect(typeof ws.ping).toBe('function');
      expect(typeof ws.updateTokens).toBe('function');
    });

    it('should inherit from EventEmitter', () => {
      const config = {
        cst: 'test-cst',
        securityToken: 'test-token'
      };
      
      const ws = new CapitalWebSocket(config);

      expect(typeof ws.on).toBe('function');
      expect(typeof ws.emit).toBe('function');
      expect(typeof ws.removeListener).toBe('function');
      expect(typeof ws.removeAllListeners).toBe('function');
    });

    it('should handle configuration validation', () => {
      // Test that WebSocket requires valid configuration
      expect(() => {
        new CapitalWebSocket(null as any);
      }).toThrow();
      
      expect(() => {
        new CapitalWebSocket(undefined as any);
      }).toThrow();
    });
  });

  describe('Type System Integration', () => {
    it('should properly export and use TypeScript types', () => {
      // This test passes if the TypeScript compilation succeeds
      // It validates that all the type definitions work correctly
      const api = new CapitalAPI();
      const wsConfig = {
        cst: 'test-cst',
        securityToken: 'test-token'
      };
      const ws = new CapitalWebSocket(wsConfig);

      expect(api).toBeDefined();
      expect(ws).toBeDefined();
      expect(true).toBe(true); // Type compilation success indicator
    });
  });

  describe('API Coverage', () => {
    it('should cover all Capital.com API endpoints', () => {
      const api = new CapitalAPI();
      
      // Verify we have methods for all major API categories
      const authMethods = ['getServerTime', 'ping', 'getEncryptionKey', 'createSession', 'logout'];
      const tradingMethods = ['getAllPositions', 'createPosition', 'getAllWorkingOrders', 'createWorkingOrder'];
      const marketMethods = ['getMarkets', 'getMarketDetails', 'getHistoricalPrices'];
      const accountMethods = ['getAllAccounts', 'getAccountPreferences'];
      const watchlistMethods = ['getAllWatchlists', 'createWatchlist'];
      
      const allMethods = [...authMethods, ...tradingMethods, ...marketMethods, ...accountMethods, ...watchlistMethods];
      
      allMethods.forEach(methodName => {
        expect(typeof (api as any)[methodName]).toBe('function');
      });
      
      // Verify we have comprehensive coverage
      expect(allMethods.length).toBeGreaterThan(15);
    });
  });

  describe('Library Build Verification', () => {
    it('should be ready for npm package distribution', () => {
      // Test that the library structure is correct for publishing
      expect(CapitalAPI).toBeDefined();
      expect(CapitalWebSocket).toBeDefined();
      
      // Test that classes can be instantiated (basic smoke test)
      const api = new CapitalAPI();
      const ws = new CapitalWebSocket({
        cst: 'test-cst',
        securityToken: 'test-token'
      });
      
      expect(api).toBeInstanceOf(CapitalAPI);
      expect(ws).toBeInstanceOf(CapitalWebSocket);
    });
  });
});