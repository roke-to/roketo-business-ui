import React from 'react';

import {Arrow} from '~/shared/ui/components/arrow';
import {Button} from '~/shared/ui/components/button';

import styles from './show-more.module.css';

export interface ShowMoreProps {
  showMoreText: string;
  showLessText: string;
}

export const ShowMore = ({
  showMoreText,
  showLessText,
  children,
}: React.PropsWithChildren<ShowMoreProps>) => {
  const [isCollapse, setIsCollapse] = React.useState(true);

  const arrowDirection = isCollapse ? 'down' : 'up';

  return (
    <>
      <div className={styles.line}>
        <Button
          variant='outlined'
          size='xxs'
          onClick={() => setIsCollapse(!isCollapse)}
          endIcon={<Arrow direction={arrowDirection} />}
          className={styles.button}
        >
          {isCollapse ? showMoreText : showLessText}
        </Button>
      </div>
      {!isCollapse && children}
    </>
  );
};
