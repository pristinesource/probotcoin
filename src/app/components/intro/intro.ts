import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CryptoDataService, CoinData } from '../../services/crypto-data';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './intro.html',
  styleUrl: './intro.scss'
})
export class Intro implements OnInit, OnDestroy {
  currentPrice: number = 0;
  change24h: number = 0;
  change7d: number = 0;
  volume24h: number = 0;
  marketCap: number = 0;

  private dataSubscription?: Subscription;

  constructor(private cryptoDataService: CryptoDataService) {}

  ngOnInit(): void {
    this.dataSubscription = this.cryptoDataService.getCurrentData().subscribe((data: CoinData) => {
      this.currentPrice = data.currentPrice;
      this.change24h = data.change24h;
      this.change7d = data.change7d;
      this.volume24h = data.volume24h;
      this.marketCap = data.marketCap;
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
