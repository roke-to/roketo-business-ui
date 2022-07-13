import React from 'react';

interface ITabsContext<T = any> {
  value?: T;
  onChange?: (value: T) => void;
}

export const TabsContext = React.createContext<ITabsContext>({});
