import {useStore} from 'effector-react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import {$isSignedIn} from '~/entities/app';
import {LoginPage} from '~/pages/login/login';
import {NotFoundPage} from '~/pages/not-found';
import {ROUTES} from '~/shared/config/routes';
import {PrivateRoute} from '~/shared/lib/router';

export function Routing() {
  const signedIn = useStore($isSignedIn);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={ROUTES.root.path}>
          <LoginPage />
        </Route>

        <PrivateRoute
          exact
          allowed={signedIn}
          path={ROUTES.profile.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          profile page
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn}
          path={ROUTES.dao.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          dao page
        </PrivateRoute>

        <Route render={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  );
}
