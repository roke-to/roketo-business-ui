# Roketo Business Architecture

Basic file structure inherited from [Feature-Sliced Design](https://feature-sliced.design).
It's a SPA builded by vite for better developer experience.

## Env

`src/shared/config/env.ts`

TODO: use dynamic envs

## Module resolution

Use `~/` to import from root. This makes it easier to distinguish imports inside the project from external ones.

## Routing

Project uses react-router. All routes definitions placed at `src/shared/config/routes.ts` and `src/pages/index.tsx`

TBD: переделать на что-то близкое router-config, не нравится как это сейчас. В коде хочется использовать
в качестве ключа просто строку роута, например, `/posts/:id`, без лишних импортов. Пример с линкой:
`<Link path='/posts/:id' params={{id}}>Awesome post about DAO</Link>`. Либо попробовать atomic-router, пока
не понятно насколько он реально нужен, т.к. создает дополнительную связь со стором, роутинг должен быть
независимым от модели данных.

## Styling

Use css-modules + [clsx](https://github.com/lukeed/clsx) (it's faster that classnames) for component styles and theme from [tailwind](https://tailwindcss.com/).

> Do not use tailwind classes directly in features and page. Only if component have prop

For example:

```jsx
export const Portlet = ({children, className, gap = 'md', ...props}) => (
  <div className={clsx(styles.portlet, className, `gap-${gap}`)} {...props}>
    {children}
  </div>
);
```

```css
.portlet {
  background-color: theme('colors.white');
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: theme('dropShadow.DEFAULT');
  padding: theme('spacing.8');
  border-radius: theme('borderRadius.3xl');
}
```

## Components / UI-kit

Located at `src/shared/ui/components/`. Base components such as Button or Input handled by ourselves.
More complex components such as drop down handled by some headless component library with our styling.

TODO: Choose headless UI lib by needs:

- [headless-ui](https://headlessui.dev/)
- [radix-ui](https://www.radix-ui.com/)

## Dataflow

[effector](https://effector.dev)

## Lint

[prettier](https://prettier.io) + [eslint](https://github.com/eslint-kit/eslint-kit)

## Network

- [near-api-js](https://docs.near.org/docs/api/javascript-library)
- [axios](https://github.com/axios/axios)

## Currency

[near-api-js](https://github.com/near/near-api-js/search?q=bn.js) is using [bn.js](https://github.com/indutny/bn.js/). But we need to consider the precision of the calculations for formatting. Therefore, we use [decimal.js](https://github.com/MikeMcl/decimal.js).

> Read more about comparison of js libraries: [A comparison of BigNumber libraries in JavaScript](https://dev.to/fvictorio/a-comparison-of-bignumber-libraries-in-javascript-2gc5) and [big.js vs. bignumber.js vs. decimal.js](https://github.com/MikeMcl/big.js/issues/45#issuecomment-104211175)

Also use [formatting utils](https://near.github.io/near-api-js/modules/utils_format.html) from `near-api-js`

```js
import * as nearApi from 'near-api-js';

// converts NEAR amount into yoctoNEAR (10^-24)
const yoktoValue = nearApi.utils.format.parseNearAmount('1'); // 1000000000000000000000000

// converts yoctoNEAR (10^-24) amount into NEAR
const nearValue = nearApi.utils.format.formatNearAmount('1000000000000000000000000'); // 1
```
