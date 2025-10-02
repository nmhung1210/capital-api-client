// Base types and enums
export type Direction = 'BUY' | 'SELL';
export type OrderType = 'LIMIT' | 'STOP';
export type DealStatus = 'ACCEPTED' | 'CREATED' | 'EXECUTED' | 'EXPIRED' | 'REJECTED' | 'MODIFIED' | 'MODIFY_REJECT' | 'CANCELLED' | 'CANCEL_REJECT' | 'UNKNOWN';
export type ActivitySource = 'CLOSE_OUT' | 'DEALER' | 'SL' | 'SYSTEM' | 'TP' | 'USER';
export type ActivityType = 'POSITION' | 'WORKING_ORDER' | 'EDIT_STOP_AND_LIMIT' | 'SWAP' | 'SYSTEM';
export type InstrumentType = 'SHARES' | 'CURRENCIES' | 'INDICES' | 'CRYPTOCURRENCIES' | 'COMMODITIES';
export type MarketStatus = 'TRADEABLE' | 'CLOSED' | 'EDITS_ONLY';
export type Resolution = 'MINUTE' | 'MINUTE_5' | 'MINUTE_15' | 'MINUTE_30' | 'HOUR' | 'HOUR_4' | 'DAY' | 'WEEK';
export type TransactionType = 'INACTIVITY_FEE' | 'RESERVE' | 'VOID' | 'UNRESERVE' | 'WRITE_OFF_OR_CREDIT' | 'CREDIT_FACILITY' | 'FX_COMMISSION' | 'COMPLAINT_SETTLEMENT' | 'DEPOSIT' | 'WITHDRAWAL' | 'REFUND' | 'WITHDRAWAL_MONEY_BACK' | 'TRADE' | 'SWAP' | 'TRADE_COMMISSION' | 'TRADE_COMMISSION_GSL' | 'NEGATIVE_BALANCE_PROTECTION' | 'TRADE_CORRECTION' | 'CHARGEBACK' | 'ADJUSTMENT' | 'BONUS' | 'TRANSFER' | 'CORPORATE_ACTION' | 'CONVERSION' | 'REBATE' | 'TRADE_SLIPPAGE_PROTECTION';

// Authentication and Session Types
export interface SessionCredentials {
  identifier: string;
  password: string;
  encryptedPassword?: boolean;
}

export interface ApiConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface EncryptionKeyResponse {
  encryptionKey: string;
  timeStamp: number;
}

export interface Balance {
  balance: number;
  deposit: number;
  profitLoss: number;
  available: number;
}

export interface Account {
  accountId: string;
  accountName: string;
  preferred: boolean;
  accountType: string;
  currency: string;
  symbol: string;
  balance: Balance;
}

export interface SessionResponse {
  accountType: string;
  accountInfo: Balance;
  currencyIsoCode: string;
  currencySymbol: string;
  currentAccountId: string;
  streamingHost: string;
  accounts: Account[];
  clientId: string;
  timezoneOffset: number;
  hasActiveDemoAccounts: boolean;
  hasActiveLiveAccounts: boolean;
  trailingStopsEnabled: boolean;
}

export interface SessionDetails {
  clientId: string;
  accountId: string;
  timezoneOffset: number;
  locale: string;
  currency: string;
  streamEndpoint: string;
}

export interface SwitchAccountRequest {
  accountId: string;
}

export interface SwitchAccountResponse {
  trailingStopsEnabled: boolean;
  dealingEnabled: boolean;
  hasActiveDemoAccounts: boolean;
  hasActiveLiveAccounts: boolean;
}

// Account Management Types
export interface AccountsResponse {
  accounts: Account[];
}

export interface Leverages {
  SHARES: number;
  CURRENCIES: number;
  INDICES: number;
  CRYPTOCURRENCIES: number;
  COMMODITIES: number;
}

export interface AccountPreferences {
  hedgingMode: boolean;
  leverages: Leverages;
}

