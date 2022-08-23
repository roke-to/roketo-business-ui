import {useStore} from 'effector-react';
import React from 'react';
import {Redirect, Route, Router, Switch} from 'react-router-dom';

import {$currentDaoId} from '~/entities/dao';
import {$isSignedIn} from '~/entities/wallet';
import {DaoPage} from '~/pages/dao';
import {DaoNewPage} from '~/pages/dao-new';
import {DashboardPage} from '~/pages/dashboard';
import {EmployeesPage} from '~/pages/employees';
import {GovernancePage} from '~/pages/governance';
import {LoginPage} from '~/pages/login';
import {NotFoundPage} from '~/pages/not-found';
import {StreamsPage} from '~/pages/streams';
import {TreasuryPage} from '~/pages/treasury';
import {ROUTES} from '~/shared/config/routes';
import {history, PrivateRoute} from '~/shared/lib/router';

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
          <DashboardPage />
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn && !!daoId}
          path={ROUTES.governance.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          <GovernancePage />
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn && !!daoId}
          path={ROUTES.treasury.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          <TreasuryPage />
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn && !!daoId}
          path={ROUTES.employees.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          <EmployeesPage />
        </PrivateRoute>

        <PrivateRoute
          exact
          allowed={signedIn && !!daoId}
          path={ROUTES.streams.path}
          redirect={<Redirect to={ROUTES.root.path} />}
        >
          <StreamsPage />
        </PrivateRoute>

        <Route render={NotFoundPage} />
      </Switch>
    </Router>
  );
}
