# Capital.com API Client

A comprehensive TypeScript client library for the Capital.com trading API, providing both REST API and WebSocket functionality with comprehensive real endpoint testing.

## Features

- **Complete API Coverage**: All Capital.com REST API endpoints
- **WebSocket Support**: Real-time market data streaming
- **TypeScript First**: Full type safety and IntelliSense support
- **Multiple Module Formats**: ES modules, CommonJS, and UMD bundles
- **Comprehensive Testing**: 96 tests with 65.97% coverage using real endpoints
- **Environment Configuration**: Flexible .env-based configuration system
- **Real Trading Tests**: BTC trading with actual position/order creation and cleanup
- **Safety Features**: Multiple protection layers for live trading
- **Professional Build**: Ready for npm deployment

## Installation

```bash
npm install capital-api-client
```

## Quick Start

### REST API Usage

```typescript
import { CapitalAPI } from 'capital-api-client';

const api = new CapitalAPI();

// Get server time
const serverTime = await api.getServerTime();
console.log('Server time:', serverTime);

// Create a session
const session = await api.createSession({
  identifier: 'your-email@example.com',
  password: 'your-password'
});

// Get market data
const markets = await api.getMarkets({ searchTerm: 'GOLD' });
console.log('Gold markets:', markets);

// Create a position
const position = await api.createPosition({
  epic: 'GOLD',
  direction: 'BUY',
  size: 1
});
```

### WebSocket Usage

```typescript
import { CapitalWebSocket } from 'capital-api-client';

const ws = new CapitalWebSocket({
  cst: 'your-cst-token',
  securityToken: 'your-security-token'
});

// Listen for market data
ws.on('quote', (data) => {
  console.log('Market quote:', data);
});

// Connect and subscribe
await ws.connect();
ws.subscribeToMarketData(['GOLD', 'SILVER']);
```

## Testing & Configuration

### Environment Setup

This library includes comprehensive real endpoint testing with environment-based configuration. Copy `.env.example` to `.env` and configure your settings:

```bash
cp .env.example .env
```

#### Key Environment Variables

```bash
# ===========================================
# AUTHENTICATION CREDENTIALS
# ===========================================
CAPITAL_USERNAME=your-email@example.com
CAPITAL_PASSWORD=your-password
CAPITAL_API_KEY=your-api-key-here

# ===========================================
# ENVIRONMENT SELECTION
# ===========================================
USE_DEMO_ENVIRONMENT=true  # Always use demo for testing
CAPITAL_DEMO_API_BASE_URL=https://demo-api-capital.backend-capital.com

# ===========================================
# SAFETY CONTROLS
# ===========================================
ENABLE_POSITION_CREATION=false  # Enable real position creation
ENABLE_ORDER_CREATION=false     # Enable real order creation
MAX_POSITION_SIZE=1.0            # Maximum position size safety limit

# ===========================================
# TEST CONFIGURATION
# ===========================================
TEST_POSITION_SIZE=0.01          # Position size for tests
TEST_EPIC_BITCOIN=BITCOIN        # BTC epic for trading tests
TEST_EPIC_GOLD=GOLD              # Gold epic for market tests
DEBUG_MODE=false                 # Enable detailed logging
```

### Running Tests

```bash
# Run all tests (96 tests with real endpoints)
npm test

# Run with coverage report (65.97% coverage)
npm run test:coverage

# Run specific test suites
npm test tests/btc-trading.real.test.ts          # BTC trading tests
npm test tests/integration.real.test.ts         # Full integration tests
npm test tests/trading-operations.real.test.ts  # Trading operations

# Watch mode for development
npm run test:watch
```

### Test Coverage Highlights

- **✅ 96 tests passing** across 11 test suites
- **✅ 65.97% code coverage** with real endpoint testing
- **✅ Real BTC trading** with minimum position sizes (0.01 BTC)
- **✅ Position & order management** with automatic cleanup
- **✅ WebSocket streaming** with real-time price data
- **✅ Complete API coverage** including authentication, markets, trading

### Safety Features

