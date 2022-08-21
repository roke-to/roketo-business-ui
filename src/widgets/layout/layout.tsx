import React from 'react';

import {LayoutContext} from './provider';
import {IntroLayout, MainLayout} from './type';

const layoutTypes = {
  intro: IntroLayout,
  main: MainLayout,
};

export type LayoutType = keyof typeof layoutTypes;

export interface ILayoutProps {
  type?: LayoutType;
}

export const PageLayout: React.FC<ILayoutProps> = ({children, type = 'main'}) => {
  const layoutProps = React.useContext(LayoutContext);
  const LayoutComponent = layoutTypes[type];

  return <LayoutComponent {...layoutProps}>{children}</LayoutComponent>;
};
