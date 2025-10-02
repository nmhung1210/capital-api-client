import { CapitalAPI, CapitalWebSocket } from '../src/index';

describe('Index Exports', () => {
  it('should export CapitalAPI class', () => {
    expect(CapitalAPI).toBeDefined();
    expect(typeof CapitalAPI).toBe('function');
    
    const api = new CapitalAPI();
    expect(api).toBeInstanceOf(CapitalAPI);
  });

  it('should export CapitalWebSocket class', () => {
    expect(CapitalWebSocket).toBeDefined();
    expect(typeof CapitalWebSocket).toBe('function');
    
    const ws = new CapitalWebSocket({
      cst: 'test-cst',
      securityToken: 'test-token'
    });
    expect(ws).toBeInstanceOf(CapitalWebSocket);
  });

  it('should have proper API methods available', () => {
    const api = new CapitalAPI();
    
    // Check essential methods exist
    expect(typeof api.getServerTime).toBe('function');
    expect(typeof api.createSession).toBe('function');
    expect(typeof api.getAllPositions).toBe('function');
    expect(typeof api.createPosition).toBe('function');
    expect(typeof api.getMarkets).toBe('function');
    expect(typeof api.getAllWatchlists).toBe('function');
    expect(typeof api.connectWebSocket).toBe('function');
  });

  it('should have proper WebSocket methods available', () => {
    const ws = new CapitalWebSocket({
      cst: 'test-cst',
      securityToken: 'test-token'
    });
    
    // Check essential methods exist
    expect(typeof ws.connect).toBe('function');
    expect(typeof ws.disconnect).toBe('function');
    expect(typeof ws.subscribeToMarketData).toBe('function');
    expect(typeof ws.subscribeToOHLCData).toBe('function');
    expect(typeof ws.ping).toBe('function');
    expect(typeof ws.updateTokens).toBe('function');
  });
});