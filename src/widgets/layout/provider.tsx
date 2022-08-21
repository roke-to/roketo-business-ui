import React from 'react';

import {ILayoutTypeProps} from './type/base';

const Nothing = () => null;

export const LayoutContext = React.createContext<ILayoutTypeProps>({
  isSidebarOpen: false,
  onSidebarToggle: () => {},
  navigation: <Nothing />,
  mainHeaderContent: <Nothing />,
});

const {Provider} = LayoutContext;

export const LayoutProvider: React.FC<ILayoutTypeProps> = ({children, ...props}) => (
  <Provider value={props}>{children}</Provider>
);
