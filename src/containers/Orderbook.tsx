import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Table from '../components/Table';
import WidgetLayout from '../components/WidgetLayout';
import useOrderBookWebSocket from '../hooks/websocket/useOrderBookWebSocket';
import { TickerSymbolRecoil } from '../recoil/tickerSymbolRecoil';

const Orderbook = () => {
  const symbol = useRecoilValue(TickerSymbolRecoil);
  const [asks, setAsks] = useState<string[]>();
  const [bids, setBids] = useState<string[]>();

  const { lastJsonMessage: orderbookLastMessage }: any =
    useOrderBookWebSocket(symbol);

  useEffect(() => {
    if (orderbookLastMessage) {
      const asks = orderbookLastMessage?.asks?.map((arr: string[]) => {
        return {
          price: parseFloat(arr[0])
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          amount: parseFloat(arr[1]).toFixed(5),
          total: (parseFloat(arr[0]) * parseFloat(arr[0]))
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        };
      });
      const bids = orderbookLastMessage?.bids?.map((arr: string[]) => {
        return {
          price: parseFloat(arr[0])
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          amount: parseFloat(arr[1]).toFixed(5),
          total: (parseFloat(arr[0]) * parseFloat(arr[0]))
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        };
      });
      setAsks(asks);
      setBids(bids);
    }
  }, [orderbookLastMessage]);

  const columns: Array<{ Header: string; accessor: string }> = React.useMemo(
    () => [
      {
        Header: 'Price',
        accessor: 'price',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Total',
        accessor: 'total',
      },
    ],
    []
  );

  return (
    <WidgetLayout widgetName='Orderbook'>
      <div className='h-6xl grid grid-rows-2 gap-20'>
        <Table
          columns={columns}
          data={asks || []}
          textColorClassName='text-red-600'
        />
        <Table
          columns={columns}
          data={bids || []}
          textColorClassName='text-teal-500'
        />
      </div>
    </WidgetLayout>
  );
};

export default React.memo(Orderbook);
