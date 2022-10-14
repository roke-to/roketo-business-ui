import {env} from '~/shared/config/env';

import {Api as AstroApi} from './generated/astro-api';

const {api} = new AstroApi({baseUrl: env.ASTRO_API});

export const astroApi = api;

export * from './generated/astro-api';
