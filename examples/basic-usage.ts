/**
 * Basic usage example for Capital.com API client
 * 
 * This example shows how to:
 * 1. Initialize the API client with API key
 * 2. Create a session
 * 3. Get account information
 * 4. Get market data
 * 5. Properly handle errors
 */

import { CapitalAPI } from '../src/CapitalAPI.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function basicExample() {
  // Initialize the API client with your API key
  const api = new CapitalAPI({
    apiKey: process.env.CAPITAL_API_KEY!, // Required!
    baseUrl: process.env.CAPITAL_API_BASE_URL,
    demoMode: process.env.USE_DEMO_ENVIRONMENT === 'true',
    timeout: 30000
  });

  try {
    console.log('🚀 Capital.com API Basic Usage Example');
    console.log('======================================\n');

    // 1. Test server connection
    console.log('📡 Testing server connection...');
    const serverTime = await api.getServerTime();
    console.log(`✅ Server time: ${new Date()}`);

    // 2. Create session with credentials
    console.log('\n🔐 Creating session...');
    const session = await api.createSession({
      identifier: process.env.CAPITAL_USERNAME!,
      password: process.env.CAPITAL_PASSWORD!
    });
    console.log('✅ Session created successfully');
    console.log(`📊 Current Account ID: ${session.currentAccountId}`);

    // 3. Get session details
    console.log('\n📋 Getting session details...');
    const sessionDetails = await api.getSessionDetails();
    console.log('✅ Session details retrieved');
    console.log(`🆔 Account ID: ${sessionDetails.accountId}`);

    // 4. Get all accounts
    console.log('\n💰 Getting account information...');
    const accounts = await api.getAllAccounts();
    console.log('✅ Account information retrieved');
    console.log(`💼 Total accounts: ${accounts.accounts.length}`);
    
    accounts.accounts.forEach((account, index) => {
      console.log(`  ${index + 1}. ${account.accountName} (${account.currency})`);
      console.log(`     Balance: ${account.balance.balance} ${account.symbol}`);
      console.log(`     Available: ${account.balance.available} ${account.symbol}`);
    });

    // 5. Search for markets
    console.log('\n🔍 Searching for GOLD markets...');
    const markets = await api.getMarkets({ searchTerm: 'GOLD' });
    console.log('✅ Market search completed');
    console.log(`📊 Found ${markets.markets.length} markets for "GOLD"`);
    
    if (markets.markets.length > 0) {
      const goldMarket = markets.markets[0];
      console.log(`   📈 ${goldMarket.epic}: ${goldMarket.instrumentName}`);
      
      // 6. Get market details
      console.log(`\n📊 Getting details for ${goldMarket.epic}...`);
      const marketDetails = await api.getMarketDetails(goldMarket.epic);
      console.log('✅ Market details retrieved');
      console.log(`   💰 Current bid: ${marketDetails.snapshot.bid}`);
      console.log(`   💰 Current offer: ${marketDetails.snapshot.offer}`);
      console.log(`   📈 Market status: ${marketDetails.snapshot.marketStatus}`);
    }

    // 7. Get positions (if any)
    console.log('\n📋 Getting current positions...');
    const positions = await api.getAllPositions();
    console.log('✅ Positions retrieved');
    console.log(`📊 Open positions: ${positions.positions.length}`);

    if (positions.positions.length > 0) {
      positions.positions.forEach((position, index) => {
        console.log(`   ${index + 1}. Position #${index + 1}: ${position.size} units`);
      });
    } else {
      console.log('   📝 No open positions');
    }

    // 8. Logout
    console.log('\n👋 Logging out...');
    await api.logout();
    console.log('✅ Logout successful');

  } catch (error: any) {
    console.error('\n❌ Error occurred:', error.message);
    
    if (error.response) {
      console.error('📄 Response status:', error.response.status);
      console.error('📄 Response data:', error.response.data);
    }
    
    // Common error handling
    if (error.response?.status === 401) {
      console.error('\n🔐 Authentication failed. Check your credentials:');
      console.error('   - Verify CAPITAL_USERNAME is correct');
      console.error('   - Verify CAPITAL_PASSWORD is correct');
      console.error('   - Verify CAPITAL_API_KEY is correct and active');
      console.error('   - Check if using the right environment (demo vs live)');
    }
    
    if (error.response?.status === 403) {
      console.error('\n🚫 Access forbidden. Check your API key permissions.');
    }
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error('\n🌐 Network error. Check your internet connection and API URL.');
    }
  }
}

// Run the example
if (require.main === module) {
  // Check if required environment variables are set
  if (!process.env.CAPITAL_API_KEY) {
    console.error('❌ CAPITAL_API_KEY environment variable is required');
    console.error('Please set up your .env file with the API key');
    process.exit(1);
  }
  
  if (!process.env.CAPITAL_USERNAME || !process.env.CAPITAL_PASSWORD) {
    console.error('❌ CAPITAL_USERNAME and CAPITAL_PASSWORD environment variables are required');
    console.error('Please set up your .env file with your credentials');
    process.exit(1);
  }

  basicExample().catch(console.error);
}

export { basicExample };