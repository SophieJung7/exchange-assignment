# Simple Exchange Mock App

## Installation

```bash
yarn

yarn start
```

## E2E Test

```bash
yarn test
```

## API & Websocket

##### Binance API & WS

- Chart WS: wss://stream.binance.com:9443/ws/${symbol}@kline_1m
- Latest Price WS: wss://stream.binance.com:9443/ws/${symbol}@trade
- Orderbook WS: wss://stream.binance.com:9443/ws/btcusdt@depth10
- 24hr Stat for Ticker API: https://api.binance.com/api/v3/ticker/24hr
- Chart History API: https://api.binance.com/api/v3/klines

## Library

- Recoil.js: For state management
- Lightweight-charts: For making chart
- TailwindCSS: For CSS Library
- Jest, Puppeteer: For making E2E test

## Etc.

- Couldn't implement the orderform logic with time restraint
