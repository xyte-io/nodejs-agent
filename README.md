# [Xyte](https://www.xyte.io/) sample device implementation

## Overview

This repository contains a sample implementation of the
Xyte [V1 HTTP Device API](https://dev.xyte.io/reference/api-endpoints-1) in TypeScript (JavaScript) and runnable with
NodeJS.

This code is only intended to be used as a demo of an Xyte agent.

## Requirements

* Partner account on Xyte
* [Node version 18.5](https://nodejs.org/en/blog/vulnerability/july-2022-security-releases/) or above (* see notes for older version support)

## Installation

1. Clone / download the repository code 
2. Edit `src/helpers/constants.ts` and setup values for the current device (each device should have its own unique values):
   1. Hardware key generated from the `Hardware Keys` tab under "Product -> Models -> Model -> Hardware Keys", on the [Partner Portal](https://partners.xyte.io/models). 
   2. Cloud ID 
   3. Firmware version 
   4. Optional friendly name given to the devices 
3. Open a shell/command-line 
4. Run `npm install` to install dependencies 
5. Run `npm run bundle` to build a distribution
   1. (Copy the bundle outside of repo folder if they're bundled for an older node version with no es modules support) 
6. Copy `dist/node-agent-starter.min.js` and `dist/node-agent-main.min.js` to desired installation folder

## Execution

* Open a shell/command-line
* Run:`node node-agent-starter.min.js`

## Monitoring from Xyte

After a successful execution, the device should appear in
the [Partner Portal Device List](https://partners.xyte.io/devices)

The device can be assigned to the Lab Organization automatically created and afterwards accessed via
the [Application Portal](https://app.xyte.io/)

### Notes

* For envs like `nw.js` use `dist/nw.js.index.html` file and consult the docs of your provider on how to load them.
* This code was tested with NodeJS@18.5 but may run on older versions.
* Please note that `dist/node-agent-starter.min.js` is an auxiliary script, you may run `dist/node-agent-main.min.js`
  directly, but you should be using your preferred tools to ensure that the agent runs continuously.

## Development

For easier live development, the code can be executed without bundling & minification:

* Open a shell/command-line
* Execute:
  * If you prefer editing TS code:
    * If you prefer running with TS-Node: `npm run dev`
    * If you prefer running JS: `npm run dev:js`
  * If you prefer editing JS code:
    * Build (`npm run dev`) and then copy the output (`./lib`) to your workspace, you may use a library like `nodemon` for file watching.
* please search the project for `TODO` comments and console logs, they are there for you to let you know that something
  needs to be implemented. We did our best to localize those `TODO`s in two files: `src/helpers/constants.ts`
  and `src/todos.ts`. the latter for implementing device functionalities. 