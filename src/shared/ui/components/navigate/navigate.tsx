import React from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useLocation} from 'react-router-dom';

import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {List, ListItem} from '~/shared/ui/components/list';
import {Typography} from '~/shared/ui/components/typography';

import styles from './navigate.module.css';

export interface NavItem {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement> & {title?: string}>;
  title: string;
  path: string;
}

export interface INavigateProps {
  isMobile: boolean;
  accountId: string;
  navItems: Array<NavItem>;
  onLogout: () => void;
}

export const Navigate = ({isMobile, accountId, navItems, onLogout}: INavigateProps) => {
  const {t} = useTranslation('dao');
  const location = useLocation();

  const gapInBottom = isMobile ? 4 : 1;
  const buttonVariant = isMobile ? 'outlined' : 'clean';

  return (
    <nav className={styles.nav}>
      <List>
        {navItems.map(({title, path, icon}) => (
          <ListItem key={path} isSelected={location.pathname === path} icon={icon}>
            <Link to={path}>
              <Typography as='span' font='sm'>
                {title}
              </Typography>
            </Link>
          </ListItem>
        ))}
      </List>
      <Col align='center' className={styles.account} gap={gapInBottom}>
        <Typography as='span'>{accountId}</Typography>
        <Button
          variant={buttonVariant}
          size='sm'
          width='full'
          onClick={onLogout}
          className={styles.logoutButton}
          data-qa='logout'
        >
          {t('daoInit.logout')}
        </Button>
      </Col>
    </nav>
  );
};
