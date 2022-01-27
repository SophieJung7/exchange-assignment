import { useCallback, useMemo } from 'react';
import useWebSocket from 'react-use-websocket';
import { TickerSocketResponse } from '../../types/ticker';
import { TickerSymbol } from '../../types/tickerSymbol';

const useOrderBookWebSocket = (symbol: TickerSymbol) => {
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    `wss://stream.binance.com:9443/ws/${symbol}@depth10`,
    {
      retryOnError: true,
      share: true,
      shouldReconnect: () => {
        return true;
      },
    }
  );

  const lastJsonMessage = useMemo(() => {
    let lastJsonMessage: TickerSocketResponse | undefined;
    try {
      if (lastMessage) {
        const data = JSON.parse(lastMessage.data);
        if (data) {
          lastJsonMessage = data;
        }
      }
    } catch (err) {
      lastJsonMessage = undefined;
    }
    return lastJsonMessage;
  }, [lastMessage]);

  const subscribe = useCallback(
    (ticketSymbol: TickerSymbol, tickerID: number) => {
      return sendJsonMessage({
        method: 'SUBSCRIBE',
        params: [`${ticketSymbol}@depth10`],
        id: tickerID,
      });
    },
    [sendJsonMessage]
  );

  const unsubscribe = useCallback(
    (ticketSymbol: TickerSymbol, tickerID: number) => {
      return sendJsonMessage({
        method: 'UNSUBSCRIBE',
        params: [`${ticketSymbol}@depth10`],
        id: tickerID,
      });
    },
    [sendJsonMessage]
  );

  return {
    subscribe,
    unsubscribe,
    readyState,
    lastJsonMessage,
  };
};

export default useOrderBookWebSocket;
