import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as crypto from 'crypto-js';
import { CapitalWebSocket, CapitalWebSocketConfig } from './CapitalWebSocket';
import { 
  CapitalAPIConfig,
  SessionCredentials,
  EncryptionKeyResponse,
  SessionResponse,
  SessionDetails,
  SwitchAccountRequest,
  SwitchAccountResponse,
  ServerTimeResponse,
  PingResponse,
  SuccessResponse,
  AccountsResponse,
  AccountPreferences,
  UpdateAccountPreferencesRequest,
  ActivityHistoryResponse,
  TransactionHistoryResponse,
  TopUpRequest,
  TopUpResponse,
  CreatePositionRequest,
  CreatePositionResponse,
  UpdatePositionRequest,
  PositionResponse,
  PositionsResponse,
  CreateWorkingOrderRequest,
  UpdateWorkingOrderRequest,
  WorkingOrdersResponse,
  DealConfirmation,
  NavigationResponse,
  MarketsResponse,
  MarketDetailsResponse,
  HistoricalPricesResponse,
  ClientSentimentsResponse,
  ClientSentiment,
  Resolution,
  WatchlistsResponse,
  CreateWatchlistRequest,
  CreateWatchlistResponse,
  WatchlistMarketsResponse,
  AddMarketToWatchlistRequest
} from './types';

export class CapitalAPI {
  private baseUrl: string;
  private client: AxiosInstance;
  private apiKey?: string;
  private cst?: string;
  private securityToken?: string;
  private webSocket?: CapitalWebSocket;

  constructor(config: CapitalAPIConfig = {}) {
    this.baseUrl = config.demoMode 
      ? 'https://demo-api-capital.backend-capital.com'
      : config.baseUrl || 'https://api-capital.backend-capital.com';
    
    this.apiKey = config.apiKey;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add request interceptor to include authentication headers
    this.client.interceptors.request.use((config) => {
      if (this.apiKey && !config.headers['X-CAP-API-KEY']) {
        config.headers['X-CAP-API-KEY'] = this.apiKey;
      }
      if (this.cst && !config.headers['CST']) {
        config.headers['CST'] = this.cst;
      }
      if (this.securityToken && !config.headers['X-SECURITY-TOKEN']) {
        config.headers['X-SECURITY-TOKEN'] = this.securityToken;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear authentication tokens on unauthorized
          this.clearSession();
        }
        return Promise.reject(error);
      }
    );
  }

  // Utility methods
  private clearSession(): void {
    this.cst = undefined;
    this.securityToken = undefined;
  }

  private setSessionTokens(cst: string, securityToken: string): void {
    this.cst = cst;
    this.securityToken = securityToken;
  }

  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  public isAuthenticated(): boolean {
    return !!this.cst && !!this.securityToken;
  }

  public getSessionTokens(): { cst?: string; securityToken?: string } {
    return {
      cst: this.cst,
      securityToken: this.securityToken
    };
  }

  // Encryption utility for password encryption
  private encryptPassword(encryptionKey: string, timestamp: number, password: string): string {
    const input = password + '|' + timestamp;
    const inputBase64 = crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(input));
    
