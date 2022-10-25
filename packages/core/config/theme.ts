import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from './tailwind.config';

// it parses incorrectly destructuring export
// ts-unused-exports:disable-next-line
export const {theme} = resolveConfig(tailwindConfig);
