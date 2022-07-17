import React from 'react';
import {Link, useLocation} from 'react-router-dom';

import {RouteKey, ROUTES} from '~/shared/config/routes';
import {List, ListItem} from '~/shared/ui/components/list';
import {Typography} from '~/shared/ui/components/typography';
import {ReactComponent as NavigateIcon} from '~/shared/ui/icons/dashboard_ico.svg';

const LINKS: RouteKey[] = ['dashboard', 'treasury', 'governance', 'employees'];

export const Navigate = () => {
  const location = useLocation();

  return (
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
  );
};
