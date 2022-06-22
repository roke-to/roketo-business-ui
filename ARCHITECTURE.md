# Roketo Business Architecture

Basic file structure inherited from [Feature-Sliced Design](https://feature-sliced.design).
It's a SPA builded by vite for better developer experience.


## Env

`src/shared/config/env.ts`

TODO: use dynamic envs


## Module resolution

Use `~/` to import from root. 

TBD: может отказаться от `~/` и просто указать `baseUrl` в `tsconfig.json`


## Routing

Project uses react-router. All routes definitions placed at `src/shared/config/routes.ts` and `src/pages/index.tsx`

TBD: переделать на что-то близкое router-config, не нравится как это сейчас. В коде хочется использовать 
в качестве ключа просто строку роута, например, `/posts/:id`, без лишних импортов. Пример с линкой:
`<Link path='/posts/:id' params={{id}}>Awesome post about DAO</Link>`. Либо попробовать atomic-router, пока 
не понятно насколько он реально нужен, т.к. создает дополнительную связь со стором, роутинг должен быть
независимым от модели данных.


## Styling

Use css-modules and [tailwind](https://tailwindcss.com/) (?).

TDB: Не очень понятно профита от @apply стилей от tildwind, по сути же уже проще обычный CSS написать
без лишнего уровня абстракции. надо подумать крч.


## Components / UI-kit

Located at `src/shared/ui/components/`. 

TDB: за основу взять headless-ui + daisyui. Но такие компоненты как Button, Input придется реализовывать. 


## Dataflow

[effector](https://effector.dev)


## Lint

[prettier](https://prettier.io) + [eslint](https://github.com/eslint-kit/eslint-kit)


## Network

[`near-api-js`](https://docs.near.org/docs/api/javascript-library)
