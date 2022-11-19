import {env} from '~/shared/config/env';

import {AstroApi} from './generated';

const {api} = new AstroApi({baseUrl: env.ASTRO_API});

export const astroApi = api;

export * from './generated';
