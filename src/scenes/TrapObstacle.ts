import Phaser from 'phaser';

export default class TrapObstacle extends Phaser.Physics.Arcade.Sprite {
    private canBeActivated: boolean = false;
    private isActivated: boolean = true;
    private activationCallBack: Function;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, activationCallBack: Function) {
        super(scene, x, y, texture);
        this.activationCallBack = activationCallBack;



        scene.add.existing(this);
        //scene.physics.world.enableBody(this);
        //this.setImmovable(true);
    }

    update() {
        if (this.isActivated) {
            this.activationCallBack(this);
        }

        console.log(this.y);
    }

    activateTrap() {
        if (this.canBeActivated) {
            if (!this.isActivated) {
                this.isActivated = true;
            }
        }
    }


}
