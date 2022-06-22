# Roketo Business Architecture

Basic file structure inherited from [Feature-Sliced Design](https://feature-sliced.design).
It's a SPA builded by vite for better developer experience.


## Env

`src/shared/config/env.ts`

TODO: use dynamic envs


## Routing

Project uses react-router. All routes definitions placed at `src/shared/config/routes.ts` and `src/pages/index.tsx`


## Styling

Use css-modules and [tailwind](https://tailwindcss.com/) (?).


## Dataflow

[effector](https://effector.dev)


## Lint

[prettier](https://prettier.io) + [eslint](https://github.com/eslint-kit/eslint-kit)


## Network

[`near-api-js`](https://docs.near.org/docs/api/javascript-library)
