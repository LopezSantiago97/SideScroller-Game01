import TrapObstacle from './TrapObstacle';

export default class TrapSpikeTop extends TrapObstacle {

    private isFalling: boolean = true;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {

        super(scene, x, y, texture, activationCallback);


        // TODO
        // Customize any additional properties specific to TrapSpikeTop
    }


    // TODO
    // Add any additional methods or logic specific to TrapSpikeTop
}

const activationCallback = (body: Phaser.Physics.Arcade.Sprite) => {
    body.setVelocityY(20);
}