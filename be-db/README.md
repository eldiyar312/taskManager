# be-db

Development database

## Pre requirements

- `node.js`: `18.*`
- `yarn`: `1.22.*`
- `mongoDB`: `6.*`

## Development

1. Install `node`, `yarn`
2. Install `MongoDB` (see [How to install database](#how-to-install-database))
3. Start the database server: `yarn run start` or `yarn run start:windows`

## How to install database

### MacOS:

```sh
brew tap mongodb/brew
brew install mongodb-community@6.0
```

### Windows:

1. Download [MongoDB](https://www.mongodb.com/try/download/community)
2. You need to select a custom installation and select the root of drive C. In this place, create a _mongodb_ folder and install it here.
3. Specify the path to the _mongod_ file in the _package.json_

```sh
"start:windows": "C:\\mongodb\\bin\\mongod --dbpath ./data --bind_ip localhost --ipv6"
```

## Production

⚠️ Note! Don't use this in production. Only for local launch! ⚠️

## How to check?

Use [MongoDB Compass](https://www.mongodb.com/products/compass) or alternative tool.

## Available Scripts

In the project directory, you can run:

### `yarn run start`

### `yarn run start:windows`

Run the database.
