import clsx from 'clsx';
import React from 'react';

import styles from './styles.module.scss';

type Props = {
  wrapperClassName?: string;
  spinnerClassName?: string;
  testId?: string;
};

export const Spinner = ({wrapperClassName, spinnerClassName, testId}: Props) => (
  <div className={clsx(styles.wrapper, wrapperClassName)} data-testid={testId}>
    <div className={clsx(styles.spinner, spinnerClassName)} />
  </div>
);
