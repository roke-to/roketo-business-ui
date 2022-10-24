import React from 'react';

import {Button} from 'ui/components/button';

export interface PartVisibleListProps<T> {
  options: T[];
  renderOptions(props: T): JSX.Element;
  maxVisibleCount?: number;
  showAllText: string;
  showLessText: string;
  showMoreClassName?: string;
}

export function PartVisibleList<T>({
  options,
  renderOptions,
  showAllText,
  showLessText,
  maxVisibleCount = 5,
  showMoreClassName,
}: PartVisibleListProps<T>) {
  const [isAllVisible, setIsAllVisible] = React.useState(false);

  const visibleOptions = isAllVisible ? options : options.slice(0, maxVisibleCount);

  const hasMoreOptionsButton = options.length > maxVisibleCount;

  const showAll = !isAllVisible && hasMoreOptionsButton;
  const showLess = isAllVisible && hasMoreOptionsButton;

  return (
    <>
      {visibleOptions.map((option) => renderOptions(option))}
      {showAll && (
        <Button variant='clean' className={showMoreClassName} onClick={() => setIsAllVisible(true)}>
          {showAllText}
        </Button>
      )}
      {showLess && (
        <Button
          variant='clean'
          className={showMoreClassName}
          onClick={() => setIsAllVisible(false)}
        >
          {showLessText}
        </Button>
      )}
    </>
  );
}
