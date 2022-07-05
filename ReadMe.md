# [Xyte's](https://www.xyte.io/) Agent

## Xyte's agent implemented in NodeJS

### To be used as reference code or\and as an executable agent.

## Executable Agent

### Generating artifacts

* download (\ pull repo updates of) this repo and run `npm install`
* open `src/helpers/constants.ts` and update keys with values generated from Xyte's platform.
* generate distribution files by running `npm run bundle-es`

### Executing

* copy `dist/node-agent-starter.min.js` and `dist/node-agent-main.min.js` to desired installation folder
* given terminal access, type in `node node-agent-starter.min.js`
* open a browser and navigate to your Xyte device dashboard, where you should see telemetries pour in :)

### Caveats

* for envs like `nw.js` use `dist/nw.js.index.html` file and consult the docs of your provider on how to load them.
* this code was tested with NodeJS@18 but may run on older versions.
* please note that `dist/node-agent-starter.min.js` is an auxiliary script, you may run `dist/node-agent-main.min.js`
  directly, but you should be using your preferred tools to ensure that the agent runs continuously.

## Reference Code

* download (\ pull repo updates of) this repo
* for developers who are familiar with:
    * TypeScript: navigate to src and start reading from `main.ts`
    * Modern<sup>*</sup> Javascript: transpiling TS code to JS is needed, which can be achieved by
      running `npm install && npm run build`
      * <sup>*</sup>tsc will transpile typescript code to JS targeting NodeJS@18 and latest JS supported code. if
        you're interested in targeting older NodeJS versions (e.g. for debugging) please refer to the example
        config `./scripts/tsconfig.node10.json`, and try to run tsc with it to produce the desired target.
* optional: open `src/helpers/constants.ts` and update keys with values generated from Xyte's platform. (recommended if
  you're planing on running reference code instead of bundled one)
* you may run reference JS-code by executing: `node lib/main.js`
