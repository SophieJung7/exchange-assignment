import React, { useEffect, useState, useCallback } from 'react';
import { RecoilRoot, useRecoilState } from 'recoil';
import './App.css';
import ChartHeader from './containers/ChartHeader';
import useTickerWebSocket from './hooks/websocket/useTickerWebSocket';
import { TickerSymbol } from './types/tickerSymbol';
import { currencyList } from './utils/constant';
import { TickerSymbolRecoil } from './recoil/tickerSymbolRecoil';

function App() {
  const [tickerSymbol, setTickerSymbol] = useRecoilState(TickerSymbolRecoil);

  useEffect(() => {
    console.log(tickerSymbol);
  }, [tickerSymbol]);

  // Get Ticker
  const {
    subscribe: tickerSubscribe,
    unsubscribe: tickerUnsubscribe,
    lastJsonMessage: tickerLastMessage,
  } = useTickerWebSocket(tickerSymbol);

  const findTickerID = (symbol: TickerSymbol) => {
    return currencyList.find((obj) => obj.value === symbol)?.ID || 0;
  };

  useEffect(() => {
    tickerSubscribe(tickerSymbol, findTickerID(tickerSymbol));
    return () => tickerUnsubscribe(tickerSymbol, findTickerID(tickerSymbol));
  }, [tickerSymbol, tickerSubscribe, tickerUnsubscribe]);

  const changeTicker = useCallback(
    (changedTickerSymbol: TickerSymbol) => {
      tickerUnsubscribe(tickerSymbol, findTickerID(tickerSymbol));
      tickerSubscribe(changedTickerSymbol, findTickerID(changedTickerSymbol));
      setTickerSymbol(changedTickerSymbol);
    },
    [setTickerSymbol, tickerSubscribe, tickerSymbol, tickerUnsubscribe]
  );

  return (
    <>
      {tickerLastMessage && (
        <>
          <ChartHeader
            tickerLastMessage={tickerLastMessage}
            changeTicker={changeTicker}
          />
        </>
      )}
    </>
  );
}

export default App;
