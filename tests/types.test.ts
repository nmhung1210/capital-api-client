import * as Types from '../src/types';

describe('Type Definitions', () => {
  describe('Enum Types', () => {
    it('should have Direction enum values', () => {
      const buyDirection: Types.Direction = 'BUY';
      const sellDirection: Types.Direction = 'SELL';
      
      expect(buyDirection).toBe('BUY');
      expect(sellDirection).toBe('SELL');
    });

    it('should have OrderType enum values', () => {
      const limitOrder: Types.OrderType = 'LIMIT';
      const stopOrder: Types.OrderType = 'STOP';
      
      expect(limitOrder).toBe('LIMIT');
      expect(stopOrder).toBe('STOP');
    });

    it('should have Resolution enum values', () => {
      const minute: Types.Resolution = 'MINUTE';
      const hour: Types.Resolution = 'HOUR';
      const day: Types.Resolution = 'DAY';
      
      expect(minute).toBe('MINUTE');
      expect(hour).toBe('HOUR');
      expect(day).toBe('DAY');
    });

    it('should have InstrumentType enum values', () => {
      const shares: Types.InstrumentType = 'SHARES';
      const commodities: Types.InstrumentType = 'COMMODITIES';
      const currencies: Types.InstrumentType = 'CURRENCIES';
      
      expect(shares).toBe('SHARES');
      expect(commodities).toBe('COMMODITIES');
      expect(currencies).toBe('CURRENCIES');
    });
  });

  describe('Interface Types', () => {
    it('should define SessionCredentials interface', () => {
      const credentials: Types.SessionCredentials = {
        identifier: 'test@example.com',
        password: 'password123',
        encryptedPassword: false
      };
      
      expect(credentials.identifier).toBe('test@example.com');
      expect(credentials.password).toBe('password123');
      expect(credentials.encryptedPassword).toBe(false);
    });

    it('should define CreatePositionRequest interface', () => {
      const positionRequest: Types.CreatePositionRequest = {
        epic: 'SILVER',
        direction: 'BUY',
        size: 1,
        guaranteedStop: false,
        stopLevel: 20,
        profitLevel: 30
      };
      
      expect(positionRequest.epic).toBe('SILVER');
      expect(positionRequest.direction).toBe('BUY');
      expect(positionRequest.size).toBe(1);
      expect(positionRequest.guaranteedStop).toBe(false);
      expect(positionRequest.stopLevel).toBe(20);
      expect(positionRequest.profitLevel).toBe(30);
    });

    it('should define CreateWorkingOrderRequest interface', () => {
      const orderRequest: Types.CreateWorkingOrderRequest = {
        epic: 'GOLD',
        direction: 'BUY',
        size: 1,
        level: 1800,
        type: 'LIMIT',
        goodTillDate: '2024-12-31T23:59:59'
      };
      
      expect(orderRequest.epic).toBe('GOLD');
      expect(orderRequest.direction).toBe('BUY');
      expect(orderRequest.size).toBe(1);
      expect(orderRequest.level).toBe(1800);
      expect(orderRequest.type).toBe('LIMIT');
      expect(orderRequest.goodTillDate).toBe('2024-12-31T23:59:59');
    });

    it('should define Account interface', () => {
      const account: Types.Account = {
        accountId: '123456789',
        accountName: 'USD Account',
        preferred: true,
        accountType: 'CFD',
        currency: 'USD',
        symbol: '$',
        balance: {
          balance: 1000,
          deposit: 500,
          profitLoss: 50,
          available: 950
        }
      };
      
      expect(account.accountId).toBe('123456789');
      expect(account.accountName).toBe('USD Account');
      expect(account.preferred).toBe(true);
      expect(account.balance.balance).toBe(1000);
      expect(account.balance.available).toBe(950);
    });

    it('should define Market interface', () => {
      const market: Types.Market = {
        instrumentName: 'Silver',
        expiry: '-',
        marketStatus: 'TRADEABLE',
        epic: 'SILVER',
        symbol: 'Silver',
        instrumentType: 'COMMODITIES',
        lotSize: 1,
        high: 25.5,
        low: 24.8,
        percentageChange: 2.5,
        netChange: 0.6,
        bid: 25.0,
        offer: 25.1,
        updateTime: '2024-01-01T12:00:00',
        updateTimeUTC: '2024-01-01T12:00:00',
        delayTime: 0,
        streamingPricesAvailable: true,
        scalingFactor: 1,
        marketModes: ['TRADEABLE']
      };
      
      expect(market.epic).toBe('SILVER');
      expect(market.instrumentType).toBe('COMMODITIES');
      expect(market.marketStatus).toBe('TRADEABLE');
      expect(market.bid).toBe(25.0);
      expect(market.offer).toBe(25.1);
    });

    it('should define WebSocketMessage interface', () => {
      const wsMessage: Types.WebSocketMessage = {
        destination: 'marketData.subscribe',
        correlationId: '123',
        cst: 'test-cst',
        securityToken: 'test-token',
        payload: {
          epics: ['SILVER', 'GOLD']
        }
      };
      
      expect(wsMessage.destination).toBe('marketData.subscribe');
      expect(wsMessage.correlationId).toBe('123');
      expect(wsMessage.cst).toBe('test-cst');
      expect(wsMessage.securityToken).toBe('test-token');
      expect(wsMessage.payload.epics).toEqual(['SILVER', 'GOLD']);
    });

    it('should define QuoteData interface', () => {
      const quote: Types.QuoteData = {
        epic: 'SILVER',
        product: 'CFD',
        bid: 25.0,
        bidQty: 1000,
        ofr: 25.1,
        ofrQty: 1000,
        timestamp: Date.now()
      };
      
      expect(quote.epic).toBe('SILVER');
      expect(quote.product).toBe('CFD');
      expect(quote.bid).toBe(25.0);
      expect(quote.ofr).toBe(25.1);
      expect(typeof quote.timestamp).toBe('number');
    });

    it('should define OHLCData interface', () => {
      const ohlc: Types.OHLCData = {
        resolution: 'MINUTE_5',
        epic: 'SILVER',
        type: 'classic',
        priceType: 'bid',
        t: Date.now(),
        h: 25.2,
        l: 24.8,
        o: 25.0,
        c: 25.1
      };
      
      expect(ohlc.resolution).toBe('MINUTE_5');
      expect(ohlc.epic).toBe('SILVER');
      expect(ohlc.type).toBe('classic');
      expect(ohlc.h).toBe(25.2);
      expect(ohlc.l).toBe(24.8);
      expect(ohlc.o).toBe(25.0);
      expect(ohlc.c).toBe(25.1);
    });

    it('should define CapitalAPIConfig interface', () => {
      const config: Types.CapitalAPIConfig = {
        baseUrl: 'https://api.example.com',
        demoMode: true,
        apiKey: 'test-key',
        timeout: 30000
      };
      
      expect(config.baseUrl).toBe('https://api.example.com');
      expect(config.demoMode).toBe(true);
      expect(config.apiKey).toBe('test-key');
      expect(config.timeout).toBe(30000);
    });

    it('should define optional properties correctly', () => {
      // Test with minimal required properties
      const minimalCredentials: Types.SessionCredentials = {
        identifier: 'test@example.com',
        password: 'password123'
      };
      
      expect(minimalCredentials.encryptedPassword).toBeUndefined();
      
      // Test with minimal position request
      const minimalPosition: Types.CreatePositionRequest = {
        epic: 'SILVER',
        direction: 'BUY',
        size: 1
      };
      
      expect(minimalPosition.guaranteedStop).toBeUndefined();
      expect(minimalPosition.stopLevel).toBeUndefined();
      expect(minimalPosition.profitLevel).toBeUndefined();
    });
  });

  describe('Union Types', () => {
    it('should accept valid Direction values', () => {
      const directions: Types.Direction[] = ['BUY', 'SELL'];
      
      directions.forEach(direction => {
        expect(['BUY', 'SELL']).toContain(direction);
      });
    });

    it('should accept valid Resolution values', () => {
      const resolutions: Types.Resolution[] = [
        'MINUTE', 'MINUTE_5', 'MINUTE_15', 'MINUTE_30',
        'HOUR', 'HOUR_4', 'DAY', 'WEEK'
      ];
      
      resolutions.forEach(resolution => {
        expect([
          'MINUTE', 'MINUTE_5', 'MINUTE_15', 'MINUTE_30',
          'HOUR', 'HOUR_4', 'DAY', 'WEEK'
        ]).toContain(resolution);
      });
    });

    it('should accept valid TransactionType values', () => {
      const transactionTypes: Types.TransactionType[] = [
        'DEPOSIT', 'WITHDRAWAL', 'TRADE', 'SWAP'
      ];
      
      transactionTypes.forEach(type => {
        expect(typeof type).toBe('string');
        expect(type.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Complex Type Compositions', () => {
    it('should handle nested interfaces correctly', () => {
      const sessionResponse: Types.SessionResponse = {
        accountType: 'CFD',
        accountInfo: {
          balance: 1000,
          deposit: 500,
          profitLoss: 50,
          available: 950
        },
        currencyIsoCode: 'USD',
        currencySymbol: '$',
        currentAccountId: '123456',
        streamingHost: 'wss://example.com',
        accounts: [
          {
            accountId: '123456',
            accountName: 'USD Account',
            preferred: true,
            accountType: 'CFD',
            currency: 'USD',
            symbol: '$',
            balance: {
              balance: 1000,
              deposit: 500,
              profitLoss: 50,
              available: 950
            }
          }
        ],
        clientId: '789',
        timezoneOffset: 0,
        hasActiveDemoAccounts: true,
        hasActiveLiveAccounts: false,
        trailingStopsEnabled: false
      };
      
      expect(sessionResponse.accountInfo.balance).toBe(1000);
      expect(sessionResponse.accounts).toHaveLength(1);
      expect(sessionResponse.accounts[0].balance.available).toBe(950);
    });

    it('should handle array types correctly', () => {
      const activitiesResponse: Types.ActivityHistoryResponse = {
        activities: [
          {
            epic: 'SILVER',
            dealId: '123',
            status: 'ACCEPTED',
            type: 'POSITION',
            source: 'USER',
            date: '2024-01-01T12:00:00',
            dateUTC: '2024-01-01T12:00:00',
            description: 'Position opened'
          }
        ]
      };
      
      expect(activitiesResponse.activities).toHaveLength(1);
      expect(activitiesResponse.activities[0].epic).toBe('SILVER');
      expect(activitiesResponse.activities[0].status).toBe('ACCEPTED');
    });
  });
});