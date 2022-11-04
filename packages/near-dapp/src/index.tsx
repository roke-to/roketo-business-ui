import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';

import {Root} from '~/app/root';
import {initApp} from '~/entities/app';

initApp();

console.log('process.env.NEAR_NO_LOGS', process.env.NEAR_NO_LOGS);

const rootEl = document.getElementById('root')!;
ReactModal.setAppElement(rootEl);
ReactDOM.render(<Root />, rootEl);
