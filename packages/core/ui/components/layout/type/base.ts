// All layout types should implement this interface
export interface ILayoutTypeProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  sidebarContent: React.ReactNode;
  mainHeaderContent: React.ReactNode;
}
