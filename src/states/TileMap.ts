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


    public preload(): void {

        this.game.load.tilemap('map', 'assets/tilemaps/maps/collision_test.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
        this.game.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
        this.game.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
        this.game.load.image('ship', 'assets/sprites/thrust_ship2.png');

    }

    public create(): void {

        this.game.physics.startSystem(Phaser.Physics.P2JS);

        this.game.stage.backgroundColor = '#2d2d2d';

        this.map = this.game.add.tilemap('map');

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

        
        var bmd = this.game.make.bitmapData(320, 256);

        bmd.copy('customShip');
        bmd.generateTexture("ground_1x1")

        //  Here the sprite uses the BitmapData as a texture
        var custSprite = this.game.add.sprite(300, 300, bmd);


        // this.map.addTilesetImage('custom_tile_1x1');

        //  Add a Tileset image to the map

        this.map.addTilesetImage('ground_1x1');
        this.map.addTilesetImage('walls_1x2');
        this.map.addTilesetImage('tiles2');

        this.layer = this.map.createLayer('Tile Layer 1');

        // here we explore dynamic custom tiles...
        // http://examples.phaser.io/_site/view_full.html?d=tilemaps&f=blank+tilemap.js&t=blank%20tilemap



        this.map.putTile(30, 2, 9, this.layer);
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
        this.ship = this.game.add.sprite(200, 200, 'ship');

        this.game.physics.p2.enable(this.ship);

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
