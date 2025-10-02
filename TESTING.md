# Capital.com API Real Testing Guide

This guide explains how to set up and run real API tests against Capital.com's API endpoints.

## ⚠️ IMPORTANT SAFETY WARNINGS

1. **USE DEMO ENVIRONMENT**: Always start with the demo environment for testing
2. **PROTECT CREDENTIALS**: Never commit your real credentials to version control
3. **MONITOR ACCOUNT**: Watch your account during testing for unexpected changes
4. **START SMALL**: Begin with read-only operations before enabling trading functions
5. **BACKUP DATA**: Keep records of your account state before testing

## 🚀 Quick Setup

### Option 1: Interactive Setup (Recommended)

```bash
npm run setup-test
```

This interactive script will guide you through:
- Entering your Capital.com credentials
- Choosing demo vs live environment
- Configuring safety settings
- Setting up test parameters

### Option 2: Manual Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your credentials:
```bash
# Required credentials
CAPITAL_USERNAME=your-email@example.com
CAPITAL_PASSWORD=your-password
CAPITAL_API_KEY=your-api-key-here

# Use demo environment (recommended)
USE_DEMO_ENVIRONMENT=true
CAPITAL_API_BASE_URL=https://demo-api-capital.backend-capital.com
CAPITAL_WS_URL=wss://demo-api-capital.backend-capital.com/websockets

# Enable debug output
DEBUG_MODE=true

# Safety settings (keep disabled initially)
ENABLE_POSITION_CREATION=false
ENABLE_ORDER_CREATION=false
ENABLE_ACCOUNT_MODIFICATIONS=false
```

## 🧪 Running Tests

### Basic Real API Tests
```bash
npm run test:real
```

### Run Only Integration Tests
```bash
npm run test:integration
```

### Run with Verbose Output
```bash
npm run test:real -- --verbose
```

### Run Specific Test Suites
```bash
# Authentication tests only
npm run test:real -- --testNamePattern="Authentication"

# Market data tests only  
npm run test:real -- --testNamePattern="Market Data"

# Trading tests only
npm run test:real -- --testNamePattern="Trading"
```

## 📋 Test Categories

### 1. Authentication Flow ✅ SAFE
- ✅ Get server time
- ✅ Ping service
- ✅ Get encryption key
- ✅ Create session
- ✅ Get session details
- ✅ Logout

### 2. Account Management ✅ SAFE (Read-Only)
- ✅ Get all accounts
- ✅ Get account preferences
- ✅ Get activity history
- ✅ Get transaction history

### 3. Market Data ✅ SAFE (Read-Only)
- ✅ Get market navigation
- ✅ Search markets
- ✅ Get market details
- ✅ Get historical prices
- ✅ Get client sentiment

### 4. Trading Operations ✅ SAFE (Read-Only)
- ✅ Get all positions
- ✅ Get all working orders

### 5. Watchlist Management ⚠️ MODIFIES ACCOUNT
- ✅ Get all watchlists
- ⚠️ Create watchlist (if enabled)
- ⚠️ Delete watchlist (if enabled)

### 6. WebSocket Integration ✅ SAFE
- ✅ Connect to WebSocket
- ✅ Subscribe to market data
- ✅ Receive real-time quotes

### 7. Dangerous Operations ⚠️ DISABLED BY DEFAULT
- ❌ Create positions (real money at risk)
- ❌ Update positions (real money at risk)
- ❌ Close positions (real money at risk)
- ❌ Create working orders (real money at risk)
- ❌ Update working orders (real money at risk)
- ❌ Delete working orders (real money at risk)

## 🔧 Environment Variables Reference

### Authentication
```bash
CAPITAL_USERNAME=your-email@example.com
CAPITAL_PASSWORD=your-password
CAPITAL_API_KEY=your-api-key-here
```

**Important:** You need an API key to access Capital.com APIs. Get your API key from:
1. Log in to your Capital.com account
2. Go to Settings → API Access  
3. Generate a new API key
4. Copy the key and use it in your .env file

### Environment Selection
```bash
# Demo environment (recommended)
USE_DEMO_ENVIRONMENT=true
CAPITAL_API_BASE_URL=https://demo-api-capital.backend-capital.com
CAPITAL_WS_URL=wss://demo-api-capital.backend-capital.com/websockets

# Live environment (use with extreme caution)
USE_DEMO_ENVIRONMENT=false
CAPITAL_API_BASE_URL=https://api-capital.backend-capital.com
CAPITAL_WS_URL=wss://api-capital.backend-capital.com/websockets
```

