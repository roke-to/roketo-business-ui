import React from 'react';

const TabsContext = React.createContext<any>(null);

export interface ITabsListProps {
  value: any;
  className?: string;
  onChange?: (value: any) => void;
}

// uncontrolled
export const TabsList: React.FC<ITabsListProps> = ({children, value, onChange, ...props}) => {
  const context = React.useMemo(
    () => ({
      onChange,
      value,
    }),
    [value, onChange],
  );

  return (
    <TabsContext.Provider value={context}>
      <div {...props}>{children}</div>
    </TabsContext.Provider>
  );
};

export interface ITabProps {
  value: any;
  className?: string;
}

export const Tab: React.FC<ITabProps> = ({children, value, ...props}) => {
  const {value: selected, onChange} = React.useContext(TabsContext);
  const handleClick = React.useCallback(() => onChange(value), [value, onChange]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div {...props} onClick={handleClick}>
      {children} {value === selected ? '*' : ''}
    </div>
  );
};