export interface UpdateAccountPreferencesRequest {
  leverages?: Partial<Leverages>;
  hedgingMode?: boolean;
}

export interface Activity {
  epic: string;
  dealId: string;
  status: DealStatus;
  type: ActivityType;
  source: ActivitySource;
  date: string;
  dateUTC: string;
  description: string;
  details?: any;
}

export interface ActivityHistoryResponse {
  activities: Activity[];
}

export interface Transaction {
  reference: string;
  transactionType: TransactionType;
  transactionId: string;
  date: string;
  dateUTC: string;
  openLevel: string;
  closeLevel: string;
  size: string;
  currency: string;
  cash: string;
  pnl: string;
}

export interface TransactionHistoryResponse {
  transactions: Transaction[];
}

export interface TopUpRequest {
  amount: number;
}

export interface TopUpResponse {
  successful: boolean;
}

// Trading Types
export interface CreatePositionRequest {
  epic: string;
  direction: Direction;
  size: number;
  guaranteedStop?: boolean;
  trailingStop?: boolean;
  stopLevel?: number;
  stopDistance?: number;
  stopAmount?: number;
  profitLevel?: number;
  profitDistance?: number;
  profitAmount?: number;
}

export interface CreatePositionResponse {
  dealReference: string;
}

export interface UpdatePositionRequest {
  guaranteedStop?: boolean;
  trailingStop?: boolean;
  stopLevel?: number;
  stopDistance?: number;
  stopAmount?: number;
  profitLevel?: number;
  profitDistance?: number;
  profitAmount?: number;
}

export interface Position {
  contractSize: number;
  createdDate: string;
  createdDateUTC: string;
  dealId: string;
  dealReference: string;
  workingOrderId?: string;
  size: number;
  leverage: number;
  upl: number;
  direction: Direction;
  level: number;
  currency: string;
  guaranteedStop: boolean;
}

export interface Market {
  instrumentName: string;
  expiry: string;
  marketStatus: MarketStatus;
  epic: string;
  symbol: string;
  instrumentType: InstrumentType;
  lotSize: number;
  high: number;
  low: number;
  percentageChange: number;
  netChange: number;
  bid: number;
  offer: number;
  updateTime: string;
  updateTimeUTC: string;
  delayTime: number;
  streamingPricesAvailable: boolean;
  scalingFactor: number;
  marketModes: string[];
}

export interface PositionResponse {
  position: Position;
  market: Market;
}

export interface PositionsResponse {
  positions: PositionResponse[];
}

export interface CreateWorkingOrderRequest {
  epic: string;
  direction: Direction;
  size: number;
  level: number;
  type: OrderType;
  goodTillDate?: string;
  guaranteedStop?: boolean;
  trailingStop?: boolean;
  stopLevel?: number;
  stopDistance?: number;
  stopAmount?: number;
  profitLevel?: number;
  profitDistance?: number;
  profitAmount?: number;
}

export interface UpdateWorkingOrderRequest {
  level?: number;
  goodTillDate?: string;
  guaranteedStop?: boolean;
  trailingStop?: boolean;
  stopLevel?: number;
  stopDistance?: number;
  stopAmount?: number;
  profitLevel?: number;
  profitDistance?: number;
  profitAmount?: number;
}

export interface WorkingOrder {
  dealId: string;
  direction: Direction;
  epic: string;
  orderType: OrderType;
  orderSize: number;
  orderLevel: number;
  size?: number; // Keep for backwards compatibility
  level?: number; // Keep for backwards compatibility
  leverage?: number;
  timeInForce: string;
  goodTillDate?: string;
  guaranteedStop: boolean;
  trailingStop: boolean;
  currencyCode?: string;
  createdDate: string;
  createdDateUTC: string;
}

export interface WorkingOrderResponse {
  workingOrderData: WorkingOrder;
  marketData: Market;
}

export interface WorkingOrdersResponse {
  workingOrders: WorkingOrderResponse[];
}

