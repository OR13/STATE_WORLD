# STATE_WORLD

#### Webpack, TypeScript, Phaser, IPFS, Ethereum, World Building Game

* `webpack`
* `webpack-dev-server` for development & hot module reloading
* `babel` for TypeScript transpiling, including stage 0 support
* `tslint` for code hygiene
* `mocha`, `chai` & `sinon` for testing
* `istanbul` for code coverage
* `phaser`, `pixi.js` and `p2` for the game engine
* `phaser-debug` for improved debugging
* `phaser-glsl-loader` to simplify shader loading
* `typings` for type definitions

## Usage

| Command                 | Description                                 |
|-------------------------|---------------------------------------------|
| `npm start`             | Start a dev server.                         |
| `npm run server`        | Start a dev server.                         |
| `npm run server:reload` | Start a dev server with HMR enabled.        |
| `npm run build`         | Build the production version of the app.    |
| `npm run build:prod`    | Build the production version of the app.    |
| `npm run build:dev`     | Build the developement version of the app.  |
| `npm run test`          | Run the tests.                              |
| `npm run test:watch`    | Run the tests & watch for changes.          |
| `npm run test:coverage` | Run the test coverage analysis.             |
| `npm run lint`          | Lint the code.                              |

Hot Module Replacement doesn't really work with Phaser, so that isn't enabled by default when
starting a dev server.



#### Roadmap

- Ignore Custom Tiles, Build Sprites First.
- save and restore state when transitioning from map to tile.
- implement resources
- add health and attacking
- add basic ship ai
- implement random map generation
- implement wormhole concept
- implement catelogue
- color based resources...