1. **Demo Environment Default**: All tests use demo environment by default
2. **Creation Gates**: Position/order creation must be explicitly enabled
3. **Size Limits**: `MAX_POSITION_SIZE` prevents accidental large trades  
4. **Environment Detection**: Clear warnings when using live environment
5. **Automatic Cleanup**: All test positions and orders are automatically closed
6. **Skip Logic**: Tests skip gracefully without credentials or safety flags

Example test output:
```
✅ Authentication successful for BTC trading tests
🔑 Using DEMO environment for trading
📊 Position size: 0.01 (max: 0.01)
🎯 Trading epic: BITCOIN
✅ BTC position created with deal reference: o_xxx
✅ Position closed with reference: p_xxx
🔍 Final cleanup verification:
    Remaining positions: 0
    Remaining orders: 0
```

## API Methods

### Authentication
- `getServerTime()` - Get server time
- `ping()` - Ping the service
- `getEncryptionKey()` - Get encryption key for password encryption
- `createSession(credentials)` - Create authenticated session
- `logout()` - Logout and destroy session
- `switchAccount(request)` - Switch to different account
- `getSessionDetails()` - Get current session details

### Account Management
- `getAllAccounts()` - Get all accounts
- `getAccountPreferences()` - Get account preferences
- `updateAccountPreferences(preferences)` - Update account preferences
- `getActivityHistory(filters)` - Get account activity history
- `getTransactionHistory(filters)` - Get transaction history
- `topUpDemoAccount(request)` - Top up demo account balance

### Trading
- `getDealConfirmation(dealReference)` - Get deal confirmation
- `getAllPositions()` - Get all open positions
- `createPosition(request)` - Create new position
- `getPosition(dealId)` - Get specific position
- `updatePosition(dealId, request)` - Update position
- `closePosition(dealId)` - Close position
- `getAllWorkingOrders()` - Get all working orders
- `createWorkingOrder(request)` - Create working order
- `updateWorkingOrder(dealId, request)` - Update working order
- `deleteWorkingOrder(dealId)` - Delete working order

### Market Data
- `getMarketNavigation()` - Get market navigation tree
- `getMarketNavigationNode(nodeId, limit)` - Get specific navigation node
- `getMarkets(filters)` - Search markets
- `getMarketDetails(epic)` - Get market details
- `getHistoricalPrices(epic, params)` - Get historical price data
- `getClientSentiment(marketIds)` - Get client sentiment
- `getClientSentimentForMarket(epic)` - Get sentiment for specific market

### Watchlists
- `getAllWatchlists()` - Get all watchlists
- `createWatchlist(request)` - Create new watchlist
- `getWatchlist(watchlistId)` - Get specific watchlist
- `deleteWatchlist(watchlistId)` - Delete watchlist
- `addMarketToWatchlist(watchlistId, request)` - Add market to watchlist
- `removeMarketFromWatchlist(watchlistId, epic)` - Remove market from watchlist

## WebSocket Events

- `quote` - Real-time market quotes
- `ohlc` - OHLC (candlestick) data
- `error` - Connection errors
- `connect` - Connection established
- `disconnect` - Connection closed

## TypeScript Support

This library is built with TypeScript and provides comprehensive type definitions:

```typescript
import { 
  CapitalAPI, 
  CapitalWebSocket,
  Direction,
  OrderType,
  Resolution,
  CreatePositionRequest,
  MarketDetailsResponse 
} from 'capital-api-client';

const position: CreatePositionRequest = {
  epic: 'GOLD',
  direction: 'BUY' as Direction,
  size: 1
};
```

## Configuration

### CapitalAPI Configuration

```typescript
const api = new CapitalAPI({
  baseUrl: 'https://api-capital.backend-capital.com', // Custom base URL
  timeout: 30000 // Request timeout in milliseconds
});
```

### CapitalWebSocket Configuration

```typescript
const ws = new CapitalWebSocket({
  cst: 'your-cst-token',
  securityToken: 'your-security-token'
});
```

## Error Handling