### Safety Controls
```bash
# Enable debug logging
DEBUG_MODE=true

# Control dangerous operations (keep false for safety)
ENABLE_POSITION_CREATION=false
ENABLE_ORDER_CREATION=false
ENABLE_ACCOUNT_MODIFICATIONS=false

# Maximum position size for safety
MAX_POSITION_SIZE=0.1
```

### Test Data
```bash
# Market EPICs to test with
TEST_EPIC_GOLD=GOLD
TEST_EPIC_SILVER=SILVER
TEST_EPIC_EURUSD=EUR/USD
TEST_EPIC_BITCOIN=BITCOIN

# Test parameters
TEST_POSITION_SIZE=0.1
TEST_ORDER_SIZE=0.1
```

### Timeouts
```bash
API_TIMEOUT=30000
WEBSOCKET_TIMEOUT=10000
```

## 🔍 Test Output Examples

### Successful Authentication
```
✅ Session created successfully
📊 Account ID: ABC123456
📈 Available accounts: 2
```

### Market Data Retrieval
```
🔍 Found 15 markets for "GOLD"
  📊 GOLD: Gold Spot
  📊 GOLD_DEC: Gold December Future
  📊 GOLDEUR: Gold/EUR
```

### WebSocket Connection
```
🔌 WebSocket connected successfully
📡 Subscribed to market data for GOLD
📊 Received market quote: { epic: 'GOLD', bid: 1950.5, offer: 1951.0 }
```

## 🚨 Troubleshooting

### Common Issues

#### Authentication Failure
```
Error: Authentication failed
```
**Solutions:**
- Check username/password in .env
- Verify account is active
- Try demo environment first
- Check for two-factor authentication requirements

#### Network Timeouts
```
Error: Request timeout
```
**Solutions:**
- Increase `API_TIMEOUT` in .env
- Check internet connection
- Verify API URLs are correct
- Try again during market hours

#### Rate Limiting
```
Error: Too many requests
```
**Solutions:**
- Add delays between test runs
- Reduce `MAX_REQUESTS_PER_SECOND`
- Wait before retrying

#### WebSocket Connection Issues
```
Error: WebSocket connection failed
```
**Solutions:**
- Check session tokens are valid
- Verify WebSocket URL
- Ensure market is open
- Check firewall/proxy settings

### Debug Mode

Enable detailed logging:
```bash
DEBUG_MODE=true
LOG_API_CALLS=true
LOG_WEBSOCKET_MESSAGES=true
```

## 📊 Demo Account Setup

### Creating a Demo Account
1. Visit https://capital.com
2. Click "Start Trading" → "Try Demo"
3. Fill in registration details
4. Verify email address
5. Log in to get credentials
6. Use demo credentials in .env file

### Demo Account Benefits
- ✅ No real money at risk
- ✅ Full API functionality
- ✅ Real market data
- ✅ Safe for testing all features
- ✅ No financial consequences

## 🔐 Security Best Practices

### Credential Management
- ✅ Use demo accounts for testing
- ✅ Store credentials in .env (not committed)
- ✅ Use environment-specific accounts
- ✅ Rotate passwords regularly
- ❌ Never hardcode credentials
- ❌ Never commit .env to git

### Account Safety
- ✅ Start with read-only tests
- ✅ Use small position sizes
- ✅ Monitor account during tests
- ✅ Keep trading disabled initially
- ❌ Never test with large amounts
- ❌ Never leave positions open unintentionally

## 📈 Next Steps

1. **Start with Demo**: Set up demo account and credentials
2. **Run Safe Tests**: Execute authentication and market data tests
3. **Monitor Results**: Check test output and debug any issues
4. **Gradually Enable**: Slowly enable more features as needed
5. **Production Ready**: Move to live environment when confident

## 🆘 Support

If you encounter issues:

1. **Check Logs**: Review test output and error messages
2. **Verify Setup**: Ensure .env is configured correctly
3. **Test Basics**: Start with simple authentication tests
4. **Check Status**: Verify Capital.com API status
5. **Review Docs**: Consult Capital.com API documentation

## 📝 Notes

- Tests automatically skip if credentials not provided
- All dangerous operations are disabled by default
- WebSocket tests require successful authentication
- Some tests may fail outside market hours
- Rate limiting may cause test delays

Happy testing! 🚀