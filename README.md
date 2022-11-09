![Tomorrow.JS](./.github/tomorrowJS.svg)

<p align="center">The next generation react-native ecosystem</p>

## Quick Start
```bash
yarn add tomorrowjs
```
or
``` bash
npm install tomorrowjs
```

## What is it?

**Tomorrow.JS** is a react-native ecosystem that provides a set of tools to help you build your app faster and easier. Think of it like **Tomorrow.JS** is a **React-Native** on steroids.
**Tomorrow.JS** is the equivalent of **Next.JS** for **React-Native**.

## Our Aim

We aim to create an environment where people from any react background can easily create a react-native application. We want to bring the idea of modular react-native applications to the next level whilst keeping it as simple as playing with lego.

## Why Tomorrow.JS?

**Tomorrow.JS** has a few differentiators that make it stand out from the rest of the react-native ecosystems. We do not try to hide what we do. There are no pay walls, no off-site builds. We provide the tools and the environment for you to thrive. Everything is open source and free to use. Everything you need is here.

## Getting started

Currently these packages are not published to npm. This will happen for our first launch.
To start developing locally, ensure you have `pnpm` installed, along with `NodeJS`.

To install `pnpm`, follow [this guide](https://pnpm.io/installation).
We assume that you already have `NodeJS` installed.

To install the dependencies, run the following command:
```bash
pnpm install
```

This will get the ball rolling with everything here in this repo.

The next step is to create a seperate test-range. This is where you will be able to trial the packages.
Create the folder outside of this directory, and somewhere on your disk. Then get the file path to it.
Edit the `testRange` property inside [`packages/build-env/package.json`](./packages/build-env/package.json) to the file path you just got. You will see this is already filled with a path, but you will need to change it to your own.

> Keep in mind, this needs to be a path that is relative to the `build-env` package.

This system is used to live update the files in the `node_modules` of your test range... whenever a change is detected when using the `dev` command.

To build all the packages, use the following command:

```bash
pnpm build
```

To run a dev environment, use this command:

```bash
pnpm dev
```