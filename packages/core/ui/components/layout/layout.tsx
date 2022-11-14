import { Analytics } from "../analytics";
import { LayoutContext } from "./provider";
import { IntroLayout, MainLayout } from "./type";
import React from "react";

const layoutTypes = {
  intro: IntroLayout,
  main: MainLayout,
};

export type LayoutType = keyof typeof layoutTypes;

export interface ILayoutProps {
  type?: LayoutType;
}

export const Layout: React.FC<ILayoutProps> = ({ children, type = "main" }) => {
  const { trackingId, ...layoutProps } = React.useContext(LayoutContext);
  const LayoutComponent = layoutTypes[type];

  return (
    <>
      <LayoutComponent {...layoutProps}>{children}</LayoutComponent>
      <Analytics trackingId={trackingId} />
    </>
  );
};

Layout.displayName = "Layout";
