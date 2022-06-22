import {useStore} from 'effector-react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import {$isSignedIn} from '~/entities/app';
import {DaoPage} from '~/pages/dao';
import {HomePage} from '~/pages/home';
import {NotFoundPage} from '~/pages/not-found';
import {ProfilePage} from '~/pages/profile';
import {PrivateRoute} from '~/shared/components/private-route';
import {ROUTES} from '~/shared/config/routes';

export function Routing() {
  const signedIn = useStore($isSignedIn);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={ROUTES.root.path}>
          <HomePage />
        </Route>

        <PrivateRoute
          exact
          allowed={signedIn}
          path={ROUTES.profile.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          <ProfilePage />
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn}
          path={ROUTES.dao.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          <DaoPage />
        </PrivateRoute>

        <Route render={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  );
}
