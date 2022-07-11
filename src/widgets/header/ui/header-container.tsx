import React from 'react';

import {Typography} from '~/shared/ui/components/typography';

import styles from './header-container.module.css';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: JSX.Element | JSX.Element[];
}

export const HeaderContainer: React.FC<HeaderProps> = ({children}) => (
  <Typography className={styles.header}>{children}</Typography>
);
