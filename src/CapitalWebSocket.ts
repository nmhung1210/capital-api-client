import WebSocket from 'ws';
import { EventEmitter } from 'events';
import {
  WebSocketMessage,
  MarketDataSubscription,
  OHLCSubscription,
  QuoteData,
  OHLCData,
  Resolution
} from './types';

export interface CapitalWebSocketConfig {
  cst: string;
  securityToken: string;
  streamingUrl?: string;
}

export class CapitalWebSocket extends EventEmitter {
  private ws?: WebSocket;
  private cst: string;
  private securityToken: string;
  private streamingUrl: string;
  private correlationIdCounter = 0;
  private reconnectInterval = 5000;
  private maxReconnectAttempts = 5;
  private reconnectAttempts = 0;
  private isConnected = false;
  private subscriptions = new Map<string, any>();

  constructor(config: CapitalWebSocketConfig) {
    super();
    this.cst = config.cst;
    this.securityToken = config.securityToken;
    this.streamingUrl = config.streamingUrl || 'wss://api-streaming-capital.backend-capital.com/connect';
  }

  private getNextCorrelationId(): string {
    return (++this.correlationIdCounter).toString();
  }

  private createMessage(destination: string, payload?: any): WebSocketMessage {
    return {
      destination,
      correlationId: this.getNextCorrelationId(),
      cst: this.cst,
      securityToken: this.securityToken,
      payload
    };
  }

  private send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === 1) { // Use literal 1 instead of WebSocket.OPEN
      this.ws.send(JSON.stringify(message));
    } else {
      throw new Error('WebSocket is not connected');
    }
  }

  private onMessage(data: WebSocket.Data): void {
    try {
      const message = JSON.parse(data.toString());
      
      // Emit specific events based on destination
      switch (message.destination) {
        case 'quote':
          this.emit('quote', message.payload as QuoteData);
          break;
        case 'ohlc.event':
          this.emit('ohlc', message.payload as OHLCData);
          break;
        case 'ping':
          this.emit('pong', message);
          break;
        case 'marketData.subscribe':
        case 'marketData.unsubscribe':
        case 'OHLCMarketData.subscribe':
        case 'OHLCMarketData.unsubscribe':
          this.emit('subscription', message);
          break;
        default:
          this.emit('message', message);
      }
    } catch (error) {
      this.emit('error', new Error(`Failed to parse WebSocket message: ${error}`));
    }
  }

  private onError(error: Error): void {
    this.emit('error', error);
  }

  private onClose(): void {
    this.isConnected = false;
    this.emit('disconnect');
    
    // Attempt to reconnect
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      this.emit('error', new Error('Max reconnection attempts reached'));
    }
  }

  private onOpen(): void {
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.emit('connect');
    
    // Resubscribe to all previous subscriptions
    this.subscriptions.forEach((subscription, key) => {
      this.send(subscription);
    });
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        
        // Check if WebSocket constructor is available
        if (typeof WebSocket === 'undefined') {
          throw new Error('WebSocket is not available in this environment');
        }
        
        // Try connecting with headers
        const options = {
          headers: {
            'CST': this.cst,
            'X-SECURITY-TOKEN': this.securityToken,
            'User-Agent': 'Capital API Client'
          }
        };
        
        this.ws = new WebSocket(this.streamingUrl, options);
        
        // Set up event handlers immediately
        this.ws.on('open', () => {
          this.onOpen();
          resolve();
        });
        
        this.ws.on('message', (data) => {
          this.onMessage(data);
        });
        
        this.ws.on('error', (error) => {
          console.error('❌ WebSocket error:', error);
          this.onError(error);
          reject(error);
        });
        
        this.ws.on('close', (code, reason) => {
          this.onClose();
        });
        
        this.ws.on('unexpected-response', (request, response) => {
          reject(new Error(`WebSocket unexpected response: ${response.statusCode} ${response.statusMessage}`));
        });
        
        // Check if already open (happens with some WebSocket implementations)
        if (this.ws.readyState === 1) { // Use literal 1 instead of WebSocket.OPEN
          setTimeout(() => {
            this.onOpen();
            resolve();
          }, 0);
          return;
        }
        
        // Add connection timeout debugging and polling
        let pollCount = 0;
        const pollInterval = setInterval(() => {
          pollCount++;
          
          if (this.ws && this.ws.readyState === 1) { // Use literal 1 instead of constant
            clearInterval(pollInterval);
            this.onOpen();
            resolve();
          } else if (pollCount >= 20) { // 10 seconds
            clearInterval(pollInterval);
          }
        }, 500);
        
        // Also keep the timeout as backup
        setTimeout(() => {
          clearInterval(pollInterval);
          if (this.ws && this.ws.readyState === 0) { // CONNECTING = 0
          } else if (this.ws) {
            if (this.ws.readyState === 1) { // OPEN = 1
              this.onOpen();
              resolve();
            }
          }
        }, 10000);
        
      } catch (error) {
        console.error('💥 WebSocket connection setup error:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = undefined;
    }
    this.isConnected = false;
    this.subscriptions.clear();
  }

  isConnectedToServer(): boolean {
    return this.isConnected && this.ws?.readyState === 1; // Use literal 1 instead of WebSocket.OPEN
  }

  // Debug methods
  getWebSocketState(): number | undefined {
    return this.ws?.readyState;
  }

  getWebSocketUrl(): string | undefined {
    return this.ws?.url;
  }

  // Market data subscription methods
  subscribeToMarketData(epics: string[]): void {
    const subscription: MarketDataSubscription = { epics };
    const message = this.createMessage('marketData.subscribe', subscription);
    
    this.subscriptions.set(`marketData_${epics.join(',')}`, message);
    this.send(message);
  }

  unsubscribeFromMarketData(epics: string[]): void {
    const subscription: MarketDataSubscription = { epics };
    const message = this.createMessage('marketData.unsubscribe', subscription);
    
    this.subscriptions.delete(`marketData_${epics.join(',')}`);
    this.send(message);
  }

  // OHLC data subscription methods
  subscribeToOHLCData(
    epics: string[],
    resolutions?: Resolution[],
    type?: 'classic' | 'heikin-ashi'
  ): void {
    const subscription: OHLCSubscription = {
      epics,
      resolutions,
      type
    };
    const message = this.createMessage('OHLCMarketData.subscribe', subscription);
    
    const key = `ohlc_${epics.join(',')}_${resolutions?.join(',') || 'default'}_${type || 'classic'}`;
    this.subscriptions.set(key, message);
    this.send(message);
  }

  unsubscribeFromOHLCData(
    epics: string[],
    resolutions?: Resolution[],
    types?: ('classic' | 'heikin-ashi')[]
  ): void {
    const subscription: any = {
      epics,
      resolutions,
      types
    };
    const message = this.createMessage('OHLCMarketData.unsubscribe', subscription);
    
    const key = `ohlc_${epics.join(',')}_${resolutions?.join(',') || 'default'}_${types?.join(',') || 'classic'}`;
    this.subscriptions.delete(key);
    this.send(message);
  }

  // Ping to keep connection alive
  ping(): void {
    const message = this.createMessage('ping');
    this.send(message);
  }

  // Start auto-ping to keep connection alive (ping every 9 minutes)
  startAutoPing(interval: number = 540000): void {
    setInterval(() => {
      if (this.isConnectedToServer()) {
        this.ping();
      }
    }, interval);
  }

  // Update authentication tokens
  updateTokens(cst: string, securityToken: string): void {
    this.cst = cst;
    this.securityToken = securityToken;
  }
}