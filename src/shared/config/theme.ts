// @ts-ignore
const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('../../../tailwind.config');

export const config = resolveConfig(tailwindConfig);
