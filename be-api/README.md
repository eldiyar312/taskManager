# be-api

Backend

## Infrastructure

TODO

## Environment variables

You can run a project in several modes, depending on the mode, one or another backend will be used.

Available env modes:

- `local` (default in watch mode)
- `staging`
- `production`

You can run a project in any of the listed modes. To do this, create a file `.env.local` in the root of the package (**note that this file should be ignored by the `git`**) and put the line `PUBLIC_ENV` in it. For example:

```sh
echo "PUBLIC_ENV=staging" >> .env
```

For details see [code](src/constants/env.ts) and [dotenv-flow documentation](https://www.npmjs.com/package/dotenv-flow).

## Pre requirements

- `node.js`: `18.*`
- `yarn`: `1.22.*`
- [be-db](../be-db/README.md) (local only) or MongoDB instance (production only)
- [shared](../shared/README.md) (local only)

## Development

1. install `node`, `yarn`
2. run `yarn install`
3. run [be-db](../be-db/README.md)
4. run parallel:

```sh
yarn run watch:po
```

```sh
yarn run db:migrate up
yarn run watch
```

## Production

Just merge the changes into the `main` branch.

### Manual deploy

1. run `yarn install --frozen-lockfile`
2. run `yarn run build:po`
3. run `yarn run build`
4. run `NODE_ENV=production yarn run db:migrate up`
5. run `NODE_ENV=production yarn run start`

## How to check?

Send a GET request to `/` → the response will be "version: x.x.x"

## Swagger

Swagger is available in local launch mode.
Open [http://localhost:8000/swagger](http://localhost:8000/swagger) to view it in the browser.

## Internationalization

We store [dictionaries](dictionaries) in [gettext .po](https://www.gnu.org/software/gettext/) format.\
See the [documentation](https://www.npmjs.com/package/po-extract) for the `po-extract` package for details.

## Available Scripts

In the project directory, you can run:

### `yarn run build`

Builds the app for production to the `build` folder.

### `yarn run build:po`

Generate typescript-compatible dictionaries from .po files.

### `yarn run watch`

Runs the app in the development mode.\
Open [http://localhost:8000/](http://localhost:8000/) to view it in the browser.

The app will reload if you make edits.\
You will also see any errors in the console.

### `yarn run watch:po`

Generate typescript-compatible dictionaries from .po files in watch mode.

### `yarn run start`

Run the app bundle in production mode.\
Before running it must be built using the `yarn run build` command.

### `yarn run db:migrate`

Run migrations.\
See the [documentation](https://www.npmjs.com/package/migrate-mongo) for the `migrate-mongo` package for details.

### `yarn run lint`

Run eslint.

### `yarn run test`

Run unit tests.
