import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CryptoDataService, CoinData, PriceData } from '../../services/crypto-data';

interface ActivityItem {
  timestamp: Date;
  price: number;
  change: number;
}

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tracker.html',
  styleUrl: './tracker.scss'
})
export class Tracker implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('priceChart') priceChartRef!: ElementRef<HTMLCanvasElement>;

  currentPrice: number = 0;
  change24h: number = 0;
  change7d: number = 0;
  volume24h: number = 0;
  marketCap: number = 0;
  lastUpdated: Date = new Date();
  allTimeHigh: number = 0;
  allTimeLow: number = Infinity;
  optimismRatio: number = 10.5;
  recentActivity: ActivityItem[] = [];

  private dataSubscription?: Subscription;
  private priceHistory: PriceData[] = [];
  private chart?: any;

  constructor(private cryptoDataService: CryptoDataService) {}

  ngOnInit(): void {
    this.dataSubscription = this.cryptoDataService.getCurrentData().subscribe((data: CoinData) => {
      this.updateData(data);
      this.updateRecentActivity(data);
      if (this.priceChartRef) {
        this.updateChart();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  private updateData(data: CoinData): void {
    this.currentPrice = data.currentPrice;
    this.change24h = data.change24h;
    this.change7d = data.change7d;
    this.volume24h = data.volume24h;
    this.marketCap = data.marketCap;
    this.lastUpdated = data.lastUpdated;
    this.priceHistory = data.priceHistory;

    // Calculate all-time high and low
    if (data.priceHistory.length > 0) {
      this.allTimeHigh = Math.max(...data.priceHistory.map(p => p.price), data.currentPrice);
      this.allTimeLow = Math.min(...data.priceHistory.map(p => p.price), data.currentPrice);
    }

    // Update optimism ratio (a fun metric)
    this.optimismRatio = 10.5 + (Math.random() - 0.5) * 2;
  }

  private updateRecentActivity(data: CoinData): void {
    if (data.priceHistory.length < 2) return;

    // Get last 5 price points for recent activity
    const recent = data.priceHistory.slice(-5).reverse();
    this.recentActivity = recent.map((item, index) => {
      const prevItem = recent[index + 1];
      let change = 0;

      if (prevItem) {
        change = ((item.price - prevItem.price) / prevItem.price) * 100;
      }

      return {
        timestamp: item.timestamp,
        price: item.price,
        change: change
      };
    });
  }

  private initializeChart(): void {
    if (!this.priceChartRef) return;

    const canvas = this.priceChartRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.updateChart();
  }

  private updateChart(): void {
    if (!this.priceChartRef || this.priceHistory.length === 0) return;

    const canvas = this.priceChartRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up canvas dimensions
    const padding = 60;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);

    // Get price range
    const prices = this.priceHistory.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Drawing functions
    const getX = (index: number) => padding + (index / (this.priceHistory.length - 1)) * chartWidth;
    const getY = (price: number) => padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight;

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 6; i++) {
      const x = padding + (i / 6) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
      ctx.stroke();
    }

    // Draw price line
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.beginPath();

    this.priceHistory.forEach((point, index) => {
      const x = getX(index);
      const y = getY(point.price);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw gradient fill
    ctx.save();
    const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0.05)');

    ctx.fillStyle = gradient;
    ctx.beginPath();

    this.priceHistory.forEach((point, index) => {
      const x = getX(index);
      const y = getY(point.price);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo(getX(this.priceHistory.length - 1), padding + chartHeight);
    ctx.lineTo(getX(0), padding + chartHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Draw price labels
    ctx.fillStyle = '#b0b0b0';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 5; i++) {
      const price = minPrice + (priceRange * (5 - i) / 5);
      const y = padding + (i / 5) * chartHeight;
      ctx.fillText(price.toFixed(2), padding - 10, y + 4);
    }

    // Draw time labels
    ctx.textAlign = 'center';
    const timeLabels = ['30d', '24d', '18d', '12d', '6d', 'Today'];
    timeLabels.forEach((label, index) => {
      const x = padding + (index / 5) * chartWidth;
      ctx.fillText(label, x, padding + chartHeight + 20);
    });
  }

  refreshData(): void {
    this.cryptoDataService.refreshData();
  }
}
