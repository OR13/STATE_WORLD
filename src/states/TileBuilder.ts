
//  Dimensions
var previewSize = 6;
var spriteWidth = 8;
var spriteHeight = 8;

//  UI
var ui;
var paletteArrow;
var coords;
var widthText;
var widthUp;
var widthDown;
var heightText;
var heightUp;
var heightDown;
var previewSizeUp;
var previewSizeDown;
var previewSizeText;
var nextFrameButton;
var prevFrameButton;
var frameText;
var saveIcon;
var saveText;
var rightCol = 532;

//  Drawing Area
var canvas;
var canvasBG;
var canvasGrid;
var canvasSprite;
var canvasZoom = 32;

//  Sprite Preview
var preview;
var previewBG;

//  Keys + Mouse
var keys;
var isDown = false;
var isErase = false;

//  Palette
var ci = 0;
var color = 0;
var palette = 0;
var pmap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

//  Data
var frame = 1;
var frames = [[]];

var data;
var colorIndex;

/**
 * The TileBuilder state is where the player can create or edit a tile.
 */


class TileBuilder extends Phaser.State {

    public create(): void {

        document.body.oncontextmenu = function () { return false; };

        Phaser.Canvas.setUserSelect(this.game.canvas, 'none');
        Phaser.Canvas.setTouchAction(this.game.canvas, 'none');

        this.game.stage.backgroundColor = '#505050';

        this.createUI();
        this.createDrawingArea();
        this.createPreview();
        this.createEventListeners();

        this.resetData();
        this.setColor(2, undefined);



    }


    public resetData = () => {

        data = [];

        for (var y = 0; y < spriteHeight; y++) {
            var a = [];

            for (var x = 0; x < spriteWidth; x++) {
                a.push('.');
            }

            data.push(a);
        }

    }

    public copyToData = (src) => {

        data = [];

        for (var y = 0; y < src.length; y++) {
            var a = [];

            for (var x = 0; x < src[y].length; x++) {
                a.push(src[y][x]);
            }

            data.push(a);
        }

    }

    public cloneData = () => {

        var clone = [];

        for (var y = 0; y < data.length; y++) {
            var a = [];

            for (var x = 0; x < data[y].length; x++) {
                var v = data[y][x];
                a.push(v);
            }

            clone.push(a);
        }

        return clone;

    }

    public createUI = () => {

        this.game.create.grid('uiGrid', 32 * 16, 32, 32, 32, 'rgba(255,255,255,0.5)');

        //  Create some icons
        var arrow = [
            '  22  ',
            ' 2222 ',
            '222222',
            '  22  ',
            '  22  '
        ];

        var plus = [
            '2222222',
            '2.....2',
            '2..2..2',
            '2.222.2',
            '2..2..2',
            '2.....2',
            '2222222'
        ];

        var minus = [
            '2222222',
            '2.....2',
            '2.....2',
            '2.222.2',
            '2.....2',
            '2.....2',
            '2222222'
        ];

        var disk = [
            'DDDDDDDDDD',
            'DED1111DED',
            'DED1111DDD',
            'DEDDDDDDED',
            'DEEEEEEEED',
            'DEFFFFFFED',
            'DEFF222FED',
            'DEFF222FED',
            'DEFF222FED',
            'DDDDDDDDDD'
        ];

    
        this.game.create.texture('arrow', arrow, 2);
        this.game.create.texture('plus', plus, 3);
        this.game.create.texture('minus', minus, 3);
        this.game.create.texture('save', disk, 4);

        ui = this.game.make.bitmapData(800, 32);

        this.drawPalette();

        ui.addToWorld();

        var style = { font: "20px Courier", fill: "#fff", tabs: 80 };

        coords = this.game.add.text(rightCol, 8, "X: 0\tY: 0", style);

        this.game.add.text(12, 9, pmap.join("\t"), { font: "14px Courier", fill: "#000", tabs: 32 });
        this.game.add.text(11, 8, pmap.join("\t"), { font: "14px Courier", fill: "#ffff00", tabs: 32 });

        paletteArrow = this.game.add.sprite(8, 36, 'arrow');

        //  Change width

        widthText = this.game.add.text(rightCol, 60, "Width: " + spriteWidth, style);

        widthUp = this.game.add.sprite(rightCol + 180, 60, 'plus');
        widthUp.name = 'width';
        widthUp.inputEnabled = true;
        widthUp.input.useHandCursor = true;
        widthUp.events.onInputDown.add(this.increaseSize, this);

        widthDown = this.game.add.sprite(rightCol + 220, 60, 'minus');
        widthDown.name = 'width';
        widthDown.inputEnabled = true;
        widthDown.input.useHandCursor = true;
        widthDown.events.onInputDown.add(this.decreaseSize, this);

        //  Change height

        heightText = this.game.add.text(rightCol, 100, "Height: " + spriteHeight, style);

        heightUp = this.game.add.sprite(rightCol + 180, 100, 'plus');
        heightUp.name = 'height';
        heightUp.inputEnabled = true;
        heightUp.input.useHandCursor = true;
        heightUp.events.onInputDown.add(this.increaseSize, this);

        heightDown = this.game.add.sprite(rightCol + 220, 100, 'minus');
        heightDown.name = 'height';
        heightDown.inputEnabled = true;
        heightDown.input.useHandCursor = true;
        heightDown.events.onInputDown.add(this.decreaseSize, this);

        //  Change frame

        frameText = this.game.add.text(rightCol, 160, "Frame: " + frame + " / " + frames.length, style);

        nextFrameButton = this.game.add.sprite(rightCol + 180, 160, 'plus');
        nextFrameButton.inputEnabled = true;
        nextFrameButton.input.useHandCursor = true;
        nextFrameButton.events.onInputDown.add(this.nextFrame, this);

        prevFrameButton = this.game.add.sprite(rightCol + 220, 160, 'minus');
        prevFrameButton.inputEnabled = true;
        prevFrameButton.input.useHandCursor = true;
        prevFrameButton.events.onInputDown.add(this.prevFrame, this);

        //  Change preview

        previewSizeText = this.game.add.text(rightCol, 220, "Size: " + previewSize, style);

        previewSizeUp = this.game.add.sprite(rightCol + 180, 220, 'plus');
        previewSizeUp.inputEnabled = true;
        previewSizeUp.input.useHandCursor = true;
        previewSizeUp.events.onInputDown.add(this.increasePreviewSize, this);

        previewSizeDown = this.game.add.sprite(rightCol + 220, 220, 'minus');
        previewSizeDown.inputEnabled = true;
        previewSizeDown.input.useHandCursor = true;
        previewSizeDown.events.onInputDown.add(this.decreasePreviewSize, this);

        //  Save Icon

        saveText = this.game.add.text(rightCol, 520, "Saved to console.log", style);
        saveText.alpha = 0;

        saveIcon = this.game.add.sprite(750, 550, 'save');
        saveIcon.inputEnabled = true;
        saveIcon.input.useHandCursor = true;
        saveIcon.events.onInputDown.add(this.save, this);

    }