```typescript
try {
  const markets = await api.getMarkets({ searchTerm: 'INVALID' });
} catch (error) {
  if (error.response) {
    // API error response
    console.error('API Error:', error.response.status, error.response.data);
  } else {
    // Network or other error
    console.error('Network Error:', error.message);
  }
}
```

## Development

### Building

```bash
npm run build
```

### Testing

The library includes comprehensive testing with real Capital.com API endpoints:

```bash
# Run all tests (96 tests)
npm test

# Run with coverage (65.97% coverage)
npm run test:coverage

# Watch mode for development
npm run test:watch

# Run specific test categories
npm test tests/btc-trading.real.test.ts          # Real BTC trading tests
npm test tests/integration.real.test.ts         # Full API integration
npm test tests/trading-operations.real.test.ts  # Trading operations
npm test tests/websocket-edge-cases.real.test.ts # WebSocket edge cases
```

#### Test Categories

1. **Real BTC Trading Tests** (`btc-trading.real.test.ts`)
   - ✅ Real position creation and closure (0.01 BTC minimum)
   - ✅ Real working order creation and cancellation
   - ✅ WebSocket price monitoring
   - ✅ Complete cleanup verification

2. **Integration Tests** (`integration.real.test.ts`)
   - ✅ Full API workflow testing
   - ✅ Authentication and session management
   - ✅ Market data retrieval and search
   - ✅ Account information and preferences
   - ✅ WebSocket connection and streaming

3. **Trading Operations** (`trading-operations.real.test.ts`)
   - ✅ Position management operations
   - ✅ Working order operations
   - ✅ Account and market data access
   - ✅ Error handling scenarios

4. **WebSocket Edge Cases** (`websocket-edge-cases.real.test.ts`)
   - ✅ Connection lifecycle management
   - ✅ Subscription and unsubscription
   - ✅ Error handling and reconnection
   - ✅ Message processing

#### Test Safety

- **Demo Environment**: All tests run against demo environment by default
- **Position Creation**: Gated by `ENABLE_POSITION_CREATION=true`
- **Order Creation**: Gated by `ENABLE_ORDER_CREATION=true`
- **Size Limits**: Enforced via `MAX_POSITION_SIZE` and `TEST_POSITION_SIZE`
- **Automatic Cleanup**: All created positions/orders are automatically closed
- **Skip Logic**: Tests skip gracefully without proper credentials or flags

### Package Verification

```bash
npm run pack:test
```

## API Documentation

For detailed API documentation, refer to the official Capital.com API documentation:
https://open-api.capital.com

## License

ISC

## Changelog

### 1.1.0 (Latest)
- **Comprehensive Real Endpoint Testing**: 96 tests with 65.97% coverage using live Capital.com API
- **Real BTC Trading Tests**: Actual position creation, order management, and cleanup with minimum sizes
- **Environment Configuration**: Complete .env-based configuration system matching .env.example
- **Enhanced Safety Features**: Multiple protection layers for live trading
- **WebSocket Real-time Testing**: Live price streaming and subscription management
- **API Structure Fixes**: Updated types to match actual Capital.com API responses
- **Position/Order Cleanup**: Automatic cleanup ensuring no test artifacts remain
- **Flexible Test Configuration**: All test parameters configurable via environment variables

### 1.0.0
- Initial release
- Complete Capital.com REST API coverage
- WebSocket support for real-time data
- TypeScript support with full type definitions
- Multiple module format support (ES, CommonJS, UMD)
- Basic unit tests

## API Structure & Type Safety

This library provides accurate TypeScript types that match the actual Capital.com API responses:

### Position Response Structure
```typescript
interface PositionsResponse {
  positions: PositionResponse[];  // Array of position containers
}

interface PositionResponse {
  position: Position;  // Actual position data
  market: Market;     // Associated market data
}

// Usage example
const positions = await api.getAllPositions();
positions.positions.forEach(positionResponse => {
  const position = positionResponse.position;  // Access actual position
  const market = positionResponse.market;      // Access market data
  console.log(`${position.direction} ${position.size} ${market.instrumentName}`);
});
```

