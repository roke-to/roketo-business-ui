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

const LINKS: RouteKey[] = ['dashboard', 'treasury', 'governance', 'employees'];

export const Navigate = () => {
  const {t} = useTranslation('dao');
  const location = useLocation();
  const accountId = useStore($accountId);

  return (
    <>
      <List>
        {LINKS.map((linkName) => {
          const {title, path} = ROUTES[linkName];
          const isSelected = location.pathname === path;

          return (
            <ListItem key={title} isSelected={isSelected} icon={NavigateIcon}>
              <Link to={path}>
                <Typography as='span' weight='medium'>
                  {title}
                </Typography>
              </Link>
            </ListItem>
          );
        })}
      </List>

      <Col align='center' className={styles.bottomNavigate}>
        <Typography as='span'>{accountId}</Typography>
        <Button variant='outlined' size='sm' width='full' onClick={() => logoutClicked()}>
          {t('daoInit.logout')}
        </Button>
      </Col>
    </>
  );
};
