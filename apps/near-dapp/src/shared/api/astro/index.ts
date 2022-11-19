import {env} from '~/shared/config/env';

// eslint-disable-next-line import/extensions
import {AstroApi} from './generated';

const {api} = new AstroApi({baseUrl: env.ASTRO_API});

export const astroApi = api;

// eslint-disable-next-line import/extensions
export * from './generated';
