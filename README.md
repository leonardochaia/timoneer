# Timoneer

![Timoneer](/resources/logo_transparent.png "Timoneer")

master:
[![Build Status](https://travis-ci.org/leonardochaia/timoneer.svg?branch=master)](https://travis-ci.org/leonardochaia/timoneer)
develop:
[![Build Status](https://travis-ci.org/leonardochaia/timoneer.svg?branch=develop)](https://travis-ci.org/leonardochaia/timoneer) [![Greenkeeper badge](https://badges.greenkeeper.io/leonardochaia/timoneer.svg)](https://greenkeeper.io/)

Docker Client for Windows, Mac & Linux.

[Download latest release](https://github.com/leonardochaia/timoneer/releases/latest)

## What's Included

![Timoneer](/resources/preview.gif "Timoneer")

Intended to manage containers locally. You can add your private registries and it will list their images.

1. Connects to Docker Daemon using certificates.
   Auto configures from environment, but can be changed to remote server.
1. Use custom Docker Hub credentials.
1. Containers actions include: List, create, start/stop, remove, attach, exec.
1. Image actions include: List, pull.
1. Volumes actions include: List, create, remove
1. Registries: List images and tags.

## Development

Electron Application, using Angular 6 and Dockerode as Docker client.

```bash
yarn install
yarn start
```

## Credits

1. Angular Electron build setup from [maximegris/angular-electron](https://github.com/maximegris/angular-electron)
1. UI inspired on [Visual Studio Code](https://github.com/Microsoft/vscode/)