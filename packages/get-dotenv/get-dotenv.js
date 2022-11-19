#!/usr/bin/env node

const {loadEnv} = require('vite');

const VITE_BUILD_MODE = process.env.VITE_BUILD_MODE;
const DOTENV_DIR = process.cwd();

const envName = process.argv[2];

const parsed = loadEnv(VITE_BUILD_MODE, DOTENV_DIR, '');

console.log(parsed[envName]);
