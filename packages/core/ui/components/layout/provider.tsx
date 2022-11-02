import React from 'react';

import { ILayoutTypeProps } from './type/base';

const Nothing = () => null;

// ts-unused-exports:disable-next-line
export const LayoutContext = React.createContext<ILayoutTypeProps & { trackingId: string }>({
  trackingId: '',
  isSidebarOpen: false,
  onSidebarToggle: () => { },
  sidebarContent: <Nothing />,
  mainHeaderContent: <Nothing />,
});

const { Provider } = LayoutContext;

export const LayoutProvider: React.FC<ILayoutTypeProps & { trackingId: string }> = ({ children, ...props }) => (
  <Provider value={props}>{children}</Provider>
);

LayoutProvider.displayName = 'LayoutProvider';
