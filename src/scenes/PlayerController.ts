import Phaser from "phaser"
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

export default class PlayerController {

    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite;
    private cursors: CursorKeys;
    private obstacles: ObstaclesController;
    private stateMachine: StateMachine;

    private health = 100
    private speed = 7


    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, cursors: CursorKeys, obstacles: ObstaclesController) {
        this.sprite = sprite;
        this.cursors = cursors;
        this.obstacles = obstacles;
        this.scene = scene;

        /*****************************************************************
         *                      PLAYER STATE MACHINE
         ****************************************************************/
        this.createAnimations();
        this.stateMachine = new StateMachine(this, 'player');
        this.stateMachine.addState('idle', {
            onEnter: this.idleOnEnter,
            onUpdate: this.idleOnUpdate
        })
            .addState('walk', {
                onEnter: this.walkOnEnter,
                onUpdate: this.walkOnUpdate,
                onExit: this.walkOnExit
            })
            .addState('jump', {
                onEnter: this.jumpOnEnter,
                onUpdate: this.jumpOnUpdate
            })
            .addState('spike-hit', {
                onEnter: this.spikeHitOnEnter
            })
            .setState('idle')


        /***************************************************************
         *                      PLAYER COLLISION
         ***************************************************************/
        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const body = data.bodyB as MatterJS.BodyType

            // Collision con los spikes
            if (!this.obstacles.is('spikes', body)) {
                this.stateMachine.setState('spike-hit')
                return
            }

            // Objeto con el que colisiona
            const gameObject = body.gameObject

            // Si no hay objeto, la colision se ignora
            if (!gameObject) return

            // Si la colision es con el piso y estaba saltando, lo setea a idle
            if (gameObject instanceof Phaser.Physics.Matter.TileBody) {
                if (this.stateMachine.isCurrentState('jump')) {
                    this.stateMachine.setState('idle')
                }
                return
            }

            // Si ninguno de los casos anteriores es true, entonces
            // la colision es con un Objeto interactivo
            const sprite = gameObject as Phaser.Physics.Matter.Sprite
            const type = sprite.getData('type')

            // En funcion del type del objeto interactivo, se setea su accion
            switch (type) {
                case 'star':
                    events.emit('star-collected')
                    sprite.destroy()
                    break

                case 'health':
                    {
                        const value = sprite.getData('healthPoints') ?? 10
                        this.health = Phaser.Math.Clamp(this.health + value, 0, 100)
                        events.emit('health-changed', this.health)
                        sprite.destroy()
                        break
                    }
            }
        })

    }

    update(dt: number) { //dt = DeltaTime
        this.stateMachine.update(dt);
    }

    private idleOnEnter() {
        this.sprite.play('player-idle');
    }

    private idleOnUpdate() {
        if (this.cursors.left.isDown || this.cursors.right.isDown) {
            this.stateMachine.setState('walk');
        }

        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
        if (spaceJustPressed) {
            this.stateMachine.setState('jump');
        }
    }

    private walkOnEnter() {
        this.sprite.play('player-walk');
    }

    private walkOnUpdate() {

        if (this.cursors.left.isDown) {
            this.sprite.flipX = true;
            this.sprite.setVelocityX(-this.speed)
        } else if (this.cursors.right.isDown) {
            this.sprite.flipX = false;
            this.sprite.setVelocityX(this.speed);
        } else {
            this.sprite.setVelocityX(0);
            this.stateMachine.setState('idle');
        }

        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
        if (spaceJustPressed) {
            this.stateMachine.setState('jump');
        }
    }

    private walkOnExit() {
        this.sprite.stop();
    }

    private jumpOnEnter() {
        this.sprite.setVelocityY(-8);
    }

    private jumpOnUpdate() {
        if (this.cursors.left.isDown) {
            this.sprite.flipX = true;
            this.sprite.setVelocityX(-this.speed)
        } else if (this.cursors.right.isDown) {
            this.sprite.flipX = false;
            this.sprite.setVelocityX(this.speed);
        } else {
            this.sprite.setVelocityX(0);
        }
    }

    private spikeHitOnEnter() {
        this.sprite.setVelocityY(-5)
        this.health = Phaser.Math.Clamp(this.health - 10, 0, 100)

        // TODO: reemplazar los string literals por enums
        events.emit('health-changed', this.health)

        // Seteo de colores para el "blink"
        const startColor = Phaser.Display.Color.ValueToColor(0xffffff)
        const endColor = Phaser.Display.Color.ValueToColor(0xff0000)
        // Blink con los colores seteados
        this.scene.tweens.addCounter({
            from: 0,
            to: 100,
            duration: 100,
            repeat: 2,
            yoyo: true,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: tween => {
                const value = tween.getValue()
                const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
                    startColor,
                    endColor,
                    100,
                    value
                )

                const color = Phaser.Display.Color.GetColor(
                    colorObject.r,
                    colorObject.g,
                    colorObject.b
                )

                this.sprite.setTint(color)
            }
        })


        this.stateMachine.setState('idle')
    }

    private createAnimations() {
        this.sprite.anims.create({
            key: 'player-idle',
            frames: [{ key: 'penguin', frame: 'penguin_walk01.png' }]
        })

        this.sprite.anims.create({
            key: 'player-walk',
            frameRate: 10,
            frames: this.sprite.anims.generateFrameNames('penguin', {
                start: 1,
                end: 4,
                prefix: 'penguin_walk0',
                suffix: '.png'
            }),
            repeat: -1
        });
    }

}


