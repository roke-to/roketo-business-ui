// @ts-ignore
const resolveConfig = require('tailwindcss/resolveConfig');
const config = require('../../../tailwind.config');

export const tailwindConfig = resolveConfig(config);
