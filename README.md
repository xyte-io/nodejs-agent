# [Xyte](https://www.xyte.io/) sample device implementation

## Overview
This repository contains a sample implementation of the Xyte [V1 HTTP Device API](https://dev.xyte.io/reference/api-endpoints-1) in TypeScript (JavaScript) and runnable with NodeJS.

The code can be used for reference and sample testing in environments capable of running TypeScript.

## Requirements
* Partner account on Xyte
* Node version 18 or above (* see notes)

## Installation
* Clone / download the repository code
* Edit `src/helpers/constants.ts` and update keys with values generated from the Xyte's platform.
* Open a shell/command-line
* Run `npm install` to install dependencies
* Run `npm run bundle` to build a distribution
  * you'll have to copy the bundle outside of repo folder if they're bundled for an older node version with no es
    modules support
* Copy `dist/node-agent-starter.min.js` and `dist/node-agent-main.min.js` to desired installation folder

## Execution
* Open a shell/command-line
* Run:`node node-agent-starter.min.js`

## Monitoring from Xyte
After a successful execution, the device should appear in the [Partner Portal Device List](https://partners.xyte.io/devices)

The device can be assigned to the Lab Organization automatically created and afterwards accessed via the [Application Portal](https://app.xyte.io/)

### Notes
* For envs like `nw.js` use `dist/nw.js.index.html` file and consult the docs of your provider on how to load them.
* This code was tested with NodeJS@18 but may run on older versions.
* Please note that `dist/node-agent-starter.min.js` is an auxiliary script, you may run `dist/node-agent-main.min.js`
  directly, but you should be using your preferred tools to ensure that the agent runs continuously.

## Development
For easier live development, the code can be execution without building:

* Open a shell/command-line
* Run `npm run run-js`

