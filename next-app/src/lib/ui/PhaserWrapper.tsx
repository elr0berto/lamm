'use client'

import {useRef, useState} from "react";
import {IRefPhaserGame, PhaserGame} from "@/lib/ui/PhaserGame";
import {MainMenu} from "@/lib/ui/scenes/MainMenu";
import Phaser from 'phaser';
import { EventBus } from '@/lib/util/EventBus';

interface PhaserWrapperProps {
    usersCount: number;
}

export default function PhaserWrapper({ usersCount }: PhaserWrapperProps) {

    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

    const changeScene = () => {

        if(phaserRef.current)
        {
            const scene = phaserRef.current.scene;
            if (!scene) return;

            // If we're on the MainMenu use its custom changeScene method (to go to Game)
            if (scene.scene.key === 'MainMenu' && (scene as any).changeScene)
            {
                (scene as any).changeScene();
            }
            else
            {
                // For any other scene (Game, GameOver, dynamic scenes, etc.) go back to MainMenu
                scene.scene.start('MainMenu');
            }
        }
    }

    const moveSprite = () => {

        if(phaserRef.current)
        {

            const scene = phaserRef.current.scene as MainMenu;

            if (scene && scene.scene.key === 'MainMenu')
            {
                // Get the update logo position
                scene.moveLogo(({ x, y }) => {

                    setSpritePosition({ x, y });

                });
            }
        }

    }

    const addSprite = () => {

        if (phaserRef.current)
        {
            const scene = phaserRef.current.scene;

            if (scene)
            {
                // Add more stars
                const x = Phaser.Math.Between(64, scene.scale.width - 64);
                const y = Phaser.Math.Between(64, scene.scale.height - 64);

                //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
                const star = scene.add.sprite(x, y, 'star');

                //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
                //  You could, of course, do this from within the Phaser Scene code, but this is just an example
                //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
                scene.add.tween({
                    targets: star,
                    duration: 500 + Math.random() * 1000,
                    alpha: 0,
                    yoyo: true,
                    repeat: -1
                });
            }
        }
    }

    const createDynamicScene = () => {
        if (!phaserRef.current?.game) return;
        const game = phaserRef.current.game;
        const key = `DynamicScene_${Date.now().toString(36)}`;

        class DynamicScene extends Phaser.Scene {
            constructor() { super(key); }
            create() {
                const w = this.scale.width;
                const h = this.scale.height;
                // Random background color
                this.cameras.main.setBackgroundColor(Phaser.Display.Color.RandomRGB().color);
                this.add.text(w / 2, h / 2, key, {
                    fontFamily: 'Arial Black', fontSize: 42, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 6, align: 'center'
                }).setOrigin(0.5);
                this.add.text(w / 2, h - 40, 'Press M to return to MainMenu', {
                    fontFamily: 'Arial', fontSize: 20, color: '#ffff00',
                    stroke: '#000000', strokeThickness: 3
                }).setOrigin(0.5);

                this.input.keyboard?.on('keydown-M', () => {
                    this.scene.start('MainMenu');
                });

                EventBus.emit('current-scene-ready', this);
            }
        }

        // Add and start new scene immediately
        game.scene.add(key, DynamicScene, true);
    }

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {

        setCanMoveSprite(scene.scene.key !== 'MainMenu');

    }

    return <div id="app">
        <PhaserGame ref={phaserRef} currentActiveScene={currentScene} usersCount={usersCount} />
        <div>
            <div>
                <button className="button" onClick={changeScene}>Change / Toggle Scene</button>
            </div>
            <div>
                <button disabled={canMoveSprite} className="button" onClick={moveSprite}>Toggle Movement</button>
            </div>
            <div className="spritePosition">Sprite Position:
                <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
            </div>
            <div>
                <button className="button" onClick={addSprite}>Add New Sprite</button>
            </div>
            <div>
                <button className="button" onClick={createDynamicScene}>Create Dynamic Scene</button>
            </div>
        </div>
    </div>;
}