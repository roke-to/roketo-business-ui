import clsx from 'clsx';
import React from 'react';

import {ReactComponent as ArrowIcon} from '../../icons/arrow.svg';
import styles from './arrow.module.css';

export interface ArrowProps extends React.SVGProps<SVGSVGElement> {
  direction: 'up' | 'down' | 'right' | 'left';
}

export const Arrow = ({direction}: ArrowProps) => (
  <ArrowIcon className={clsx(styles.root, styles[direction])} />
);
