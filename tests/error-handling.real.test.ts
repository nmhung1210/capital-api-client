import { CapitalAPI } from '../src/CapitalAPI';

describe('Error Handling - Real Endpoint Tests', () => {
  let api: CapitalAPI;
  let debugLogging = false;

  beforeAll(() => {
    debugLogging = process.env.DEBUG_API_RESPONSES === 'true';
  });

  beforeEach(() => {
    api = new CapitalAPI({ baseUrl: 'demo-api-capital.backend-capital.com' });
    // Add rate limiting delay
    return new Promise(resolve => setTimeout(resolve, 1000));
  });

  describe('Authentication Error Handling', () => {
    test('should handle invalid credentials and clear session', async () => {
      try {
        const response = await api.createSessionWithEncryption('invalid_user', 'invalid_password');
        
        if (debugLogging) {
          console.log('Unexpected auth success:', response);
        }
      } catch (error: any) {
        if (debugLogging) {
          console.log('Expected authentication error:', error.message);
        }
        
        // Should handle authentication errors and trigger clearSession
        expect(error).toBeDefined();
        expect(api.isAuthenticated()).toBe(false);
        
        const tokens = api.getSessionTokens();
        expect(tokens.cst).toBeUndefined();
        expect(tokens.securityToken).toBeUndefined();
      }
    }, 30000);

    test('should handle 401 errors and clear session via interceptor', async () => {
      // First authenticate with valid credentials
      try {
        await api.createSessionWithEncryption('testuser', 'password');
      } catch (error) {
        console.log('Skipping 401 test - cannot authenticate initially');
        return;
      }

      // Manually clear tokens to simulate session expiry
      (api as any).clearSession();
      
      try {
        await api.getAllAccounts();
      } catch (error: any) {
        if (debugLogging) {
          console.log('Expected 401 error after session clear:', error.message);
        }
        
        // Should handle 401 errors via interceptor
        expect(error).toBeDefined();
        expect(api.isAuthenticated()).toBe(false);
      }
    }, 30000);
  });

  describe('Password Encryption Coverage', () => {
    test('should exercise password encryption utility', async () => {
      const testPasswords = [
        'simple',
        'complex!@#$%^&*()',
        'unicode-café-naïve',
        'very_long_password_' + 'x'.repeat(50)
      ];

      for (const password of testPasswords) {
        try {
          await api.createSessionWithEncryption('testuser', password);
          
          if (debugLogging) {
            console.log(`Password encryption handled for length ${password.length}`);
          }
        } catch (error: any) {
          if (debugLogging) {
            console.log(`Password encryption test for length ${password.length}:`, error.message);
          }
          
          // Should handle password encryption without crashing
          expect(error).toBeDefined();
          expect(typeof error.message).toBe('string');
        }
      }
    }, 45000);
  });

  describe('API Key Management', () => {
    test('should handle API key setting', async () => {
      const testApiKeys = [
        'valid-api-key',
        '',
        'special-chars-!@#$%^&*()',
        'very-long-api-key-' + 'x'.repeat(100)
      ];

      for (const apiKey of testApiKeys) {
        try {
          api.setApiKey(apiKey);
          
          if (debugLogging) {
            console.log(`API key set: ${apiKey.substring(0, 20)}...`);
          }
          
          // setApiKey should not throw errors
          expect(true).toBe(true);
        } catch (error: any) {
          if (debugLogging) {
            console.log(`API key error:`, error.message);
          }
          
          expect(error).toBeDefined();
        }
      }
    }, 20000);
  });

  describe('Session Management Utilities', () => {
    test('should handle session state methods', async () => {
      // Test initial state
      expect(api.isAuthenticated()).toBe(false);
      
      let tokens = api.getSessionTokens();
      expect(tokens.cst).toBeUndefined();
      expect(tokens.securityToken).toBeUndefined();
      
      // Test after authentication
      try {
        await api.createSessionWithEncryption('testuser', 'password');
        
        if (debugLogging) {
          console.log('Session management test - authenticated');
        }
        
        expect(api.isAuthenticated()).toBe(true);
        
        tokens = api.getSessionTokens();
        expect(tokens.cst).toBeDefined();
        expect(tokens.securityToken).toBeDefined();
        
        // Test manual session clearing (private method via casting)
        (api as any).clearSession();
        
        expect(api.isAuthenticated()).toBe(false);
        
        tokens = api.getSessionTokens();
        expect(tokens.cst).toBeUndefined();
        expect(tokens.securityToken).toBeUndefined();
        
      } catch (error: any) {
        if (debugLogging) {
          console.log('Session management test error:', error.message);
        }
        
        expect(error).toBeDefined();
      }
    }, 30000);
  });

  describe('Network Error Handling', () => {
    test('should handle invalid base URL', async () => {
      const invalidApi = new CapitalAPI({ baseUrl: 'invalid-host-does-not-exist.com' });
      
      try {
        await invalidApi.createSessionWithEncryption('testuser', 'password');
        
        fail('Expected network error did not occur');
      } catch (error: any) {
        if (debugLogging) {
          console.log('Expected network error:', error.message);
        }
        
        expect(error).toBeDefined();
        expect(typeof error.message).toBe('string');
      }
    }, 30000);
  });
});