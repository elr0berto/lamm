import { Scene } from 'phaser';
import { EventBus } from "@/lib/util/EventBus";

export class SplitScreenDemo extends Scene {
    private topLeftCamera?: Phaser.Cameras.Scene2D.Camera;
    private topRightCamera?: Phaser.Cameras.Scene2D.Camera;
    private bottomLeftCamera?: Phaser.Cameras.Scene2D.Camera;
    private bottomRightCamera?: Phaser.Cameras.Scene2D.Camera;
    
    private rotatingShapes: Phaser.GameObjects.Graphics[] = [];
    private particles?: Phaser.GameObjects.Particles.ParticleEmitter;
    private movingSprites: Phaser.GameObjects.Sprite[] = [];
    private animatedText?: Phaser.GameObjects.Text;
    
    constructor() {
        super('SplitScreenDemo');
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        // Disable the main camera initially
        this.cameras.main.setVisible(false);

        // Create 4 cameras for split screen (2x2 grid)
        // Top-left: Rotating shapes
        this.topLeftCamera = this.cameras.add(0, 0, halfWidth, halfHeight);
        this.topLeftCamera.setBackgroundColor(0x2E86AB);

        // Top-right: Particle effects
        this.topRightCamera = this.cameras.add(halfWidth, 0, halfWidth, halfHeight);
        this.topRightCamera.setBackgroundColor(0xA23B72);

        // Bottom-left: Moving sprites
        this.bottomLeftCamera = this.cameras.add(0, halfHeight, halfWidth, halfHeight);
        this.bottomLeftCamera.setBackgroundColor(0xF18F01);

        // Bottom-right: Text animations
        this.bottomRightCamera = this.cameras.add(halfWidth, halfHeight, halfWidth, halfHeight);
        this.bottomRightCamera.setBackgroundColor(0xC73E1D);

        this.setupTopLeftContent();
        this.setupTopRightContent();
        this.setupBottomLeftContent();
        this.setupBottomRightContent();

        // Add instructions
        const instructionText = this.add.text(width / 2, 20, 'Split Screen Demo - 4 Dynamic Scenes\nPress M to return to MainMenu', {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3, align: 'center'
        }).setOrigin(0.5).setDepth(1000);

        // Make sure instructions are visible on all cameras
        this.topLeftCamera.ignore(instructionText);
        this.topRightCamera.ignore(instructionText);
        this.bottomLeftCamera.ignore(instructionText);
        this.bottomRightCamera.ignore(instructionText);

        // Enable main camera just for the instructions
        this.cameras.main.setVisible(true);

        // Add keyboard input to return to main menu
        this.input.keyboard?.on('keydown-M', () => {
            this.scene.start('MainMenu');
        });

        EventBus.emit('current-scene-ready', this);
    }

    private setupTopLeftContent() {
        // Create rotating geometric shapes
        for (let i = 0; i < 5; i++) {
            const shape = this.add.graphics();
            const x = 50 + i * 80;
            const y = 100 + (i % 2) * 100;
            
            shape.fillStyle(0xFFFFFF);
            shape.fillRect(-20, -20, 40, 40);
            shape.setPosition(x, y);
            
            this.rotatingShapes.push(shape);

            // Only visible on top-left camera
            this.topRightCamera?.ignore(shape);
            this.bottomLeftCamera?.ignore(shape);
            this.bottomRightCamera?.ignore(shape);

            // Rotate the shape
            this.tweens.add({
                targets: shape,
                rotation: Math.PI * 2,
                duration: 2000 + i * 500,
                repeat: -1,
                ease: 'Linear'
            });
        }
    }

    private setupTopRightContent() {
        // Create particle effects
        this.particles = this.add.particles(this.scale.width * 0.75, this.scale.height * 0.25, 'star', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.3, end: 0 },
            lifespan: 1000,
            frequency: 100,
            emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 80), quantity: 2 }
        });

        // Only visible on top-right camera
        this.topLeftCamera?.ignore(this.particles);
        this.bottomLeftCamera?.ignore(this.particles);
        this.bottomRightCamera?.ignore(this.particles);
    }

    private setupBottomLeftContent() {
        // Create moving sprites
        for (let i = 0; i < 3; i++) {
            const sprite = this.add.sprite(100 + i * 120, this.scale.height * 0.75, 'star');
            sprite.setScale(0.5);
            this.movingSprites.push(sprite);

            // Only visible on bottom-left camera
            this.topLeftCamera?.ignore(sprite);
            this.topRightCamera?.ignore(sprite);
            this.bottomRightCamera?.ignore(sprite);

            // Make sprites move in different patterns
            this.tweens.add({
                targets: sprite,
                x: sprite.x + 200,
                duration: 2000 + i * 300,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            this.tweens.add({
                targets: sprite,
                y: sprite.y + 50 * Math.sin(i),
                duration: 1500 + i * 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    private setupBottomRightContent() {
        // Create animated text
        this.animatedText = this.add.text(
            this.scale.width * 0.75,
            this.scale.height * 0.75,
            'SPLIT\nSCREEN\nDEMO',
            {
                fontFamily: 'Arial Black',
                fontSize: 32,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
                align: 'center'
            }
        ).setOrigin(0.5);

        // Only visible on bottom-right camera
        this.topLeftCamera?.ignore(this.animatedText);
        this.topRightCamera?.ignore(this.animatedText);
        this.bottomLeftCamera?.ignore(this.animatedText);

        // Animate the text
        this.tweens.add({
            targets: this.animatedText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: this.animatedText,
            rotation: 0.1,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    update() {
        // Update any dynamic content if needed
    }
}