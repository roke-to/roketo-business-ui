import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';

import {Root} from '~/app/root';
import {initApp} from '~/entities/app';

initApp();

const rootEl = document.getElementById('root')!;
ReactModal.setAppElement(rootEl);
ReactDOM.render(<Root />, rootEl);
