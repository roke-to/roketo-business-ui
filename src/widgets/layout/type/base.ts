// All layout types should implement this interface
export interface ILayoutTypeProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  navigation: React.ReactNode;
  mainHeaderContent: React.ReactNode;
}