    // Note: This is a simplified version. In a real implementation,
    // you would need to properly implement RSA encryption with the public key
    // For now, returning the base64 encoded input as placeholder
    return inputBase64;
  }

  // Basic HTTP methods
  private async get<T>(endpoint: string, params?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(endpoint, { params });
      // Jest may strip response properties, but response.data should be available
      if (response && response.data !== undefined) {
        return response.data;
      }
      throw new Error('No response data received');
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Authentication failed - check your credentials and API key');
      }
      throw error;
    }
  }

  private async post<T>(endpoint: string, data?: any, headers?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(endpoint, data, { headers });
    return response.data;
  }

  private async put<T>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(endpoint, data);
    return response.data;
  }

  private async delete<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(endpoint);
    return response.data;
  }

  // General endpoints
  async getServerTime(): Promise<ServerTimeResponse> {
    return this.get<ServerTimeResponse>('/api/v1/time');
  }

  async ping(): Promise<PingResponse> {
    return this.get<PingResponse>('/api/v1/ping');
  }

  // Session Management Methods
  async getEncryptionKey(): Promise<EncryptionKeyResponse> {
    if (!this.apiKey) {
      throw new Error('API key is required to get encryption key');
    }
    
    return this.get<EncryptionKeyResponse>('/api/v1/session/encryptionKey');
  }

  async createSession(credentials: SessionCredentials): Promise<SessionResponse> {
    if (!this.apiKey) {
      throw new Error('API key is required to create session');
    }

    try {
      // Create a temporary axios instance to avoid interceptor issues
      const tempClient = axios.create({
        baseURL: this.baseUrl,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const response = await tempClient.post<SessionResponse>(
        '/api/v1/session',
        credentials,
        {
          headers: {
            'X-CAP-API-KEY': this.apiKey
          }
        }
      );

      // Extract session tokens from response headers
      if (response && response.headers) {
        const cst = response.headers['cst'] || response.headers['CST'];
        const securityToken = response.headers['x-security-token'] || response.headers['X-SECURITY-TOKEN'];

        if (cst && securityToken) {
          this.setSessionTokens(cst, securityToken);
        }
      }

      if (response && response.data) {
        return response.data;
      }

      throw new Error('Invalid response received');
    } catch (error: any) {
      // More specific error handling
      if (error.response) {
        const status = error.response.status || 'unknown';
        const message = error.response.data?.errorCode || error.response.data?.message || 'Unknown error';
        throw new Error(`API Error (${status}): ${message}`);
      }
      throw error;
    }
  }

  async createSessionWithEncryption(
    identifier: string,
    password: string
  ): Promise<SessionResponse> {
    // Get encryption key first
    const encryptionData = await this.getEncryptionKey();
    
    // Encrypt password
    const encryptedPassword = this.encryptPassword(
      encryptionData.encryptionKey,
      encryptionData.timeStamp,
      password
    );

    // Create session with encrypted password
    return this.createSession({
      identifier,
      password: encryptedPassword,
      encryptedPassword: true
    });
  }

  async getSessionDetails(): Promise<SessionDetails> {
    return this.get<SessionDetails>('/api/v1/session');
  }

  async switchAccount(request: SwitchAccountRequest): Promise<SwitchAccountResponse> {
    return this.put<SwitchAccountResponse>('/api/v1/session', request);
  }

  async logout(): Promise<SuccessResponse> {
    const response = await this.delete<SuccessResponse>('/api/v1/session');
    this.clearSession();
    return response;
  }

  // Account Management Methods
  async getAllAccounts(): Promise<AccountsResponse> {
    return this.get<AccountsResponse>('/api/v1/accounts');
  }

  async getAccountPreferences(): Promise<AccountPreferences> {
    return this.get<AccountPreferences>('/api/v1/accounts/preferences');
  }

  async updateAccountPreferences(request: UpdateAccountPreferencesRequest): Promise<SuccessResponse> {
    return this.put<SuccessResponse>('/api/v1/accounts/preferences', request);
  }

  async getActivityHistory(params?: {
    from?: string;
    to?: string;
    lastPeriod?: number;
    detailed?: boolean;
    dealId?: string;
    filter?: string;
  }): Promise<ActivityHistoryResponse> {
    return this.get<ActivityHistoryResponse>('/api/v1/history/activity', params);
  }

  async getTransactionHistory(params?: {
    from?: string;
    to?: string;
    lastPeriod?: number;
    type?: string;
  }): Promise<TransactionHistoryResponse> {
    return this.get<TransactionHistoryResponse>('/api/v1/history/transactions', params);
  }

  async topUpDemoAccount(request: TopUpRequest): Promise<TopUpResponse> {
    return this.post<TopUpResponse>('/api/v1/accounts/topUp', request);
  }

  // Trading Methods
  async getDealConfirmation(dealReference: string): Promise<DealConfirmation> {
    return this.get<DealConfirmation>(`/api/v1/confirms/${dealReference}`);
  }

  // Position Methods
  async getAllPositions(): Promise<PositionsResponse> {
    return this.get<PositionsResponse>('/api/v1/positions');
  }

  async createPosition(request: CreatePositionRequest): Promise<CreatePositionResponse> {
    return this.post<CreatePositionResponse>('/api/v1/positions', request);
  }

  async getPosition(dealId: string): Promise<PositionResponse> {
    return this.get<PositionResponse>(`/api/v1/positions/${dealId}`);
  }

  async updatePosition(dealId: string, request: UpdatePositionRequest): Promise<CreatePositionResponse> {
    return this.put<CreatePositionResponse>(`/api/v1/positions/${dealId}`, request);
  }

  async closePosition(dealId: string): Promise<CreatePositionResponse> {
    return this.delete<CreatePositionResponse>(`/api/v1/positions/${dealId}`);
  }

  // Working Order Methods
  async getAllWorkingOrders(): Promise<WorkingOrdersResponse> {
    return this.get<WorkingOrdersResponse>('/api/v1/workingorders');
  }

  async createWorkingOrder(request: CreateWorkingOrderRequest): Promise<CreatePositionResponse> {
    return this.post<CreatePositionResponse>('/api/v1/workingorders', request);
  }

  async updateWorkingOrder(dealId: string, request: UpdateWorkingOrderRequest): Promise<CreatePositionResponse> {
    return this.put<CreatePositionResponse>(`/api/v1/workingorders/${dealId}`, request);
  }

  async deleteWorkingOrder(dealId: string): Promise<CreatePositionResponse> {
    return this.delete<CreatePositionResponse>(`/api/v1/workingorders/${dealId}`);
  }

  // Market Data Methods
  async getMarketNavigation(): Promise<NavigationResponse> {
    return this.get<NavigationResponse>('/api/v1/marketnavigation');
  }

  async getMarketNavigationNode(nodeId: string, limit?: number): Promise<NavigationResponse> {
    const params = limit ? { limit } : undefined;
    return this.get<NavigationResponse>(`/api/v1/marketnavigation/${nodeId}`, params);
  }

  async getMarkets(params?: {
    searchTerm?: string;
    epics?: string;
  }): Promise<MarketsResponse> {
    return this.get<MarketsResponse>('/api/v1/markets', params);
  }

  async getMarketDetails(epic: string): Promise<MarketDetailsResponse> {
    return this.get<MarketDetailsResponse>(`/api/v1/markets/${epic}`);
  }

  async getHistoricalPrices(epic: string, params?: {
    resolution?: Resolution;
    max?: number;
    from?: string;
    to?: string;
  }): Promise<HistoricalPricesResponse> {
    return this.get<HistoricalPricesResponse>(`/api/v1/prices/${epic}`, params);
  }

  async getClientSentiment(marketIds?: string): Promise<ClientSentimentsResponse> {
    const params = marketIds ? { marketIds } : undefined;
    return this.get<ClientSentimentsResponse>('/api/v1/clientsentiment', params);
  }

  async getClientSentimentForMarket(marketId: string): Promise<ClientSentiment> {
    return this.get<ClientSentiment>(`/api/v1/clientsentiment/${marketId}`);
  }

  // Watchlist Methods
  async getAllWatchlists(): Promise<WatchlistsResponse> {
    return this.get<WatchlistsResponse>('/api/v1/watchlists');
  }

  async createWatchlist(request: CreateWatchlistRequest): Promise<CreateWatchlistResponse> {
    return this.post<CreateWatchlistResponse>('/api/v1/watchlists', request);
  }

  async getWatchlist(watchlistId: string): Promise<WatchlistMarketsResponse> {
    return this.get<WatchlistMarketsResponse>(`/api/v1/watchlists/${watchlistId}`);
  }

  async addMarketToWatchlist(watchlistId: string, request: AddMarketToWatchlistRequest): Promise<SuccessResponse> {
    return this.put<SuccessResponse>(`/api/v1/watchlists/${watchlistId}`, request);
  }

  async deleteWatchlist(watchlistId: string): Promise<SuccessResponse> {
    return this.delete<SuccessResponse>(`/api/v1/watchlists/${watchlistId}`);
  }

  async removeMarketFromWatchlist(watchlistId: string, epic: string): Promise<SuccessResponse> {
    return this.delete<SuccessResponse>(`/api/v1/watchlists/${watchlistId}/${epic}`);
  }

  // WebSocket Methods
  createWebSocketConnection(config?: Partial<CapitalWebSocketConfig>): CapitalWebSocket {
    if (!this.cst || !this.securityToken) {
      throw new Error('Session tokens are required for WebSocket connection. Please authenticate first.');
    }

    const wsConfig: CapitalWebSocketConfig = {
      cst: this.cst,
      securityToken: this.securityToken,
      streamingUrl: config?.streamingUrl
    };

    this.webSocket = new CapitalWebSocket(wsConfig);
    return this.webSocket;
  }

  getWebSocketConnection(): CapitalWebSocket | undefined {
    return this.webSocket;
  }

  async connectWebSocket(): Promise<CapitalWebSocket> {
    if (!this.webSocket) {
      this.createWebSocketConnection();
    }
    
    if (this.webSocket) {
      await this.webSocket.connect();
      this.webSocket.startAutoPing();
      return this.webSocket;
    }
    
    throw new Error('Failed to create WebSocket connection');
  }

  disconnectWebSocket(): void {
    if (this.webSocket) {
      this.webSocket.disconnect();
      this.webSocket = undefined;
    }
  }
}