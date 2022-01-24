export type ChartPrice = {
  time: any;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type PriceHistory = ChartPrice[];

export type TimeInterval = '1m' | '5m' | '1h' | '1d' | '1w';
