import {useStore} from 'effector-react';
import React from 'react';
import {Redirect, Route, Router, Switch} from 'react-router-dom';

import {$currentDaoId, $isSignedIn} from '~/entities/wallet';
import {DaoPage} from '~/pages/dao';
import {DaoNewPage} from '~/pages/dao-new';
import {LoginPage} from '~/pages/login';
import {NotFoundPage} from '~/pages/not-found';
import {ROUTES} from '~/shared/config/routes';
import {history} from '~/shared/lib/router';

import {PrivateRoute} from '@roketo/core/lib/router/private-route';

export function Routing() {
  const signedIn = useStore($isSignedIn);
  const daoId = useStore($currentDaoId);

  return (
    <Router history={history}>
      <Switch>
        <PrivateRoute
          exact
          allowed={!signedIn}
          path={ROUTES.root.path}
          redirect={<Redirect to={ROUTES.dao.path} />}
        >
          <LoginPage />
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn}
          path={ROUTES.dao.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          {!daoId ? <DaoPage /> : <Redirect to={ROUTES.dashboard.path} />}
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn}
          path={ROUTES.daoNew.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          <DaoNewPage />
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn && !!daoId}
          path={ROUTES.dashboard.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          Coming soon
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn && !!daoId}
          path={ROUTES.governance.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          Coming soon
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn && !!daoId}
          path={ROUTES.treasury.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          Coming soon
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn && !!daoId}
          path={ROUTES.employees.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          Coming soon
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn && !!daoId}
          path={ROUTES.employee.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          Coming soon
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn && !!daoId}
          path={ROUTES.streams.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          Coming soon
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn && !!daoId}
          path={ROUTES.streamProposals.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          Coming soon
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn && !!daoId}
          path={ROUTES.stream.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          Coming soon
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn && !!daoId}
          path={ROUTES.nft.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          Coming soon
        </PrivateRoute>

        <Route render={NotFoundPage} />
      </Switch>
    </Router>
  );
}
