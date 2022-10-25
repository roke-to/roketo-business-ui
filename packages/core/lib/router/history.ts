import {createBrowserHistory} from 'history';

export const history = (basename: string) => createBrowserHistory({basename});
