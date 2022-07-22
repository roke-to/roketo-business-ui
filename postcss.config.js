import autoprefixer from 'autoprefixer';
import tailwind from 'tailwindcss';
import nesting from 'tailwindcss/nesting';

import tailwindConfig from './tailwind.config';

// https://tailwindcss.com/docs/using-with-preprocessors
export default {
  plugins: [nesting, tailwind(tailwindConfig), autoprefixer],
};
