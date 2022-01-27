import React, { ReactChild, ReactChildren } from 'react';
import clsx from 'clsx';

interface Props {
  children: ReactChild | ReactChildren;
  widgetName: string;
  className?: string;
}

const WidgetLayout = ({ children, widgetName, className }: Props) => {
  return (
    <div className={clsx('text-gray-100 pl-3', className)}>
      <h1 className='ml-2 pt-3 text-xl mb-5'>{widgetName}</h1>
      {children}
    </div>
  );
};

export default WidgetLayout;
