import clsx from 'clsx';
import React from 'react';

import {ReactComponent as Spinner} from '../../icons/spinner.svg';
import styles from './loading.module.css';

export const Loading = ({isLoading}: {isLoading: boolean}) => (
  <Spinner className={clsx(styles.root, {[styles.loading]: isLoading})} />
);
