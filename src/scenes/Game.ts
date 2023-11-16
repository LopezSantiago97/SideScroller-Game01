import Phaser from "phaser";
import PlayerController from "./PlayerController";
import ObstaclesController from "./ObstaclesController";
import TrapSpikeTop from "./TrapSpikeTop";

export default class Game extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private penguin!: Phaser.Physics.Matter.Sprite;
    private playerController?: PlayerController;
    private obstacles!: ObstaclesController;

    private trapObstacles: TrapSpikeTop[] = [];

    constructor() {
        super('game')
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.obstacles = new ObstaclesController();
    }

    preload() {
        this.load.atlas('penguin', 'assets/penguin.png', 'assets/penguin.json');
        this.load.image('tiles', 'assets/sheet.png');
        this.load.tilemapTiledJSON('tilemap', 'assets/game.json');

        this.load.image('apple', 'assets/apple.png');
        this.load.image('heart', 'assets/heart.png');
        this.load.image('spike-top', 'assets/spike-top.png');
    }

    create() {
        this.scene.launch('ui');

        const map = this.make.tilemap({ key: "tilemap" });
        const tileset = map.addTilesetImage('IceWorld', 'tiles');

        const ground = map.createLayer('ground', tileset);
        ground.setCollisionByProperty({ collides: true });

        const obstacles = map.createLayer('obstacles', tileset)

        /*****************************************************************
         *                    Player and items spawn
         ****************************************************************/

        const objectsLayer = map.getObjectLayer('objects');
        objectsLayer.objects.forEach(objData => {
            const { x = 0, y = 0, name, width = 0, height = 0 } = objData;

            switch (name) {
                case 'player-spawn':
                    {
                        // SET SPRITE
                        this.penguin = this.matter.add.sprite(x + (width * 0.5), y!, 'penguin')
                            .setFixedRotation()

                        // SET PLAYER CONTROLLER
                        this.playerController = new PlayerController(
                            this,
                            this.penguin,
                            this.cursors,
                            this.obstacles
                        )
                        this.cameras.main.startFollow(this.penguin)

                        break
                    }
                case 'collectables_Apple':
                    {
                        const apple = this.matter.add.sprite(x, y, 'apple', undefined, {
                            isStatic: true,
                            isSensor: true
                        })
                        apple.setScale(0.5, 0.5)
                        apple.setData('type', 'apple')
                        break
                    }
                case 'health':
                    {
                        const health = this.matter.add.sprite(x, y, 'heart', undefined, {
                            isStatic: true,
                            isSensor: true
                        })
                        health.setScale(0.05, 0.05)
                        health.setData('type', 'health')
                        health.setData('healthPoints', 10)

                        break
                    }
                case 'spikes':
                    {
                        const spike = this.matter.add.rectangle(x + (width * 0.5), y + (height * 0.5), width, height, {
                            isStatic: true
                        })
                        this.obstacles.add('spikes', spike)
                        break
                    }
                // case 'spike-top':
                //     {
                //         const spikeTop = this.matter.add.sprite(x + (width * 0.5), y + (height * 1), 'spike-top', undefined, {
                //             isStatic: true,
                //             isSensor: true
                //         })
                //         spikeTop.setData('type', 'spike-top')
                //         spikeTop.setData('damage', 20)

                //         break
                //     }
                case 'spike-top':
                    {

                        const trapSpikeTop = new TrapSpikeTop(this, x + (width * 0.5), y + (height * 1), 'spike-top')

                        // const spikeTop = this.matter.add.sprite(x + (width * 0.5), y + (height * 1), 'spike-top', undefined, {
                        //     isStatic: true,
                        //     isSensor: true
                        // })
                        trapSpikeTop.setData('type', 'spike-top')
                        trapSpikeTop.setData('damage', 20)

                        this.trapObstacles.push(trapSpikeTop)
                        break
                    }
            }
        })

        this.matter.world.convertTilemapLayer(ground);
    }

    update(t: number, dt: number) { // t = Time, dt = DeltaTime

        if (!this.playerController) return;

        this.playerController.update(dt);
    }
}