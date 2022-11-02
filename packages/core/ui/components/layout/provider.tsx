import React from 'react';
import { IntercomProvider } from 'react-use-intercom';

import { ILayoutTypeProps } from './type/base';

const Nothing = () => null;

interface IProviderContext extends ILayoutTypeProps {
  trackingId: string;
  intercomId: string;
}

// ts-unused-exports:disable-next-line
export const LayoutContext = React.createContext<IProviderContext>({
  trackingId: '',
  intercomId: '',
  isSidebarOpen: false,
  onSidebarToggle: () => { },
  sidebarContent: <Nothing />,
  mainHeaderContent: <Nothing />,
});

const { Provider } = LayoutContext;

export const LayoutProvider: React.FC<IProviderContext> = ({ children, ...props }) => (
  <IntercomProvider appId={props.intercomId}>
    <Provider value={props}>{children}</Provider>
  </IntercomProvider>
);

LayoutProvider.displayName = 'LayoutProvider';
