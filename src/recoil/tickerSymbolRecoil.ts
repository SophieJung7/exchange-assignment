import { atom } from 'recoil';
import { TickerSymbol } from '../types/tickerSymbol';

export const TickerSymbolRecoil = atom<TickerSymbol>({
  key: 'tickerSymbolRecoil',
  default: TickerSymbol.BTCUSDT,
});
