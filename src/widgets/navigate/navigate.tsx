import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useLocation} from 'react-router-dom';

import {$accountId, logoutClicked} from '~/entities/wallet';
import {RouteKey, ROUTES} from '~/shared/config/routes';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {List, ListItem} from '~/shared/ui/components/list';
import {Typography} from '~/shared/ui/components/typography';
import {ReactComponent as NavigateIcon} from '~/shared/ui/icons/dashboard_ico.svg';

import styles from './navigate.module.css';

const LINKS: RouteKey[] = ['dashboard', 'treasury', 'governance', 'employees', 'streams'];

export const Navigate = ({isMobileWidth}: {isMobileWidth: boolean}) => {
  const {t} = useTranslation('dao');
  const location = useLocation();
  const accountId = useStore($accountId);

  const gapInBottom = isMobileWidth ? 4 : 1;
  const buttonVariant = isMobileWidth ? 'outlined' : 'clean';

  return (
    <nav className={styles.nav}>
      <List>
        {LINKS.map((linkName) => {
          const {title, path} = ROUTES[linkName];
          const isSelected = location.pathname === path;

          return (
            <ListItem key={title} isSelected={isSelected} icon={NavigateIcon}>
              <Link to={path}>
                <Typography as='span' font='sm'>
                  {title}
                </Typography>
              </Link>
            </ListItem>
          );
        })}
      </List>

      <Col align='center' className={styles.bottomNavigate} gap={gapInBottom}>
        <Typography as='span'>{accountId}</Typography>
        <Button
          variant={buttonVariant}
          size='sm'
          width='full'
          onClick={() => logoutClicked()}
          className={styles.logoutButton}
        >
          {t('daoInit.logout')}
        </Button>
      </Col>
    </nav>
  );
};
