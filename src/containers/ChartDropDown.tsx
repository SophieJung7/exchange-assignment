import React, { useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';
import { AiFillDownCircle } from 'react-icons/ai';
import { TickerSymbol } from '../types/tickerSymbol';
import { currencyList } from '../utils/constant';
import { TickerSymbolRecoil } from '../recoil/tickerSymbolRecoil';

interface Props {
  changeTicker: (changedTickerSymbol: TickerSymbol) => void | undefined;
}

const ChartDropDown = ({ changeTicker }: Props) => {
  const [dropDownToggle, setDropdownToggle] = useState(false);
  const [tickerSymbol, setTickerSymbol] = useRecoilState(TickerSymbolRecoil);

  const selectedSymbolName = useCallback(() => {
    const selectedCurrency = currencyList.find(
      (currency) => currency.value === tickerSymbol
    );
    return selectedCurrency?.name;
  }, [tickerSymbol]);

  return (
    <div className='relative pt-1'>
      <div className='flex flex-row items-center pl-2'>
        <button
          onClick={() => setDropdownToggle((state) => !state)}
          className='flex flex-row items-center'
        >
          <h1 className='mr-4'>{selectedSymbolName()}</h1>
          <div className='mr-3'>
            <div>
              <AiFillDownCircle size={24} />
            </div>
          </div>
        </button>
      </div>
      {dropDownToggle && (
        <div className='bg-black absolute w-full top-10 z-10'>
          {currencyList
            .filter((currency) => currency.value !== tickerSymbol)
            .map(({ value, name }: { value: TickerSymbol; name: string }) => {
              return (
                <div key={value} className='p-2 border-b-2 border-gray-500'>
                  <button
                    onClick={() => {
                      setTickerSymbol(value);
                      changeTicker(value);
                    }}
                    className='w-full text-left'
                  >
                    {name}
                  </button>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default ChartDropDown;
