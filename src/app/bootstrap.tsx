import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';

import {initApp} from '~/entities/app';

import {Root} from './root';

export const bootstrap = () => {
  const rootEl = document.getElementById('root')!;

  ReactModal.setAppElement(rootEl);
  initApp();
  ReactDOM.render(<Root />, rootEl);
};
