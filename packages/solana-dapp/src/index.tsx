import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';

import {Root} from '~/app/root';
import {initWallet} from '~/entities/wallet';

initWallet();

const rootEl = document.getElementById('root')!;
ReactModal.setAppElement(rootEl);
ReactDOM.render(<Root />, rootEl);
