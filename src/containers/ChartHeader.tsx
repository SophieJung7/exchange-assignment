import React, { useMemo } from 'react';
import clsx from 'clsx';
import { useRecoilValue } from 'recoil';
import { TickerSymbolRecoil } from '../recoil/tickerSymbolRecoil';
import { AvgPriceRecoil } from '../recoil/avgPriceRecoil';
import Dropdown from './ChartDropDown';
import { TickerSocketResponse } from '../types/ticker';
import useGet24hrStat from '../hooks/useGet24hrStat';
import { AiFillCaretUp, AiFillCaretDown } from 'react-icons/ai';
import { TickerSymbol } from '../types/tickerSymbol';

interface Props {
  tickerLastMessage: TickerSocketResponse;
  changeTicker: (changedTickerSymbol: TickerSymbol) => void | undefined;
}

const ChartHeader = ({ tickerLastMessage, changeTicker }: Props) => {
  const symbol = useRecoilValue(TickerSymbolRecoil);
  const { p: price } = tickerLastMessage;
  const { avgPrice, priceChange } = useGet24hrStat(symbol);
  const timespanAvgPrice = useRecoilValue(AvgPriceRecoil);

  const isAvgPriceBull = useMemo(() => {
    return priceChange?.split('')[0] !== '-';
  }, [priceChange]);

  const isLatestPriceBull = useMemo(() => {
    if (price && avgPrice) {
      const priceChange = parseFloat(price) - parseFloat(avgPrice);
      return priceChange > 0;
    }
  }, [avgPrice, price]);

  return (
    <div className='flex flex-col md:flex-row w-screen text-gray-100 md:h-22 lg:h-12 border-b-2 border-gray-500 screen-header'>
      <div className='p-3 border-r-2 border-gray-500'>
        <h1 className='text-yellow-300 company-name'>Sophie Exchange</h1>
      </div>
      <div className='mr-2 w-full md:w-1/4 border-r-2 border-gray-500 pt-2'>
        <Dropdown changeTicker={changeTicker} />
      </div>
      <div className='p-1 mr-2 w-full sm:w-3/12 md:w-2/12 lg:border-r-2 border-gray-500'>
        <h2 className='text-xs text-gray-400'>24H Average Price</h2>
        <div className='flex flex-row'>
          <h1
            className={clsx(
              'avg-price mr-2',
              isAvgPriceBull ? 'text-blue-600' : 'text-red-600'
            )}
          >
            {avgPrice ? parseFloat(avgPrice).toFixed(2) : '-'}
          </h1>
          <div>
            {isAvgPriceBull ? (
              <AiFillCaretUp
                size={23}
                color='rgba(37, 99, 235, var(--tw-text-opacity))'
              />
            ) : (
              <AiFillCaretDown
                size={23}
                color='rgba(220, 38, 38, var(--tw-text-opacity))'
              />
            )}
          </div>
        </div>
      </div>
      <div className='p-1 mr-2 w-full sm:w-3/12 md:w-2/12 lg:border-r-2 border-gray-500'>
        <h2 className='text-xs text-gray-400'>Latest Price</h2>
        <div className='flex flex-row'>
          <h1
            className={clsx(
              'latest-price mr-2',
              isLatestPriceBull ? 'text-blue-600' : 'text-red-600'
            )}
          >
            {parseFloat(price).toFixed(2) || '-'}
          </h1>
          <div>
            {isLatestPriceBull ? (
              <AiFillCaretUp
                size={23}
                color='rgba(37, 99, 235, var(--tw-text-opacity))'
              />
            ) : (
              <AiFillCaretDown
                size={23}
                color='rgba(220, 38, 38, var(--tw-text-opacity))'
              />
            )}
          </div>
        </div>
      </div>
      <div className='p-1 mr-2 w-full sm:w-3/12 md:w-2/12 lg:border-r-2 border-gray-500 mb-10 md:mb-0'>
        <h2 className='text-xs text-gray-400'>Average Price</h2>
        <div className='flex flex-row'>
          <h1 className='timespan-avg-price mr-2'>
            {timespanAvgPrice?.toFixed(2) || '-'}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ChartHeader;
