import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  CrosshairMode,
} from 'lightweight-charts';
import { useRecoilValue, useRecoilState } from 'recoil';
import { TickerSymbolRecoil } from '../recoil/tickerSymbolRecoil';
import { TimeIntervalRecoil } from '../recoil/timeIntervalRecoil';
import useGetPriceHistory from '../hooks/useGetPriceHistory';
import useChartWebSocket from '../hooks/websocket/useChartWebSocket';
import { TimeInterval } from '../types/chart';

let chart: IChartApi | undefined = undefined;
let candleSeries: ISeriesApi<'Candlestick'> | undefined = undefined;

const Chart = () => {
  const symbol = useRecoilValue(TickerSymbolRecoil);
  const [timeInterval, setTimeInterval] = useRecoilState(TimeIntervalRecoil);
  const [chartContainerWidth, setChartContainerWidth] = useState<number>(700);
  const { priceHistory: history } = useGetPriceHistory(symbol, timeInterval);
  const chartContainerRef = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);
  const {
    subscribe: chartSubscribe,
    unsubscribe: chartUnsubscribe,
    lastJsonMessage: chartLastMessage,
  } = useChartWebSocket(symbol);

  useLayoutEffect(() => {
    if (chartContainerRef.current) {
      setChartContainerWidth(chartContainerRef?.current?.clientWidth);
    }
  }, []);

  useLayoutEffect(() => {
    function updateSize() {
      setChartContainerWidth(chartContainerRef?.current?.clientWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    chartSubscribe(symbol);
    return () => chartUnsubscribe(symbol);
  }, [chartSubscribe, chartUnsubscribe, symbol, timeInterval]);

  const fnCreateChart = useCallback(() => {
    const chart = createChart(
      document.getElementsByClassName('candle-chart')[0] as HTMLElement,
      {
        width: chartContainerWidth * 0.97,
        height: window.innerHeight * 0.8,
        layout: {
          textColor: '#d1d4dc',
          backgroundColor: '#000000',
        },
        rightPriceScale: {
          scaleMargins: {
            top: 0.3,
            bottom: 0.25,
          },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        grid: {
          vertLines: {
            color: 'rgba(42, 46, 57, 0)',
          },
          horzLines: {
            color: 'rgba(42, 46, 57, 0)',
          },
        },
        timeScale: {
          tickMarkFormatter: (time: UTCTimestamp) => {
            const date = new Date(time);
            if (timeInterval === '1w' || timeInterval === '1d') {
              return (
                date.getFullYear() +
                '/' +
                (date.getMonth() + 1) +
                '/' +
                date.getDate()
              );
            } else {
              return date.toTimeString().slice(0, 8);
            }
          },
        },
      }
    );
    return chart;
  }, [chartContainerWidth, timeInterval]);

  useEffect(() => {
    if (document && history) {
      document.getElementsByClassName('candle-chart')[0].innerHTML = '';
      chart = fnCreateChart();
      candleSeries = chart?.addCandlestickSeries({
        upColor: 'rgb(38,166,154)',
        downColor: 'rgb(255,82,82)',
        wickUpColor: 'rgb(38,166,154)',
        wickDownColor: 'rgb(255,82,82)',
        borderVisible: false,
      });
      candleSeriesRef.current = candleSeries;
      candleSeriesRef.current?.setData(history);
      chart?.timeScale().fitContent();

      if (chartLastMessage) {
        candleSeries?.update(chartLastMessage);
      }
    }
  }, [chartLastMessage, fnCreateChart, history]);

  return (
    <div className='text-gray-100 bg-black pl-3' ref={chartContainerRef}>
      <h1 className='ml-2 pt-3 text-xl'>Chart</h1>
      <>
        <div className='w-1/2 md:w-1/3 grid grid-cols-5 gap-4 ml-3 mt-5'>
          {timespanRange.map((v) => {
            return (
              <button
                key={v}
                onClick={() => setTimeInterval(v)}
                className='text-left'
              >
                {v}
              </button>
            );
          })}
        </div>
        <div className='candle-chart mt-5'></div>
      </>
    </div>
  );
};

const timespanRange: TimeInterval[] = ['1m', '5m', '1h', '1d', '1w'];

export default React.memo(Chart);
