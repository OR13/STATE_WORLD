/**
 * The TileMap state is responsible for the world map.
 */


//   var dataURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
//         // download a png...
//         // var download: any = document.createElement('a');
//         // download.href = dataURI
//         // download.download = 'reddot.png';
//         // download.click();

//         var data = new Image();
//         data.src = dataURI;
//         this.game.cache.addImage('image-data', dataURI, data);
//         var dotSprite = this.game.add.sprite(128, 256, 'image-data');
//         this.game.physics.p2.enable(dotSprite);

class TileMap extends Phaser.State {


    public ship;
    public map;
    public layer;
    public cursors;

    public custSprite;

    public preload(): void {

        this.game.load.tilemap('map', 'assets/tilemaps/maps/state_world_zero.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
        this.game.load.image('custom_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
        this.game.load.image('ship', 'assets/sprites/thrust_ship2.png');

    }

    public create(): void {

        this.game.physics.startSystem(Phaser.Physics.P2JS);

        this.game.stage.backgroundColor = '#2d2d2d';

        this.map = this.game.add.tilemap('map');

        var g: any = this.game

        // console.log('this.game.customTileArray', g.customTileArray)

        var customTile = g.customTileArray || [
            '................',
            '................',
            '................',
            '.....9999.......',
            '...9999C999.....',
            '...99CCCC99.....',
            '...9C000099.....',
            '...9C0000CC.....',
            '....CC000CC.....',
            '.....CCCCCC.....',
            '.....CCCCCC.....',
            '......CCC.......',
            '................',
            '................',
            '................',
            '................'
        ];

        var customShip = [
            '......0330......',
            '.....036630.....',
            '....03655630....',
            '....03655630....',
            '....63655636....',
            '....63055036....',
            '....63655636....',
            '....63655636....',
            '...0636556360...',
            '.00635555553600.',
            '0063555555553600',
            '4635555555555364',
            '4445554444555444',
            '8885558888555888',
            '................',
            '................'
        ];

        this.game.create.texture('customShip', customShip, 2, 2, 0);

        this.game.create.texture('customTile', customTile, 2, 2, 0);

        var bmd = this.game.make.bitmapData(32, 32);
        bmd.copy('customTile');
        bmd.generateTexture("custom_1x1")


        this.custSprite = this.game.add.sprite(200, 200, 'customShip');
        this.custSprite.inputEnabled = true;
        this.custSprite.events.onInputDown.add((pointer) => {
            console.log('clicked on custSprite...', pointer);
            this.game.state.start('tile');
        }, this);


        this.map.addTilesetImage('ground_1x1');
        this.map.addTilesetImage('custom_1x1');

        this.layer = this.map.createLayer('Tile Layer 1');

        // here we explore dynamic custom tiles...
        // http://examples.phaser.io/_site/view_full.html?d=tilemaps&f=blank+tilemap.js&t=blank%20tilemap

        this.map.putTile(1, 0, 0, this.layer);
        // this.map.putTile(30, 3, 9, this.layer);
        // this.map.putTile(30, 4, 9, this.layer);

        this.layer.resizeWorld();

        //  Set the tiles for collision.
        //  Do this BEFORE generating the p2 bodies below.
        this.map.setCollisionBetween(1, 12);

        //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
        //  This call returns an array of body objects which you can perform addition actions on if
        //  required. There is also a parameter to control optimising the map build.
        this.game.physics.p2.convertTilemap(this.map, this.layer);

        // this.ship = this.game.add.sprite(200, 200, 'customShip');
        this.ship = this.game.add.sprite(100, 200, 'ship');

        this.ship.inputEnabled = true;

        this.ship.events.onInputDown.add((pointer) => {
            console.log('clicked on ship...', pointer);
        }, this);

        this.game.physics.p2.enable(this.ship);

        this.game.physics.p2.enable(this.custSprite);

        this.game.camera.follow(this.ship);

        //  By default the ship will collide with the World bounds,
        //  however because you have changed the size of the world (via layer.resizeWorld) to match the tilemap
        //  you need to rebuild the physics world boundary as well. The following
        //  line does that. The first 4 parameters control if you need a boundary on the left, right, top and bottom of your world.
        //  The final parameter (false) controls if the boundary should use its own collision group or not. In this case we don't require
        //  that, so it's set to false. But if you had custom collision groups set-up then you would need this set to true.
        this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

        //  Even after the world boundary is set-up you can still toggle if the ship collides or not with this:
        // ship.body.collideWorldBounds = false;

        this.cursors = this.game.input.keyboard.createCursorKeys();

    }



    public update() {

        var game = this.game;

        game.input.onTap.add((pointer, isDoubleClick) => {

            if (isDoubleClick) {

                //Tiles world coordinates:   
                var tileworldX = pointer.worldX - (pointer.worldX % 64);
                var tileworldY = pointer.worldY - (pointer.worldY % 64);

                //click at 100, 200 world give you 64, 192    

                //Tiles coordinates in the grid coords (eg 4 tiles across, 7 down):    
                var tileX = pointer.worldX / 64;
                var tileY = pointer.worldY / 64;
                //click at 100, 200 world give you 1, 3}

                console.log(tileworldX, tileworldY, tileX, tileY)

                //  console.log(Phaser.Rectangle.contains(this.ship.body, game.input.x, game.input.y))
            }

        });


        // if (game.input.mousePointer.isDown) {
        //     //  400 is the speed it will move towards the mouse
        //     game.physics.arcade.moveToPointer(this.ship, 400);

        //     //  if it's overlapping the mouse, don't move any more
        //     if (this.ship.body && Phaser.Rectangle.contains(this.ship.body, game.input.x, game.input.y)) {
        //         this.ship.body.velocity.setTo(0, 0);
        //     }
        // }
        // else {
        //     // this.ship.body.velocity.setTo(0, 0);
        // }

        if (this.cursors.left.isDown) {
            this.ship.body.rotateLeft(100);
        }
        else if (this.cursors.right.isDown) {
            this.ship.body.rotateRight(100);
        }
        else {
            this.ship.body.setZeroRotation();
        }

        if (this.cursors.up.isDown) {
            this.ship.body.thrust(400);
        }
        else if (this.cursors.down.isDown) {
            this.ship.body.reverse(400);
        }

    }

    public render() {

    }

}

export default TileMap;
