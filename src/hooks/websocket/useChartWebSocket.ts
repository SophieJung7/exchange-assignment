import { useCallback, useEffect, useMemo, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { TickerSymbol } from '../../types/tickerSymbol';
import { ChartPrice } from '../../types/chart';

const useChartWebSocket = (symbol: TickerSymbol) => {
  const [webSocketID, setWebSocketID] = useState<number>();

  useEffect(() => {
    setWebSocketID(Math.floor(Math.random() * 1000000));
  }, []);

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    `wss://stream.binance.com:9443/ws/${symbol}@kline_1m`,
    {
      retryOnError: true,
      share: true,
      shouldReconnect: () => {
        return true;
      },
    }
  );

  const lastJsonMessage = useMemo(() => {
    let lastJsonMessage: ChartPrice | undefined;
    try {
      if (lastMessage) {
        const data = JSON.parse(lastMessage.data);
        if (data) {
          const filteredData: ChartPrice = {
            time: data.k.T,
            open: parseFloat(data.k.o),
            high: parseFloat(data.k.h),
            low: parseFloat(data.k.l),
            close: parseFloat(data.k.c),
          };
          lastJsonMessage = filteredData;
        }
      }
    } catch (err) {
      lastJsonMessage = undefined;
    }
    return lastJsonMessage;
  }, [lastMessage]);

  const subscribe = useCallback(
    (ticketSymbol: TickerSymbol) => {
      return sendJsonMessage({
        method: 'SUBSCRIBE',
        id: webSocketID,
        params: [`${ticketSymbol}@kline_1m`],
      });
    },
    [sendJsonMessage, webSocketID]
  );

  const unsubscribe = useCallback(
    (ticketSymbol: TickerSymbol) => {
      return sendJsonMessage({
        method: 'UNSUBSCRIBE',
        id: webSocketID,
        params: [`${ticketSymbol}@kline_1m`],
      });
    },
    [sendJsonMessage, webSocketID]
  );

  return {
    subscribe,
    unsubscribe,
    readyState,
    lastJsonMessage,
  };
};

export default useChartWebSocket;
