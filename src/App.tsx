import React, { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import './App.css';
import ChartHeader from './containers/ChartHeader';
import Chart from './containers/Chart';
import Orderbook from './containers/Orderbook';
import useTickerWebSocket from './hooks/websocket/useTickerWebSocket';
import useOrderBookWebSocket from './hooks/websocket/useOrderBookWebSocket';
import { TickerSymbolRecoil } from './recoil/tickerSymbolRecoil';
import { TickerSymbol } from './types/tickerSymbol';
import { currencyList } from './utils/constant';
import OrderForm from './containers/OrderForm';

function App() {
  const [tickerSymbol, setTickerSymbol] = useRecoilState(TickerSymbolRecoil);

  // Get Ticker
  const {
    subscribe: tickerSubscribe,
    unsubscribe: tickerUnsubscribe,
    lastJsonMessage: tickerLastMessage,
  } = useTickerWebSocket(tickerSymbol);

  const {
    subscribe: orderbookSubscribe,
    unsubscribe: orderbookUnsubscribe,
  }: any = useOrderBookWebSocket(tickerSymbol);

  const findTickerID = (symbol: TickerSymbol) => {
    return currencyList.find((obj) => obj.value === symbol)?.ID || 0;
  };

  useEffect(() => {
    tickerSubscribe(tickerSymbol, findTickerID(tickerSymbol));
    return () => tickerUnsubscribe(tickerSymbol, findTickerID(tickerSymbol));
  }, [tickerSymbol, tickerSubscribe, tickerUnsubscribe]);

  useEffect(() => {
    orderbookSubscribe(tickerSymbol, findTickerID(tickerSymbol));
    return () => orderbookUnsubscribe(tickerSymbol, findTickerID(tickerSymbol));
  }, [orderbookSubscribe, orderbookUnsubscribe, tickerSymbol]);

  const changeTicker = useCallback(
    (changedTickerSymbol: TickerSymbol) => {
      tickerUnsubscribe(tickerSymbol, findTickerID(tickerSymbol));
      tickerSubscribe(changedTickerSymbol, findTickerID(changedTickerSymbol));
      orderbookUnsubscribe(tickerSymbol, findTickerID(tickerSymbol));
      orderbookSubscribe(
        changedTickerSymbol,
        findTickerID(changedTickerSymbol)
      );
      setTickerSymbol(changedTickerSymbol);
    },
    [
      orderbookSubscribe,
      orderbookUnsubscribe,
      setTickerSymbol,
      tickerSubscribe,
      tickerSymbol,
      tickerUnsubscribe,
    ]
  );

  return (
    <>
      {tickerLastMessage && (
        <>
          <ChartHeader
            tickerLastMessage={tickerLastMessage}
            changeTicker={changeTicker}
          />
          <div className='grid grid-cols-10 gap-3 mt-5'>
            <div className='col-span-5 h-screen bg-black'>
              <Chart />
            </div>
            <div className='col-span-3 bg-black pr-3'>
              <Orderbook />
            </div>
            <div className='col-span-2 bg-black'>
              <OrderForm />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
