import React from 'react';
import { useTable } from 'react-table';
import clsx from 'clsx';

interface Props {
  columns: Array<any>;
  data: Array<any>;
  isHeader?: boolean;
  textColorClassName?: string;
}

const Table = ({
  columns,
  data,
  isHeader = true,
  textColorClassName = 'text-white',
}: Props) => {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <div {...getTableProps()} className='w-full h-full'>
      {isHeader && (
        <div className='table-header'>
          {headerGroups.map((headerGroup, headerGroupIndex) => (
            <div
              {...headerGroup.getHeaderGroupProps()}
              className='grid grid-cols-4 gap-4 bg-gray-700 text-left'
              key={`thead-tr-${headerGroupIndex}`}
            >
              {headerGroup.headers.map((column, columnIndex) => {
                return (
                  <div
                    {...column.getHeaderProps()}
                    className={clsx(
                      'bg-gray-700 font-bold text-xs text-white py-2 px-4',
                      columnIndex === 0 ? 'text-left' : 'text-right',
                      columnIndex === 2 && 'col-span-2'
                    )}
                    key={`thead-tr-th-${columnIndex}`}
                  >
                    {column.render('Header')}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
      <div {...getTableBodyProps()} className='table-body'>
        {rows.map((row: any, rowsIndex: number) => {
          prepareRow(row);
          return (
            <div
              {...row.getRowProps()}
              className='grid grid-cols-4 gap-4 bg-transparent'
            >
              {row.cells.map((cell: any, rowIndex: number) => {
                return (
                  <div
                    {...cell.getCellProps()}
                    className={clsx(
                      'bg-transparent font-bold text-xs py-2 px-4',
                      rowIndex === 0 ? 'text-left' : 'text-right',
                      textColorClassName,
                      rowIndex === 2 && 'col-span-2'
                    )}
                  >
                    {cell.render('Cell')}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Table;
