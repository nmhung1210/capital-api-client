# API Key Setup Guide

This guide explains how to get and configure your Capital.com API key for the API client.

## 🔐 Getting Your API Key

### Step 1: Log in to Capital.com
1. Go to [capital.com](https://capital.com)
2. Log in to your trading account

### Step 2: Navigate to API Settings
1. Go to your account settings
2. Look for "API Access" or "API Management" section
3. This is usually found under Settings → Security or Settings → API

### Step 3: Generate API Key
1. Click "Generate New API Key" or "Create API Key"
2. Choose appropriate permissions:
   - **Read Only**: For market data and account information (recommended for testing)
   - **Trading**: For placing orders and managing positions (use with caution)
3. Copy the generated API key immediately
4. **Important**: Save the key securely - you won't be able to see it again

### Step 4: Configure Environment
Add your API key to your `.env` file:
```bash
CAPITAL_API_KEY=your-api-key-here
```

## 🚨 API Key Security

### Do's ✅
- Store API keys in environment variables
- Use read-only keys for testing
- Regenerate keys periodically
- Use demo environment for development
- Keep keys private and secure

### Don'ts ❌
- Never commit API keys to version control
- Don't share keys in chat/email
- Don't use production keys for testing
- Don't hardcode keys in source code

## 🧪 API Key Permissions

### Read-Only Permissions
- ✅ Get account information
- ✅ Get market data
- ✅ Get position information
- ✅ Get order history
- ❌ Create/modify orders
- ❌ Open/close positions

### Trading Permissions
- ✅ All read-only permissions
- ✅ Create new positions
- ✅ Modify existing positions
- ✅ Create working orders
- ✅ Cancel orders
- ⚠️ **Risk**: Real money operations

## 🔧 Testing Your API Key

### Quick Test
```bash
# Run the basic example
npm run example
```

### Comprehensive Test
```bash
# Setup environment (includes API key prompt)
npm run setup-test

# Run full integration tests
npm run test:real
```

## 🚨 Troubleshooting

### Common API Key Issues

#### "Invalid API Key" Error
```
Error: 401 Unauthorized - Invalid API key
```
**Solutions:**
- Check if API key is correctly copied
- Verify key hasn't expired
- Ensure key has required permissions
- Try generating a new key

#### "API Key Not Found" Error
```
Error: API key not provided
```
**Solutions:**
- Check `.env` file has `CAPITAL_API_KEY=your-key`
- Verify `.env` file is in project root
- Ensure environment variables are loaded

#### "Permission Denied" Error
```
Error: 403 Forbidden - Insufficient permissions
```
**Solutions:**
- Check API key permissions in Capital.com settings
- Use a key with appropriate access level
- For trading operations, ensure trading permissions are enabled

#### "Rate Limit Exceeded" Error
```
Error: 429 Too Many Requests
```
**Solutions:**
- Reduce API call frequency
- Implement delays between requests
- Check if multiple applications are using the same key

## 🔄 API Key Rotation

### When to Rotate
- Monthly or quarterly (recommended)
- After team member changes
- If key might be compromised
- When changing permissions

### How to Rotate
1. Generate new API key in Capital.com settings
2. Update `.env` file with new key
3. Test with new key
4. Deactivate old key in Capital.com settings

## 📞 Getting Help

### Capital.com Support
- **Demo Account Issues**: Use demo support channels
- **API Key Problems**: Contact technical support
- **Account Access**: Use standard customer support

### Self-Service Options
- Check Capital.com API documentation
- Review account settings for API section
- Try generating a fresh API key
- Test with demo environment first

## 🎯 Best Practices

### Development
```bash
# Use demo environment
USE_DEMO_ENVIRONMENT=true
CAPITAL_API_KEY=demo-api-key

# Enable debug mode
DEBUG_MODE=true
```

### Production
```bash
# Use live environment (carefully!)
USE_DEMO_ENVIRONMENT=false
CAPITAL_API_KEY=live-api-key

# Disable debug in production
DEBUG_MODE=false
```

### CI/CD
- Store API keys as secure environment variables
- Use separate keys for different environments
- Never log API keys in build outputs
- Rotate keys regularly

Remember: Always start with demo environment and read-only permissions for testing! 🚀