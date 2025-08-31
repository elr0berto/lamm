import { Scene } from 'phaser';
import { EventBus } from '@/lib/util/EventBus';

export class GameLeft extends Scene {
    camera?: Phaser.Cameras.Scene2D.Camera;
    background?: Phaser.GameObjects.Image;
    gameText?: Phaser.GameObjects.Text;
    // Added player objects
    player1?: Phaser.GameObjects.Image;
    player2?: Phaser.GameObjects.Image;
    // Keyboard keys
    p1Keys?: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
    p2Keys?: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
    speed: number = 250; // pixels per second
    door?: Phaser.GameObjects.Rectangle;
    player1Transferred = false;
    player2Transferred = false;

    constructor() {
        super('GameLeft');
    }

    onPlayerTransferFromRight(data: { id: string; texture: string; tint: number; from?: string }) {
        if (data.from !== 'right') return;
        const totalWidth = this.game.scale.width;
        const totalHeight = this.game.scale.height;
        const halfWidth = totalWidth / 2;
        // Spawn just inside the door area (a bit left of the door)
        const spawnX = halfWidth - 80;
        const spawnY = totalHeight / 2 + (data.id === 'player1' ? -60 : 60);
        const tex = data.texture || (data.id === 'player2' ? 'logo' : 'star');
        const img = this.add.image(spawnX, spawnY, tex);
        if (tex === 'logo') img.setScale(0.5);
        img.setTint(data.tint ?? 0xffffff);
        if (data.id === 'player1') {
            this.player1 = img;
            this.player1Transferred = false;
        } else {
            this.player2 = img;
            this.player2Transferred = false;
        }
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

        this.gameText = this.add.text(centerX, 40, 'Left Scene', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6, align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Create players (reuse existing loaded images: star & logo)
        this.player1 = this.add.image(centerX - 100, centerY, 'star');
        this.player2 = this.add.image(centerX + 100, centerY, 'logo').setScale(0.5);
        this.player1.setName('Player1');
        this.player2.setName('Player2');

        // Subtle tint so they look distinct
        this.player1.setTint(0xffdd55);
        this.player2.setTint(0x55ddff);

        // Setup keyboard controls
        // Player 1: WASD
        this.p1Keys = {
            up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };

        // Player 2: Y (up), H (down), G (left), J (right) - assumption based on provided GHJY set
        // If a different mapping is desired we can adjust easily.
        this.p2Keys = {
            up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Y),
            down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.H),
            left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.G),
            right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.J)
        };

        // Create door near right edge of left half
        const doorWidth = 40;
        const doorHeight = 140;
        this.door = this.add.rectangle(halfWidth - doorWidth / 2 - 4, totalHeight / 2, doorWidth, doorHeight, 0x22aa44, 0.6)
            .setStrokeStyle(3, 0xffffff)
            .setDepth(50);
        this.add.text(this.door.x, this.door.y - doorHeight / 2 - 16, 'DOOR', { fontFamily: 'Arial', fontSize: 14, color: '#fff' }).setOrigin(0.5);

        EventBus.on('player-transfer', this.onPlayerTransferFromRight, this);
    }

    update(time: number, delta: number) {
        const dt = delta / 1000; // convert to seconds
        const halfWidth = this.game.scale.width / 2;
        const totalHeight = this.game.scale.height;

        const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

        const movePlayer = (player: Phaser.GameObjects.Image | undefined, keys: any) => {
            if (!player || !keys) return;
            let vx = 0, vy = 0;
            if (keys.left.isDown) vx -= 1;
            if (keys.right.isDown) vx += 1;
            if (keys.up.isDown) vy -= 1;
            if (keys.down.isDown) vy += 1;
            // Normalize diagonal
            if (vx !== 0 && vy !== 0) {
                const inv = 1 / Math.sqrt(2);
                vx *= inv; vy *= inv;
            }
            player.x += vx * this.speed * dt;
            player.y += vy * this.speed * dt;
            // Clamp inside left half viewport
            const halfW = player.displayWidth / 2;
            const halfH = player.displayHeight / 2;
            player.x = clamp(player.x, halfW, halfWidth - halfW);
            player.y = clamp(player.y, halfH, totalHeight - halfH);
        };

        // Move players only if not transferred
        if (!this.player1Transferred) {
            movePlayer(this.player1, this.p1Keys);
        }
        if (!this.player2Transferred) {
            movePlayer(this.player2, this.p2Keys);
        }

        // Door overlap detection
        const checkDoor = (player: Phaser.GameObjects.Image | undefined, id: 'player1' | 'player2') => {
            if (!player || !this.door) return;
            if ((id === 'player1' && this.player1Transferred) || (id === 'player2' && this.player2Transferred)) return;
            const pb = player.getBounds();
            const db = this.door.getBounds();
            if (Phaser.Geom.Intersects.RectangleToRectangle(pb, db)) {
                // Emit transfer event
                EventBus.emit('player-transfer', {
                    id,
                    texture: (player as any).texture?.key || 'star',
                    tint: (player as any).tintTopLeft ?? 0xffffff,
                    from: 'left'
                });
                // Mark transferred and remove locally
                if (id === 'player1') {
                    this.player1Transferred = true;
                } else {
                    this.player2Transferred = true;
                }
                player.destroy();
            }
        };

        checkDoor(this.player1, 'player1');
        checkDoor(this.player2, 'player2');
    }

    shutdown() {
        EventBus.removeListener('player-transfer', this.onPlayerTransferFromRight, this);
    }

    destroy() {
        EventBus.removeListener('player-transfer', this.onPlayerTransferFromRight, this);
    }
}
