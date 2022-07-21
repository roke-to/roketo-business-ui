import clsx from 'clsx';
import React from 'react';

import {TabsContext} from './context';
import styles from './tabs.module.css';

export interface ITabsProps<T = any> {
  value?: T;
  className?: string;
  onChange?: (value: T) => void;
}

// uncontrolled
// ts-unused-exports:disable-next-line
export const Tabs: React.FC<ITabsProps> = ({children, className, value, onChange, ...props}) => {
  const context = React.useMemo(
    () => ({
      onChange,
      value,
    }),
    [value, onChange],
  );

  return (
    <div {...props} className={clsx(styles.root, className)}>
      <TabsContext.Provider value={context}>{children}</TabsContext.Provider>
    </div>
  );
};
