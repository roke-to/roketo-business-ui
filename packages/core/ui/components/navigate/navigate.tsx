import clsx from 'clsx';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useLocation} from 'react-router-dom';

import {Button} from '../button';
import {Col} from '../col';
import {LayoutContext} from '../layout';
import {Typography} from '../typography';
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
  const layoutProps = React.useContext(LayoutContext);

  React.useEffect(() => {
    if (isMobile) {
      layoutProps.onSidebarToggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const gapInBottom = isMobile ? 4 : 1;
  const buttonVariant = isMobile ? 'outlined' : 'clean';

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {navItems.map(({title, path, icon: Icon}) => {
          const isSelected = location.pathname === path;
          return (
            <li key={path} className={clsx(styles.listItem, {[styles.selected]: isSelected})}>
              <Link to={path} className={styles.listLink}>
                <Icon className={styles.icon} />
                <Typography as='span' font='sm'>
                  {title}
                </Typography>
              </Link>
            </li>
          );
        })}
      </ul>
      <Col align='center' className={styles.account} gap={gapInBottom}>
        <Typography as='span' font='sm' weight='semibold' className='truncate w-full'>
          {accountId}
        </Typography>
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
