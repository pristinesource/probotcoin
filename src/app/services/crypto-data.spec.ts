import { TestBed } from '@angular/core/testing';

import { CryptoData } from './crypto-data';

describe('CryptoData', () => {
  let service: CryptoData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
