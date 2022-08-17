import React from 'react';

import {Button} from '~/shared/ui/components/button';

export interface PartVisibleListProps<T> {
  options: T[];
  renderOptions(props: T): JSX.Element;
  maxVisibleCount?: number;
  showAllText: string;
  showAllClassName?: string;
}

export function PartVisibleList<T>({
  options,
  renderOptions,
  showAllText,
  maxVisibleCount = 5,
  showAllClassName,
}: PartVisibleListProps<T>) {
  const [isAllVisible, setIsAllVisible] = React.useState(false);

  const visibleOptions = isAllVisible ? options : options.slice(0, maxVisibleCount);

  return (
    <>
      {visibleOptions.map((option) => renderOptions(option))}
      {visibleOptions.length !== options.length && options.length > maxVisibleCount ? (
        <Button variant='clean' className={showAllClassName} onClick={() => setIsAllVisible(true)}>
          {showAllText}
        </Button>
      ) : null}
    </>
  );
}
