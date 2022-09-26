# Storybook Addon Manual Mocks
The Storybook Manual Mocks addon can be used to Mocking your imports as [Manual Mocks in Jest](https://jestjs.io/docs/manual-mocks)

## Getting Started

Install this addon by adding the `storybook-addon-manual-mocks` dependency:

```sh
yarn add -D storybook-addon-manual-mocks
```

within `.storybook/main.js`:

```js
module.exports = {
  addons: ['storybook-addon-manual-mocks'],
};
```


## How to use


You can extract you server querying from components to hooks and mock those files

```
MyComponent
├── __mocks__
│   └── MyComponent.hooks.js
├── MyComponent.component.js
├── MyComponent.stories.js
├── MyComponent.hooks.js
└── index.js
```


When you will import `MyComponent.hooks` in `MyComponent.component.js`, file from `__mocks__` directory will be used

```js
import { useSomeData } from 'MyComponent.hooks';
// it will import           '__mocks__/MyComponent.hooks' instead
```


## Important

This addon works only with relative imports(`./` or `../`) for example
```js
// ✅ this CAN be mocked
import { useData } from './useData';

// ✅ this CAN be mocked
import { useListInfo } from '../ParentComponent/useListInfo';

// ⚠️ this CAN'T be mocked
import { useLibHook } from '@monorepo/hooks';
```