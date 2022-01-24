import { useEffect, useState } from 'react';
import axios from 'axios';
import { TickerSymbol } from '../types/tickerSymbol';
import { OneDayStatResponse } from '../types/24hrStatResponse';

const useGet24hrStat = (symbol: TickerSymbol) => {
  const [avgPrice, setAvgPrice] = useState<string>();
  const [priceChange, setPriceChange] = useState<string>();

  useEffect(() => {
    let unmounted = false;
    async function get24hrStat() {
      if (!unmounted) {
        try {
          const { data }: { data: OneDayStatResponse } = await axios.get(
            `https://api.binance.com/api/v3/ticker/24hr`,
            {
              params: {
                symbol: symbol.toUpperCase(),
              },
            }
          );
          setAvgPrice(data.lastPrice);
          setPriceChange(data.priceChange);
        } catch (err) {
          console.error(err);
        }
      }
    }
    get24hrStat();
    return () => {
      unmounted = true;
    };
  }, [symbol]);

  return { avgPrice, priceChange };
};

export default useGet24hrStat;