export interface DealConfirmation {
  date: string;
  status: string;
  dealStatus: DealStatus;
  epic: string;
  dealReference: string;
  dealId: string;
  affectedDeals: any[];
  level: number;
  size: number;
  direction: Direction;
  guaranteedStop: boolean;
  trailingStop: boolean;
}

// Market Data Types
export interface NavigationNode {
  id: string;
  name: string;
}

export interface NavigationResponse {
  nodes: NavigationNode[];
}

export interface Instrument {
  epic: string;
  symbol: string;
  expiry: string;
  name: string;
  lotSize: number;
  type: InstrumentType;
  guaranteedStopAllowed: boolean;
  streamingPricesAvailable: boolean;
  currency: string;
  marginFactor: number;
  marginFactorUnit: string;
  openingHours: any;
  overnightFee: any;
}

export interface DealingRules {
  minStepDistance: any;
  minDealSize: any;
  maxDealSize: any;
  minSizeIncrement: any;
  minGuaranteedStopDistance: any;
  minStopOrProfitDistance: any;
  maxStopOrProfitDistance: any;
  marketOrderPreference: string;
  trailingStopsPreference: string;
}

export interface Snapshot {
  marketStatus: MarketStatus;
  netChange: number;
  percentageChange: number;
  updateTime: string;
  delayTime: number;
  bid: number;
  offer: number;
  high: number;
  low: number;
  decimalPlacesFactor: number;
  scalingFactor: number;
  marketModes: string[];
}

export interface MarketDetailsResponse {
  instrument: Instrument;
  dealingRules: DealingRules;
  snapshot: Snapshot;
}

export interface MarketsResponse {
  markets: Market[];
}

export interface PriceSnapshot {
  snapshotTime: string;
  snapshotTimeUTC: string;
  openPrice: any;
  closePrice: any;
  highPrice: any;
  lowPrice: any;
  lastTradedVolume: number;
}

export interface HistoricalPricesResponse {
  prices: PriceSnapshot[];
  instrumentType: InstrumentType;
}

export interface ClientSentiment {
  marketId: string;
  longPositionPercentage: number;
  shortPositionPercentage: number;
}

export interface ClientSentimentsResponse {
  clientSentiments: ClientSentiment[];
}

// Watchlist Types
export interface Watchlist {
  id: string;
  name: string;
  editable: boolean;
  deleteable: boolean;
}

export interface WatchlistsResponse {
  watchlists: Watchlist[];
}

export interface CreateWatchlistRequest {
  name: string;
  epics?: string[];
}

export interface CreateWatchlistResponse {
  watchlistId: string;
  status: string;
}

export interface WatchlistMarketsResponse {
  markets: Market[];
}

export interface AddMarketToWatchlistRequest {
  epic: string;
}

// WebSocket Types
export interface WebSocketMessage {
  destination: string;
  correlationId: string;
  cst: string;
  securityToken: string;
  payload?: any;
}

export interface MarketDataSubscription {
  epics: string[];
}

export interface OHLCSubscription {
  epics: string[];
  resolutions?: Resolution[];
  type?: 'classic' | 'heikin-ashi';
}

export interface QuoteData {
  epic: string;
  product: string;
  bid: number;
  bidQty: number;
  ofr: number;
  ofrQty: number;
  timestamp: number;
}

export interface OHLCData {
  resolution: Resolution;
  epic: string;
  type: string;
  priceType: string;
  t: number;
  h: number;
  l: number;
  o: number;
  c: number;
}

// Common Response Types
export interface ApiResponse<T = any> {
  data?: T;
  status?: string;
  error?: string;
}

export interface SuccessResponse {
  status: 'SUCCESS';
}

export interface ServerTimeResponse {
  serverTime: number;
}

export interface PingResponse {
  status: 'OK';
}

// Configuration Types
export interface CapitalAPIConfig {
  baseUrl?: string;
  demoMode?: boolean;
  apiKey?: string;
  timeout?: number;
}