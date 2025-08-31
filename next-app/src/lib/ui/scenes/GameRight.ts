import { Scene } from 'phaser';
import { EventBus } from '@/lib/util/EventBus';

export class GameRight extends Scene {
    camera?: Phaser.Cameras.Scene2D.Camera;
    background?: Phaser.GameObjects.Image;
    gameText?: Phaser.GameObjects.Text;
    players: Record<string, Phaser.GameObjects.Image> = {};
    p1Keys?: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
    p2Keys?: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
    speed = 250;
    received: Set<string> = new Set();
    returnDoor?: Phaser.GameObjects.Rectangle;

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

        this.gameText = this.add.text(centerX, 40, 'Right Scene', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6, align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Setup key bindings (same keys as left scene)
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

        // Create return door near left edge of this half (x ≈ 0)
        const doorWidth = 40;
        const doorHeight = 140;
        this.returnDoor = this.add.rectangle(doorWidth / 2 + 4, totalHeight / 2, doorWidth, doorHeight, 0xaa2244, 0.6)
            .setStrokeStyle(3, 0xffffff)
            .setDepth(50);
        this.add.text(this.returnDoor.x, this.returnDoor.y - doorHeight / 2 - 16, 'DOOR', { fontFamily: 'Arial', fontSize: 14, color: '#fff' }).setOrigin(0.5);

        // Listen for transfers
        EventBus.on('player-transfer', this.onPlayerTransfer, this);
    }

    onPlayerTransfer(data: { id: string; texture: string; tint: number; from?: string }) {
        // Only spawn if coming from left OR (re)coming from left after previously leaving
        if (data.from && data.from !== 'left') return; // ignore echoes from our own emits
        if (this.received.has(data.id)) return; // prevent duplicate spawn while present
        const halfWidth = this.game.scale.width / 2;
        const totalHeight = this.game.scale.height;
        const spawnX = halfWidth - 80; // spawn near the right scene door (mirrors left side logic)
        const spawnY = totalHeight / 2 + (data.id === 'player1' ? -60 : 60);
        const img = this.add.image(spawnX, spawnY, data.texture);
        img.setTint(data.tint);
        if (data.texture === 'logo') img.setScale(0.5);
        img.setName(data.id);
        this.players[data.id] = img;
        this.received.add(data.id);
    }

    update(_time: number, delta: number) {
        const dt = delta / 1000;
        const halfWidth = this.game.scale.width / 2;
        const totalHeight = this.game.scale.height;
        const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

        const move = (player: Phaser.GameObjects.Image | undefined, keys: any) => {
            if (!player || !keys) return;
            let vx = 0, vy = 0;
            if (keys.left.isDown) vx -= 1;
            if (keys.right.isDown) vx += 1;
            if (keys.up.isDown) vy -= 1;
            if (keys.down.isDown) vy += 1;
            if (vx && vy) { const inv = 1/Math.sqrt(2); vx*=inv; vy*=inv; }
            player.x += vx * this.speed * dt;
            player.y += vy * this.speed * dt;
            const halfW = player.displayWidth / 2;
            const halfH = player.displayHeight / 2;
            player.x = clamp(player.x, halfW, halfWidth - halfW);
            player.y = clamp(player.y, halfH, totalHeight - halfH);
        };

        move(this.players['player1'], this.p1Keys);
        move(this.players['player2'], this.p2Keys);

        // Check return door collisions
        const checkDoor = (player: Phaser.GameObjects.Image | undefined, id: 'player1' | 'player2') => {
            if (!player || !this.returnDoor) return;
            const pb = player.getBounds();
            const db = this.returnDoor.getBounds();
            if (Phaser.Geom.Intersects.RectangleToRectangle(pb, db)) {
                EventBus.emit('player-transfer', {
                    id,
                    texture: (player as any).texture?.key || 'star',
                    tint: (player as any).tintTopLeft ?? 0xffffff,
                    from: 'right'
                });
                player.destroy();
                delete this.players[id];
                this.received.delete(id); // allow re-entry later
            }
        };

        checkDoor(this.players['player1'], 'player1');
        checkDoor(this.players['player2'], 'player2');
    }

    shutdown() {
        EventBus.removeListener('player-transfer', this.onPlayerTransfer, this);
    }

    destroy() {
        EventBus.removeListener('player-transfer', this.onPlayerTransfer, this);
    }
}