### Working Order Response Structure
```typescript
interface WorkingOrdersResponse {
  workingOrders: WorkingOrderResponse[];  // Array of order containers
}

interface WorkingOrderResponse {
  workingOrderData: WorkingOrder;  // Actual order data
  marketData: Market;             // Associated market data
}

// Usage example
const orders = await api.getAllWorkingOrders();
orders.workingOrders.forEach(orderResponse => {
  const order = orderResponse.workingOrderData;  // Access actual order
  const market = orderResponse.marketData;       // Access market data
  console.log(`${order.direction} ${order.orderSize} ${market.instrumentName} @ ${order.orderLevel}`);
});
```

### Enhanced Error Handling

```typescript
try {
  const position = await api.createPosition({
    epic: 'BTCUSD',
    direction: 'BUY',
    size: 0.01
  });
  
  // Position created successfully
  console.log('Position created:', position.dealReference);
  
  // Clean closure using correct dealId
  const allPositions = await api.getAllPositions();
  const createdPosition = allPositions.positions.find(p => 
    p.position.dealReference === position.dealReference
  );
  
  if (createdPosition) {
    await api.closePosition(createdPosition.position.dealId);
    console.log('Position closed successfully');
  }
  
} catch (error} catch (error) {
  console.error('Trading error:', error.message);
}
```

## Configuration Options

```typescript
interface CapitalAPIConfig {
  baseUrl?: string;        // Custom base URL (optional)
  apiKey?: string;         // Your API key from Capital.com
  timeout?: number;        // Request timeout in milliseconds (default: 30000)
}

// Example usage with environment variables
const api = new CapitalAPI({
  baseUrl: process.env.USE_DEMO_ENVIRONMENT === 'true' 
    ? process.env.CAPITAL_DEMO_API_BASE_URL 
    : process.env.CAPITAL_API_BASE_URL,
  apiKey: process.env.CAPITAL_API_KEY,
  timeout: parseInt(process.env.API_TIMEOUT || '30000')
});
```

### Environment-Aware Configuration

The library supports environment-based configuration for safe testing:

```typescript
// Automatically use demo environment when testing
const testConfig = {
  apiKey: process.env.CAPITAL_API_KEY,
  baseUrl: process.env.USE_DEMO_ENVIRONMENT === 'true' 
    ? process.env.CAPITAL_DEMO_API_BASE_URL 
    : process.env.CAPITAL_API_BASE_URL,
  enablePositionCreation: process.env.ENABLE_POSITION_CREATION === 'true',
  positionSize: parseFloat(process.env.TEST_POSITION_SIZE || '0.01'),
  maxPositionSize: parseFloat(process.env.MAX_POSITION_SIZE || '1.0')
};

// Safety check for live environment
if (process.env.USE_DEMO_ENVIRONMENT !== 'true') {
  console.warn('⚠️ WARNING: Using LIVE environment - real money at risk!');
}
```

## Authentication

### Basic Authentication

```typescript
// Create session with basic credentials
const session = await api.createSession({
  identifier: 'your-email@example.com',
  password: 'your-api-password',
  encryptedPassword: false // Default is false
});
```

### Encrypted Authentication

```typescript
// Create session with encrypted password
const session = await api.createSessionWithEncryption(
  'your-email@example.com',
  'your-api-password'
);
```

### Session Management

```typescript
// Get session details
const details = await api.getSessionDetails();

// Switch to different account
await api.switchAccount({ accountId: 'different-account-id' });

// Logout
await api.logout();
```

## Trading Operations

### Positions

```typescript
// Get all positions
const positions = await api.getAllPositions();

// Create a new position
const newPosition = await api.createPosition({
  epic: 'SILVER',
  direction: 'BUY',
  size: 1,
  guaranteedStop: false
});

// Get specific position
const position = await api.getPosition(dealId);

// Update position
await api.updatePosition(dealId, {
  stopLevel: 20,
  profitLevel: 30
});

// Close position
await api.closePosition(dealId);
```

### Working Orders

