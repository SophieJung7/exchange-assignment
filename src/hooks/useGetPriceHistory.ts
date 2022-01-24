import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { AvgPriceRecoil } from '../recoil/avgPriceRecoil';
import { TickerSymbol } from '../types/tickerSymbol';
import { PriceHistoryResponse } from '../types/priceHistoryResponse';
import { PriceHistory, TimeInterval } from '../types/chart';

const useGetPriceHistory = (symbol: TickerSymbol, interval: TimeInterval) => {
  const [priceHistory, setPriceHistory] = useState<PriceHistory>();
  const [timespanAvgPrice, setTimespanAvgPrice] =
    useRecoilState(AvgPriceRecoil);

  useEffect(() => {
    let unmounted = false;
    async function getPrice() {
      if (!unmounted) {
        try {
          const { data }: { data: PriceHistoryResponse[] } = await axios.get(
            `https://api.binance.com/api/v3/klines`,
            {
              params: {
                symbol: symbol.toUpperCase(),
                interval,
                limit: 200,
              },
            }
          );
          const sortedData = data.map((a: PriceHistoryResponse) => {
            return {
              time: a[0],
              open: parseFloat(a[1]),
              high: parseFloat(a[2]),
              low: parseFloat(a[3]),
              close: parseFloat(a[4]),
            };
          });
          setPriceHistory(sortedData);
        } catch (err) {
          console.error(err);
        }
      }
    }
    getPrice();
    return () => {
      unmounted = true;
    };
  }, [interval, symbol]);

  useEffect(() => {
    if (priceHistory) {
      let sum = 0;
      for (let i = 0; i < priceHistory?.length; i += 1) {
        sum += priceHistory[i].close;
      }
      const avg = sum / priceHistory.length;
      setTimespanAvgPrice(avg);
    }
  }, [priceHistory, setTimespanAvgPrice]);

  return { priceHistory, timespanAvgPrice };
};

export default useGetPriceHistory;