    public createDrawingArea = () => {

        this.game.create.grid('drawingGrid', 16 * canvasZoom, 16 * canvasZoom, canvasZoom, canvasZoom, 'rgba(0,191,243,0.8)');

        canvas = this.game.make.bitmapData(spriteWidth * canvasZoom, spriteHeight * canvasZoom);
        canvasBG = this.game.make.bitmapData(canvas.width + 2, canvas.height + 2);

        canvasBG.rect(0, 0, canvasBG.width, canvasBG.height, '#fff');
        canvasBG.rect(1, 1, canvasBG.width - 2, canvasBG.height - 2, '#3f5c67');

        var x = 10;
        var y = 64;

        canvasBG.addToWorld(x, y);
        canvasSprite = canvas.addToWorld(x + 1, y + 1);
        canvasGrid = this.game.add.sprite(x + 1, y + 1, 'drawingGrid');
        canvasGrid.crop(new Phaser.Rectangle(0, 0, spriteWidth * canvasZoom, spriteHeight * canvasZoom));

    }

    public resizeCanvas = () => {

        canvas.resize(spriteWidth * canvasZoom, spriteHeight * canvasZoom);
        canvasBG.resize(canvas.width + 2, canvas.height + 2);

        canvasBG.rect(0, 0, canvasBG.width, canvasBG.height, '#fff');
        canvasBG.rect(1, 1, canvasBG.width - 2, canvasBG.height - 2, '#3f5c67');

        canvasGrid.crop(new Phaser.Rectangle(0, 0, spriteWidth * canvasZoom, spriteHeight * canvasZoom));

    }

    public createPreview = () => {

        preview = this.game.make.bitmapData(spriteWidth * previewSize, spriteHeight * previewSize);
        previewBG = this.game.make.bitmapData(preview.width + 2, preview.height + 2);

        previewBG.rect(0, 0, previewBG.width, previewBG.height, '#fff');
        previewBG.rect(1, 1, previewBG.width - 2, previewBG.height - 2, '#3f5c67');

        var x = rightCol;
        var y = 250;

        previewBG.addToWorld(x, y);
        preview.addToWorld(x + 1, y + 1);

    }

    public resizePreview = () => {

        preview.resize(spriteWidth * previewSize, spriteHeight * previewSize);
        previewBG.resize(preview.width + 2, preview.height + 2);

        previewBG.rect(0, 0, previewBG.width, previewBG.height, '#fff');
        previewBG.rect(1, 1, previewBG.width - 2, previewBG.height - 2, '#3f5c67');

    }