```typescript
// Get all working orders
const orders = await api.getAllWorkingOrders();

// Create limit order
const limitOrder = await api.createWorkingOrder({
  epic: 'GOLD',
  direction: 'BUY',
  size: 1,
  level: 1800,
  type: 'LIMIT'
});

// Update working order
await api.updateWorkingOrder(dealId, {
  level: 1850,
  goodTillDate: '2024-12-31T23:59:59'
});

// Delete working order
await api.deleteWorkingOrder(dealId);
```

## Market Data

### Market Information

```typescript
// Search for markets
const markets = await api.getMarkets({
  searchTerm: 'bitcoin'
});

// Get specific market details
const marketDetails = await api.getMarketDetails('BITCOIN');

// Get market navigation
const navigation = await api.getMarketNavigation();
```

### Historical Prices

```typescript
// Get historical prices
const prices = await api.getHistoricalPrices('SILVER', {
  resolution: 'HOUR',
  max: 100,
  from: '2024-01-01T00:00:00',
  to: '2024-01-02T00:00:00'
});
```

### Client Sentiment

```typescript
// Get client sentiment for markets
const sentiment = await api.getClientSentiment('SILVER,GOLD');

// Get sentiment for specific market
const silverSentiment = await api.getClientSentimentForMarket('SILVER');
```

## Account Management

### Account Information

```typescript
// Get all accounts
const accounts = await api.getAllAccounts();

// Get account preferences
const preferences = await api.getAccountPreferences();

// Update preferences
await api.updateAccountPreferences({
  hedgingMode: false,
  leverages: {
    CURRENCIES: 10,
    COMMODITIES: 5
  }
});
```

### Transaction History

```typescript
// Get activity history
const activity = await api.getActivityHistory({
  from: '2024-01-01T00:00:00',
  to: '2024-01-31T23:59:59',
  detailed: true
});

// Get transaction history
const transactions = await api.getTransactionHistory({
  lastPeriod: 86400, // Last 24 hours
  type: 'TRADE'
});
```

## Watchlists

```typescript
// Get all watchlists
const watchlists = await api.getAllWatchlists();

// Create new watchlist
const newWatchlist = await api.createWatchlist({
  name: 'My Commodities',
  epics: ['GOLD', 'SILVER', 'OIL_CRUDE']
});

// Add market to watchlist
await api.addMarketToWatchlist(watchlistId, {
  epic: 'BITCOIN'
});

// Remove market from watchlist
await api.removeMarketFromWatchlist(watchlistId, 'BITCOIN');

// Delete watchlist
await api.deleteWatchlist(watchlistId);
```

## WebSocket Streaming

### Basic WebSocket Usage

```typescript
// Create WebSocket connection
const ws = await api.connectWebSocket();

// Listen for quote updates
ws.on('quote', (quote) => {
  console.log('Quote update:', quote);
});

// Listen for OHLC updates
ws.on('ohlc', (ohlc) => {
  console.log('OHLC update:', ohlc);
});

// Listen for connection events
ws.on('connect', () => {
  console.log('WebSocket connected');
});

ws.on('disconnect', () => {
  console.log('WebSocket disconnected');
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});
```

### Market Data Subscriptions

```typescript
// Subscribe to market data
ws.subscribeToMarketData(['SILVER', 'GOLD']);

// Subscribe to OHLC data
ws.subscribeToOHLCData(['BITCOIN'], ['MINUTE_5', 'HOUR'], 'classic');

// Unsubscribe from market data
ws.unsubscribeFromMarketData(['SILVER']);

// Disconnect WebSocket
api.disconnectWebSocket();
```

## Error Handling

```typescript
try {
  const positions = await api.getAllPositions();
} catch (error) {
  if (error.response?.status === 401) {
    console.log('Authentication failed - need to login again');
  } else if (error.response?.status === 429) {
    console.log('Rate limit exceeded - wait before retrying');
  } else {
    console.error('API error:', error.message);
  }
}
```

## Rate Limits

The Capital.com API has the following rate limits:

- **General**: 10 requests per second per user
- **Position/Order Creation**: 1 request per 0.1 seconds per user
- **Session Creation**: 1 request per second per API key
- **WebSocket**: Maximum 40 instrument subscriptions

