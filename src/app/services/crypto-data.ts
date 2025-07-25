import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PriceData {
  timestamp: Date;
  price: number;
  volume: number;
  change24h: number;
}

export interface CoinData {
  currentPrice: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  marketCap: number;
  priceHistory: PriceData[];
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CryptoDataService {
  private readonly STORAGE_KEY = 'goldProbotCoinData';
  private readonly PRICE_HISTORY_KEY = 'goldProbotCoinPriceHistory';

  private coinDataSubject = new BehaviorSubject<CoinData>(this.initializeCoinData());
  public coinData$ = this.coinDataSubject.asObservable();

  constructor() {
    this.loadStoredData();
    this.startPriceUpdates();
  }

  private initializeCoinData(): CoinData {
    const basePrice = 42.69; // Starting price in lbs of Pure Optimism
    return {
      currentPrice: basePrice,
      change24h: 0,
      change7d: 0,
      volume24h: this.generateRandomVolume(),
      marketCap: basePrice * 1000000, // Assume 1M coins in circulation
      priceHistory: [],
      lastUpdated: new Date()
    };
  }

  private loadStoredData(): void {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    const storedHistory = localStorage.getItem(this.PRICE_HISTORY_KEY);

    if (storedData && storedHistory) {
      try {
        const data: CoinData = JSON.parse(storedData);
        const history: PriceData[] = JSON.parse(storedHistory);

        // Convert string dates back to Date objects
        data.lastUpdated = new Date(data.lastUpdated);
        data.priceHistory = history.map(h => ({
          ...h,
          timestamp: new Date(h.timestamp)
        }));

        // Check if data is from today, if not generate new price
        const today = new Date().toDateString();
        const lastUpdateDay = data.lastUpdated.toDateString();

        if (today !== lastUpdateDay) {
          this.generateNewDayPrice(data);
        }

        this.coinDataSubject.next(data);
      } catch (error) {
        console.warn('Failed to parse stored crypto data, initializing new data');
      }
    } else {
      // Generate initial price history for the past 30 days
      this.generateInitialPriceHistory();
    }
  }

  private generateInitialPriceHistory(): void {
    const currentData = this.coinDataSubject.value;
    const history: PriceData[] = [];
    let currentPrice = 40; // Start a bit lower

    // Generate 30 days of historical data
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(12, 0, 0, 0); // Set to noon for consistency

      // Generate realistic price movement (random walk)
      const changePercent = (Math.random() - 0.5) * 0.15; // ±7.5% daily change
      currentPrice = Math.max(0.01, currentPrice * (1 + changePercent));

      history.push({
        timestamp: date,
        price: currentPrice,
        volume: this.generateRandomVolume(),
        change24h: changePercent * 100
      });
    }

    // Update current data with final price
    const latestPrice = history[history.length - 1];
    currentData.currentPrice = latestPrice.price;
    currentData.change24h = latestPrice.change24h;
    currentData.change7d = this.calculateWeeklyChange(history);
    currentData.priceHistory = history;
    currentData.marketCap = currentData.currentPrice * 1000000;
    currentData.lastUpdated = new Date();

    this.coinDataSubject.next(currentData);
    this.saveToStorage();
  }

  private generateNewDayPrice(data: CoinData): void {
    const lastPrice = data.currentPrice;
    const changePercent = (Math.random() - 0.5) * 0.15; // ±7.5% daily change
    const newPrice = Math.max(0.01, lastPrice * (1 + changePercent));

    const newPriceData: PriceData = {
      timestamp: new Date(),
      price: newPrice,
      volume: this.generateRandomVolume(),
      change24h: changePercent * 100
    };

    // Add to history and keep only last 30 days
    data.priceHistory.push(newPriceData);
    if (data.priceHistory.length > 30) {
      data.priceHistory = data.priceHistory.slice(-30);
    }

    data.currentPrice = newPrice;
    data.change24h = changePercent * 100;
    data.change7d = this.calculateWeeklyChange(data.priceHistory);
    data.volume24h = newPriceData.volume;
    data.marketCap = newPrice * 1000000;
    data.lastUpdated = new Date();
  }

  private calculateWeeklyChange(history: PriceData[]): number {
    if (history.length < 7) return 0;

    const weekAgo = history[history.length - 8] || history[0];
    const current = history[history.length - 1];

    return ((current.price - weekAgo.price) / weekAgo.price) * 100;
  }

  private generateRandomVolume(): number {
    // Generate volume between 50,000 and 500,000 lbs
    return Math.floor(Math.random() * 450000) + 50000;
  }

  private startPriceUpdates(): void {
    // Update price every 30 seconds with micro-fluctuations
    setInterval(() => {
      const currentData = this.coinDataSubject.value;
      const microChangePercent = (Math.random() - 0.5) * 0.02; // ±1% micro change
      const newPrice = Math.max(0.01, currentData.currentPrice * (1 + microChangePercent));

      currentData.currentPrice = newPrice;
      currentData.volume24h = this.generateRandomVolume();
      currentData.marketCap = newPrice * 1000000;
      currentData.lastUpdated = new Date();

      this.coinDataSubject.next({ ...currentData });
      this.saveToStorage();
    }, 30000); // 30 seconds
  }

  private saveToStorage(): void {
    const data = this.coinDataSubject.value;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(this.PRICE_HISTORY_KEY, JSON.stringify(data.priceHistory));
  }

  getCurrentData(): Observable<CoinData> {
    return this.coinData$;
  }

  refreshData(): void {
    const currentData = this.coinDataSubject.value;
    this.generateNewDayPrice(currentData);
    this.coinDataSubject.next({ ...currentData });
    this.saveToStorage();
  }
}
