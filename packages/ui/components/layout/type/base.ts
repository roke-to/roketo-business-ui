// All layout types should implement this interface
import React from "react";

export interface ILayoutTypeProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  sidebarContent: React.ReactNode;
  mainHeaderContent: React.ReactNode;
  children?: React.ReactNode;
}
