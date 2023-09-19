# fe-web

Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Infrastructure

TODO

## Environment variables

You can run a project in several modes, depending on the mode, one or another backend will be used.

Available env modes:

- `local` (default in watch mode)
- `staging`
- `production`

You can run a project in any of the listed modes. To do this, create a file `.env.local` in the root of the repository (**note that this file should be ignored by the `git`**) and put the line `REACT_APP_PUBLIC_ENV` in it. For example:

```sh
echo "REACT_APP_PUBLIC_ENV=staging" >> .env
```

For details see [code](src/constants/env.ts) and [CRA documentation](https://create-react-app.dev/docs/adding-custom-environment-variables/).

## Pre requirements

- `node.js`: `18.*`
- `yarn`: `1.22.*`

## Development

1. install `node`, `yarn`
2. run `yarn install` on repository root
3. run parallel:

```sh
yarn run watch:po
```

```sh
yarn run watch:storybook
```

```sh
yarn run watch
```

## Production

Just merge the changes into the `main` branch.

### Manual deploy

1. run `yarn install --frozen-lockfile` on repository root.
2. run `yarn run build:po`
3. run `yarn run build`

When the build is complete, serve the files from the `/build` directory using nginx as regular static files.

## Available Scripts

In the project directory, you can run:

### `yarn run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn run build:po`

Generate typescript-compatible dictionaries from .po files.

### `yarn run build:storybook`

Build storybook stories as static website.

### `yarn run watch`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn run watch:po`

Generate typescript-compatible dictionaries from .po files in watch mode.

### `yarn run watch:storybook`

Runs the storybook in the development mode.\
Open [http://localhost:6006](http://localhost:6006) to view it in the browser.

The page will reload if you make edits.

### `yarn run test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn run test:storybook`

Storybook test runner turns all of your stories into executable tests. These tests run in a live browser and can be executed via the command line or your CI server.

### `yarn run typecheck`

Run TypeScript typecheck.

### `yarn run lint`

Run eslint.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
