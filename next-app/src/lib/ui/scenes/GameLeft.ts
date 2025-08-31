import { Scene } from 'phaser';

export class GameLeft extends Scene {
    camera?: Phaser.Cameras.Scene2D.Camera;
    background?: Phaser.GameObjects.Image;
    gameText?: Phaser.GameObjects.Text;

    constructor() {
        super('GameLeft');
    }

    create() {
        const totalWidth = this.game.scale.width;
        const totalHeight = this.game.scale.height;
        const halfWidth = totalWidth / 2;

        // Configure the main camera to use the left half of the canvas
        this.camera = this.cameras.main;
        this.camera.setViewport(0, 0, halfWidth, totalHeight);
        this.camera.setBackgroundColor(0x113377);

        // Position elements relative to the left half
        const centerX = halfWidth / 2;
        const centerY = totalHeight / 2;

        this.background = this.add.image(centerX, centerY, 'background');
        this.background.setAlpha(0.35);

        this.gameText = this.add.text(centerX, centerY, 'Left Scene', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6, align: 'center'
        }).setOrigin(0.5).setDepth(100);
    }
}