    public refresh = () => {

        //  Update both the Canvas and Preview
        canvas.clear();
        preview.clear();

        for (var y = 0; y < spriteHeight; y++) {
            for (var x = 0; x < spriteWidth; x++) {
                var i = data[y][x];

                if (i !== '.' && i !== ' ') {
                    color = this.game.create.palettes[palette][i];
                    canvas.rect(x * canvasZoom, y * canvasZoom, canvasZoom, canvasZoom, color);
                    preview.rect(x * previewSize, y * previewSize, previewSize, previewSize, color);
                }
            }
        }

    }

    public createEventListeners = () => {

        keys = this.game.input.keyboard.addKeys(
            {
                'erase': Phaser.Keyboard.X,
                'save': Phaser.Keyboard.S,
                'up': Phaser.Keyboard.UP,
                'down': Phaser.Keyboard.DOWN,
                'left': Phaser.Keyboard.LEFT,
                'right': Phaser.Keyboard.RIGHT,
                'changePalette': Phaser.Keyboard.P,
                'nextFrame': Phaser.Keyboard.PERIOD,
                'prevFrame': Phaser.Keyboard.COMMA,
                'color0': Phaser.Keyboard.ZERO,
                'color1': Phaser.Keyboard.ONE,
                'color2': Phaser.Keyboard.TWO,
                'color3': Phaser.Keyboard.THREE,
                'color4': Phaser.Keyboard.FOUR,
                'color5': Phaser.Keyboard.FIVE,
                'color6': Phaser.Keyboard.SIX,
                'color7': Phaser.Keyboard.SEVEN,
                'color8': Phaser.Keyboard.EIGHT,
                'color9': Phaser.Keyboard.NINE,
                'color10': Phaser.Keyboard.A,
                'color11': Phaser.Keyboard.B,
                'color12': Phaser.Keyboard.C,
                'color13': Phaser.Keyboard.D,
                'color14': Phaser.Keyboard.E,
                'color15': Phaser.Keyboard.F
            }
        );

        keys.erase.onDown.add(this.cls, this);
        keys.save.onDown.add(this.save, this);
        keys.up.onDown.add(this.shiftUp, this);
        keys.down.onDown.add(this.shiftDown, this);
        keys.left.onDown.add(this.shiftLeft, this);
        keys.right.onDown.add(this.shiftRight, this);
        keys.changePalette.onDown.add(this.changePalette, this);
        keys.nextFrame.onDown.add(this.nextFrame, this);
        keys.prevFrame.onDown.add(this.prevFrame, this);

        for (var i = 0; i < 16; i++) {
            keys['color' + i].onDown.add(this.setColor, this, 0, i);
        }

        this.game.input.mouse.capture = true;
        this.game.input.onDown.add(this.onDown, this);
        this.game.input.onUp.add(this.onUp, this);
        this.game.input.addMoveCallback(this.paint, this);

    }

    public cls = () => {

        this.resetData();
        this.refresh();

    }

    public nextFrame = () => {

        //  Save current frame
        frames[frame - 1] = this.cloneData();

        frame++;

        if (frames[frame - 1]) {
            this.copyToData(frames[frame - 1]);
        }
        else {
            frames.push(null);
            this.resetData();
        }

        this.refresh();

        frameText.text = "Frame: " + frame + " / " + frames.length;

    }

    public prevFrame = () => {

        if (frame === 1) {
            return;
        }

        //  Save current frame
        frames[frame - 1] = this.cloneData();

        frame--;

        //  Load old frame
        this.copyToData(frames[frame - 1]);

        this.refresh();

        frameText.text = "Frame: " + frame + " / " + frames.length;

    }

    public drawPalette = () => {

        //  Draw the palette to the UI bmd
        ui.clear(0, 0, 32 * 16, 32);

        var x = 0;

        for (var clr in this.game.create.palettes[palette]) {
            ui.rect(x, 0, 32, 32, this.game.create.palettes[palette][clr]);
            x += 32;
        }

        ui.copy('uiGrid');

    }

    public changePalette = () => {

        palette++;

        if (!this.game.create.palettes[palette]) {
            palette = 0;
        }

        this.drawPalette();
        this.refresh();

    }

    public setColor = (i, p) => {

        if (typeof p !== 'undefined') {
            //  It came from a Keyboard Event, in which case the color index is in p, not i.
            i = p;
        }

        if (i < 0) {
            i = 15;
        }
        else if (i >= 16) {
            i = 0;
        }

        colorIndex = i;
        color = this.game.create.palettes[palette][pmap[colorIndex]];

        paletteArrow.x = (i * 32) + 8;

    }

    public nextColor = () => {

        var i = colorIndex + 1;
        this.setColor(i, undefined);

    }

