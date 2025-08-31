import { GameObjects, Scene } from 'phaser';
import {EventBus} from "@/lib/util/EventBus";


export class MainMenu extends Scene
{
    background?: GameObjects.Image;
    logo?: GameObjects.Image;
    title?: GameObjects.Text;
    usersCountText?: GameObjects.Text;
    logoTween?: Phaser.Tweens.Tween | null;
    usersCount: number = 0;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 300, 'logo').setDepth(100);

        this.title = this.add.text(512, 460, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Add users count text
        this.usersCountText = this.add.text(512, 520, `Users: ${this.usersCount}`, {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Listen for users count updates
        EventBus.on('users-count', (count: number) => {
            this.usersCount = count;
            if (this.usersCountText) {
                this.usersCountText.setText(`Users: ${count}`);
            }
        });

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        // Start left scene (replacing menu) and launch right scene in parallel
        this.scene.start('GameLeft');
        this.scene.launch('GameRight');
    }

    moveLogo (reactCallback: ({ x, y }: { x: number, y: number }) => void)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        }
        else
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (reactCallback)
                    {
                        reactCallback({
                            x: Math.floor(this.logo!.x),
                            y: Math.floor(this.logo!.y)
                        });
                    }
                }
            });
        }
    }
}