## Environment URLs

- **Live**: `https://api-capital.backend-capital.com`
- **Demo**: `https://demo-api-capital.backend-capital.com`
- **WebSocket Live**: `wss://api-streaming-capital.backend-capital.com/connect`

## Getting API Keys

1. Create a Capital.com trading account
2. Enable Two-Factor Authentication (2FA)
3. Go to Settings > API integrations > Generate new key
4. Set a custom password for the API key
5. Use the generated API key and custom password with this library

## TypeScript Support

This library is written in TypeScript and provides complete type definitions for all API responses and requests. Import types as needed:

```typescript
import { 
  CreatePositionRequest, 
  PositionResponse, 
  MarketDetailsResponse 
} from 'capital-api-client';
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Testing Requirements

When contributing, ensure your changes maintain the high testing standards:

- **Real Endpoint Testing**: All new features should include real API endpoint tests
- **Environment Configuration**: Use environment variables for configurable test parameters  
- **Safety First**: Include appropriate safety checks for live trading operations
- **Cleanup Required**: Ensure all test artifacts (positions/orders) are properly cleaned up
- **Coverage Maintenance**: Aim to maintain or improve the current 65.97% coverage

### Test Development Guidelines

1. **Use Environment Variables**: Configure test parameters via `.env` file
2. **Demo Environment Default**: Always default to demo environment for safety
3. **Explicit Creation Flags**: Gate real position/order creation behind environment flags
4. **Size Limits**: Respect `MAX_POSITION_SIZE` and use minimal `TEST_POSITION_SIZE`
5. **Proper Cleanup**: Always close positions and cancel orders in `afterAll` blocks
6. **Error Handling**: Include comprehensive error handling and graceful degradation

Example test structure:
```typescript
const testConfig = {
  enablePositionCreation: process.env.ENABLE_POSITION_CREATION === 'true',
  positionSize: Math.min(
    parseFloat(process.env.TEST_POSITION_SIZE || '0.01'),
    parseFloat(process.env.MAX_POSITION_SIZE || '1.0')
  ),
  // ... other config
};

// Always clean up after tests
afterAll(async () => {
  const positions = await api.getAllPositions();
  for (const pos of positions.positions) {
    await api.closePosition(pos.position.dealId);
  }
});
```

## Development

### Building the Project

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Clean build artifacts
npm run clean

# Development mode with auto-reload
npm run dev
```

### Publishing to NPM

1. **Test the build:**
   ```bash
   npm run test:build
   npm run pack:test
   ```

2. **Version bump:**
   ```bash
   # Patch version (1.0.0 -> 1.0.1)
   npm run version:patch
   
   # Minor version (1.0.0 -> 1.1.0)
   npm run version:minor
   
   # Major version (1.0.0 -> 2.0.0)
   npm run version:major
   ```

3. **Publish:**
   ```bash
   # Publish to npm
   npm run publish:npm
   
   # Publish as beta
   npm run publish:beta
   ```

### Build Outputs

The build process creates multiple bundle formats:
- `dist/index.cjs.js` - CommonJS module for Node.js
- `dist/index.esm.js` - ES Module for modern bundlers
- `dist/index.umd.js` - UMD bundle for browsers
- `dist/index.d.ts` - TypeScript type definitions

## License

ISC License

## Disclaimer

This library is not officially endorsed by Capital.com. Use at your own risk. Trading involves substantial risk of loss and is not suitable for all investors.

### Testing Disclaimer

This library includes comprehensive testing with real Capital.com API endpoints. While tests are designed to be safe (using demo environment and minimal position sizes), always:

- ✅ **Use Demo Environment**: Set `USE_DEMO_ENVIRONMENT=true` for testing
- ✅ **Review Configuration**: Check your `.env` file before running tests
- ✅ **Monitor Demo Account**: Verify test cleanup in your demo account
- ✅ **Never Test Live**: Do not set `USE_DEMO_ENVIRONMENT=false` unless you understand the risks

The automated test suite creates and closes real positions/orders in the demo environment to ensure API compatibility and reliability.