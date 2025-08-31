import { Scene } from 'phaser';
import { EventBus } from '@/lib/util/EventBus';
import { playerManager, PlayerData } from '@/lib/ui/PlayerManager';

export class GameRight extends Scene {
    camera?: Phaser.Cameras.Scene2D.Camera;
    background?: Phaser.GameObjects.Image;
    gameText?: Phaser.GameObjects.Text;
    players: Record<string, Phaser.GameObjects.Image> = {};
    p1Keys?: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
    p2Keys?: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
    speed = 250;
    door?: Phaser.GameObjects.Rectangle;

    constructor() { super('GameRight'); }

    private spawnPlayer(p: PlayerData) {
        const img = this.add.image(p.x, p.y, p.texture);
        if (p.texture === 'logo') img.setScale(0.5);
        img.setTint(p.tint);
        img.setName(p.id);
        this.players[p.id] = img;
    }

    private handleArrive = (data: PlayerData) => {
        if (data.side !== 'right') return;
        if (this.players[data.id]) return;
        this.spawnPlayer(data);
    };

    private handleDepart = (data: { id: string; side: string }) => {
        if (data.side !== 'right') return;
        const sprite = this.players[data.id];
        if (sprite) { sprite.destroy(); delete this.players[data.id]; }
    };

    create() {
        const totalWidth = this.game.scale.width;
        const totalHeight = this.game.scale.height;
        const halfWidth = totalWidth / 2;

        // Ensure player manager initialized
        playerManager.init(totalWidth, totalHeight);

        this.camera = this.cameras.main;
        this.camera.setViewport(halfWidth, 0, halfWidth, totalHeight);
        this.camera.setBounds(0, 0, halfWidth, totalHeight);
        this.camera.setBackgroundColor(0x772211);

        const centerX = halfWidth / 2;
        const centerY = totalHeight / 2;

        this.background = this.add.image(centerX, centerY, 'background');
        this.background.setDisplaySize(halfWidth, totalHeight).setAlpha(0.35);

        this.gameText = this.add.text(centerX, 40, 'Right Scene', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6, align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Spawn existing right-side players
        playerManager.getPlayersForSide('right').forEach(p => this.spawnPlayer(p));

        // Keys
        this.p1Keys = {
            up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        this.p2Keys = {
            up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Y),
            down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.H),
            left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.G),
            right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.J)
        };

        // Door near left edge (return to left scene)
        const doorWidth = 40; const doorHeight = 140;
        this.door = this.add.rectangle(doorWidth / 2 + 4, totalHeight / 2, doorWidth, doorHeight, 0xaa2244, 0.6)
            .setStrokeStyle(3, 0xffffff)
            .setDepth(50);
        this.add.text(this.door.x, this.door.y - doorHeight / 2 - 16, 'DOOR', { fontFamily: 'Arial', fontSize: 14, color: '#fff' }).setOrigin(0.5);

        EventBus.on('player-arrive', this.handleArrive);
        EventBus.on('player-depart', this.handleDepart);
    }

    update(_time: number, delta: number) {
        const dt = delta / 1000;
        const halfWidth = this.game.scale.width / 2;
        const totalHeight = this.game.scale.height;
        const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

        const move = (player: Phaser.GameObjects.Image | undefined, keys: any, id: 'player1' | 'player2') => {
            if (!player || !keys) return;
            let vx = 0, vy = 0;
            if (keys.left.isDown) vx -= 1;
            if (keys.right.isDown) vx += 1;
            if (keys.up.isDown) vy -= 1;
            if (keys.down.isDown) vy += 1;
            if (vx && vy) { const inv = 1 / Math.sqrt(2); vx *= inv; vy *= inv; }
            player.x += vx * this.speed * dt;
            player.y += vy * this.speed * dt;
            const halfW = player.displayWidth / 2; const halfH = player.displayHeight / 2;
            player.x = clamp(player.x, halfW, halfWidth - halfW);
            player.y = clamp(player.y, halfH, totalHeight - halfH);
            playerManager.updatePosition(id, player.x, player.y);
        };

        move(this.players['player1'], this.p1Keys, 'player1');
        move(this.players['player2'], this.p2Keys, 'player2');

        const checkDoor = (player: Phaser.GameObjects.Image | undefined, id: 'player1' | 'player2') => {
            if (!player || !this.door) return;
            if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), this.door.getBounds())) {
                playerManager.transferPlayer(id, this.game.scale.width, this.game.scale.height);
            }
        };
        checkDoor(this.players['player1'], 'player1');
        checkDoor(this.players['player2'], 'player2');
    }

    shutdown() {
        EventBus.removeListener('player-arrive', this.handleArrive);
        EventBus.removeListener('player-depart', this.handleDepart);
    }

    destroy() {
        EventBus.removeListener('player-arrive', this.handleArrive);
        EventBus.removeListener('player-depart', this.handleDepart);
    }
}
