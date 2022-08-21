import React from 'react';

import {ILayoutTypeProps} from './base';
import styles from './intro.module.css';

export const IntroLayout: React.FC<ILayoutTypeProps> = ({children}) => (
  <div className={styles.scene}>{children}</div>
);

IntroLayout.displayName = 'IntroLayout';
