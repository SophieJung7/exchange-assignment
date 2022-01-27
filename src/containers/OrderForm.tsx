import React, { useState, useCallback, useRef } from 'react';
import WidgetLayout from '../components/WidgetLayout';
import clsx from 'clsx';
import { useRecoilValue } from 'recoil';
import { TickerSymbolRecoil } from '../recoil/tickerSymbolRecoil';
import { currencyList } from '../utils/constant';

const OrderForm = () => {
  const ticker = useRecoilValue(TickerSymbolRecoil);
  const [isBuyPosition, setIsBuyPosition] = useState<boolean>(true);
  const [isSellPotision, setIsSellPosition] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [errMessage, setErrMessage] = useState<string | undefined>(undefined);

  const onQuantityChange = useCallback((e) => {
    if (!isNaN(parseInt(e.target.value))) {
      setQuantity(e.target.value);
    } else {
      if (!e.target.value) {
        setErrMessage(undefined);
      } else {
        setErrMessage('Please input number');
      }
    }
  }, []);

  const onOrderSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log(quantity);
    },
    [quantity]
  );

  return (
    <WidgetLayout widgetName='OrderForm' className='mr-3'>
      <>
        <div className='flex flex-row'>
          <button
            onClick={() => {
              setIsBuyPosition((state) => !state);
              setIsSellPosition((state) => !state);
            }}
            className={clsx(
              'w-1/2 text-teal-700 border-b-2 border-teal-500 p-3 text-lg font-bold',
              isBuyPosition && 'bg-teal-400'
            )}
          >
            Buy
          </button>
          <button
            onClick={() => {
              setIsBuyPosition((state) => !state);
              setIsSellPosition((state) => !state);
            }}
            className={clsx(
              'w-1/2 text-red-600 border-b-2 border-red-600 p-3 text-lg font-bold',
              isSellPotision && 'bg-red-400'
            )}
          >
            Sell
          </button>
        </div>
        <form onSubmit={onOrderSubmit} className='form-container mt-10 mx-3'>
          <div className='border-2 border-gray-400 bg-gray-500 text-center rounded py-3 text-gray-800 font-bold'>
            <h1>Market</h1>
          </div>
          <div className='mb-3 mt-5'>
            <label htmlFor='amount'>Amount</label>
            <div className='relative mt-3'>
              <input
                type='text'
                placeholder='0.0000'
                className='bg-transparent border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus: shadow-outline'
                id='amount'
                onChange={onQuantityChange}
              />
              <div className='absolute top-2 right-3'>
                {currencyList?.find(({ value }) => value === ticker)?.ticker}
              </div>
              {errMessage && (
                <div className='text-red-600 text-xs mt-2'>{errMessage}</div>
              )}
            </div>
            <div className='relative mt-3'>
              <div className='bg-transparent border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus: shadow-outline'>
                {quantity
                  ? (quantity * 36619.75)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : '0.00'}
              </div>
              <div className='absolute top-2 right-3'>
                {currencyList?.find(({ value }) => value === ticker)?.base}
              </div>
            </div>
          </div>
          <button
            className={clsx(
              'mt-10 text-center rounded py-3 font-bold w-full',
              isBuyPosition
                ? 'text-teal-600 bg-teal-400'
                : 'text-red-600 bg-red-400'
            )}
          >
            <h1>{isBuyPosition ? 'Buy' : 'Sell'}</h1>
          </button>
        </form>
      </>
    </WidgetLayout>
  );
};

export default React.memo(OrderForm);
