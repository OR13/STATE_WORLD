

import Boot from './states/Boot';
import Loader from './states/Loader';
import Main from './states/Main';
import TileBuilder from './states/TileBuilder';
import './Game.css';

class Game extends Phaser.Game {

    constructor() {
        super(800, 600, Phaser.CANVAS, 'app', null);
        this.state.add('boot', Boot, false);
        this.state.add('loader', Loader, false);
        this.state.add('main', Main, false);
        this.state.add('tile', TileBuilder, false);
        this.state.start('boot');
    }
}

/* tslint:disable:no-unused-expression */
new Game();
