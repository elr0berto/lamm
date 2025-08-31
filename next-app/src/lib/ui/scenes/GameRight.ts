import { Scene } from 'phaser';

export class GameRight extends Scene {
    camera?: Phaser.Cameras.Scene2D.Camera;
    background?: Phaser.GameObjects.Image;
    gameText?: Phaser.GameObjects.Text;

    constructor() {
        super('GameRight');
    }

    create() {
        const totalWidth = this.game.scale.width;
        const totalHeight = this.game.scale.height;
        const halfWidth = totalWidth / 2;

        this.camera = this.cameras.main;
        this.camera.setViewport(halfWidth, 0, halfWidth, totalHeight);
        this.camera.setBounds(0, 0, halfWidth, totalHeight); // limit camera to its own logical world
        this.camera.setBackgroundColor(0x772211);

        // World coordinates for this scene are 0..halfWidth, so center is halfWidth/2
        const centerX = halfWidth / 2;
        const centerY = totalHeight / 2;

        this.background = this.add.image(centerX, centerY, 'background');
        // Scale background to fill the half viewport (optional)
        this.background.setDisplaySize(halfWidth, totalHeight).setAlpha(0.35);

        this.gameText = this.add.text(centerX, centerY, 'Right Scene', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6, align: 'center'
        }).setOrigin(0.5).setDepth(100);
    }
}