    public prevColor = () => {

        var i = colorIndex - 1;
        this.setColor(i, undefined);

    }

    public increaseSize = (sprite) => {

        if (sprite.name === 'width') {
            if (spriteWidth === 16) {
                return;
            }

            spriteWidth++;
        }
        else if (sprite.name === 'height') {
            if (spriteHeight === 16) {
                return;
            }

            spriteHeight++;
        }

        this.resetData();
        this.resizeCanvas();
        this.resizePreview();

        widthText.text = "Width: " + spriteWidth;
        heightText.text = "Height: " + spriteHeight;

    }

    public decreaseSize = (sprite) => {

        if (sprite.name === 'width') {
            if (spriteWidth === 4) {
                return;
            }

            spriteWidth--;
        }
        else if (sprite.name === 'height') {
            if (spriteHeight === 4) {
                return;
            }

            spriteHeight--;
        }

        this.resetData();
        this.resizeCanvas();
        this.resizePreview();

        widthText.text = "Width: " + spriteWidth;
        heightText.text = "Height: " + spriteHeight;

    }

    public increasePreviewSize = () => {

        if (previewSize === 16) {
            return;
        }

        previewSize++;
        previewSizeText.text = "Size: " + previewSize;

        this.resizePreview();
        this.refresh();

    }

    public decreasePreviewSize = () => {

        if (previewSize === 1) {
            return;
        }

        previewSize--;
        previewSizeText.text = "Size: " + previewSize;

        this.resizePreview();
        this.refresh();

    }



    public save = () => {

        //  Save current frame
        frames[frame - 1] = this.cloneData();

        var output = "";

        for (var f = 0; f < frames.length; f++) {
            var src = frames[f];

            if (src === null) {
                continue;
            }

            output = output.concat("var frame" + f + " = [\n");

            for (var y = 0; y < src.length; y++) {
                output = output.concat("\t'");
                output = output.concat(src[y].join(''));

                if (y < src.length - 1) {
                    output = output.concat("',\n");
                }
                else {
                    output = output.concat("'\n");
                }
            }

            output = output.concat("];\n");
            output = output.concat("this.game.create.texture('yourKey', frame" + f + ", " + previewSize + ", " + previewSize + ", " + palette + ");\n");

        }

        console.log(output);

        saveText.alpha = 1;
        this.game.add.tween(saveText).to({ alpha: 0 }, 2000, "Linear", true);

    }

    public shiftLeft = () => {

        canvas.moveH(-canvasZoom);
        preview.moveH(-previewSize);

        for (var y = 0; y < spriteHeight; y++) {
            var r = data[y].shift();
            data[y].push(r);
        }

    }

    public shiftRight = () => {

        canvas.moveH(canvasZoom);
        preview.moveH(previewSize);

        for (var y = 0; y < spriteHeight; y++) {
            var r = data[y].pop();
            data[y].splice(0, 0, r);
        }

    }

    public shiftUp = () => {

        canvas.moveV(-canvasZoom);
        preview.moveV(-previewSize);

        var top = data.shift();
        data.push(top);

    }

    public shiftDown = () => {

        canvas.moveV(canvasZoom);
        preview.moveV(previewSize);

        var bottom = data.pop();
        data.splice(0, 0, bottom);

    }

    public onDown = (pointer) => {


        if (pointer.y <= 32) {
            var g: any = this.game;
            this.setColor(g.math.snapToFloor(pointer.x, 32) / 32, undefined);
        }
        else {
            isDown = true;

            if (pointer.rightButton.isDown) {
                isErase = true;
            }
            else {
                isErase = false;
            }

            this.paint(pointer);
        }

    }

    public onUp = () => {
        isDown = false;
    }

    public paint = (pointer) => {

        var g: any = this.game;
        //  Get the grid loc from the pointer
        var x = g.math.snapToFloor(pointer.x - canvasSprite.x, canvasZoom) / canvasZoom;
        var y = g.math.snapToFloor(pointer.y - canvasSprite.y, canvasZoom) / canvasZoom;

        if (x < 0 || x >= spriteWidth || y < 0 || y >= spriteHeight) {
            return;
        }

        coords.text = "X: " + x + "\tY: " + y;

        // console.log('painting...')

        if (!isDown) {
            return;
        }

        if (isErase) {
            data[y][x] = '.';
            canvas.clear(x * canvasZoom, y * canvasZoom, canvasZoom, canvasZoom, color);
            preview.clear(x * previewSize, y * previewSize, previewSize, previewSize, color);
        }
        else {
            data[y][x] = pmap[colorIndex];
            canvas.rect(x * canvasZoom, y * canvasZoom, canvasZoom, canvasZoom, color);
            preview.rect(x * previewSize, y * previewSize, previewSize, previewSize, color);
        }

    }
}

export default TileBuilder;

