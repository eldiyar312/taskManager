# photospace

App photospace

## Infrastructure

TODO

## Pre requirements

- `node.js`: `18.*`
- `yarn`: `1.22.*`
- `tmux`: `*` (optional, for local launch)

## Development

1. install `node`, `yarn`, `tmux`

```sh
brew install tmux
```

2. run `chmod 0755 ./tmux.sh`
3. run `yarn install` on repository root
4. install all packages (see instructions):
   - [be-api](be-api/README.md)
   - [be-db](be-db/README.md)
   - [fe-web](fe-web/README.md)
   - [shared](shared/README.md)
5. update `tmux` config: `cp -R ./.tmux.conf ~/.tmux.conf`
6. run `./tmux.sh` on repository root

### Instruction for start in WSL workspace

1. open powershell by admin role
2. enter command `wsl --install` and wait for installation to complete
3. for start project use `ubuntu-22.*`, command for install `wsl --install ubuntu-22.*`
4. restart powershell make sure that `ubuntu-22.*` use wsl version 2, command `wsl --list --verbose`
5. Run `ubuntu-22.*` shell, and install `node/npm`, `yarn`, `mongo`, `tmux`, for install `mongo` use this instruction (https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)
   [tmux] `sudo apt install tmux`
   [node/npm] `sudo apt install build-essential checkinstall`
   `sudo apt install libssl-dev`
   `wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash`
   `nvm ls-remote`
   `nvm install {18.*}`
   [yarn] `npm install --global yarn`
6. update `tmux` config: `cp -R ./.tmux.conf ~/.tmux.conf`
7. install openssh for connect you wsl from window `sudo apt install openssh-server`
8. clone your project in the `ubuntu` directory, example path (home/{username}/), this required step, other your project will incorrect running. For running project use shell `ubuntu-22.*`,and command `./tmux.sh`

## Available Scripts

In the repository root, you can run:

### `yarn run postinstall`

Run husky.\
See the [documentation](https://typicode.github.io/husky/#/) for the `husky` package for details.

### `yarn run prettier`

Run prettier.\
See the [documentation](https://prettier.io/docs/en/cli.html) for the `prettier` package for details.
