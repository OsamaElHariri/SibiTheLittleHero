import { MainScene } from '../../scenes/mainScene';
import { CameraTarget } from './cameraTarget';
export class CameraZoomInZone extends Phaser.GameObjects.Rectangle {
    zoomDuration: number = 1500;
    zoomAmount: number = 1.2;

    private isOverlapping = false;
    private previousOverlapping = false;
    private mainScene: MainScene;
    private cameraTarget: CameraTarget;
    private onEnter: Function;

    constructor(params: { scene: MainScene, x: number, y: number, onEnter?: Function }) {
        super(params.scene, params.x, params.y, 550, 200, 0xffffff);
        this.mainScene = params.scene;
        this.onEnter = params.onEnter || function () { };
        this.setupPhysics();
        this.scene.add.existing(this);
        this.setAlpha(0.3);
        this.scene.events.on('LevelStart', () => {
            this.destroy();
        });

        let overlap: Phaser.Physics.Arcade.Collider;
        this.scene.events.on('PlayerSpawned', () => {
            if (!this.scene) {
                this.destroy();
                return;
            }
            this.cameraTarget = this.mainScene.cameraTarget;
            if (overlap) overlap.destroy();
            if (!this.scene) {
                this.destroy();
                return;
            }
            overlap = this.scene.physics.add.overlap(params.scene.player, this,
                (player: Phaser.GameObjects.GameObject, trigger: CameraZoomInZone) => {
                    trigger.onOverlap();
                });
        });

    }

    setupPhysics(): void {
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
    }

    update(): void {
        if (!this.scene) {
            this.destroy();
            return;
        }
        // if (this.previousOverlapping && !this.isOverlapping) this.revertCameraState();
        if (!this.previousOverlapping && this.isOverlapping) this.onEnter();

        this.previousOverlapping = this.isOverlapping;
        this.isOverlapping = false;
    }

    revertCameraState(): void {
        this.cameraTarget.revertToDefault();
        this.mainScene.cameras.main.zoomTo(1, this.zoomDuration, Phaser.Math.Easing.Expo.Out, true);
    }

    onOverlap(): void {
        this.isOverlapping = true;
        this.cameraTarget.setTarget(this);

        if (this.scene.cameras.main.zoom !== this.zoomAmount)
            this.scene.cameras.main.zoomTo(this.zoomAmount, this.zoomDuration, Phaser.Math.Easing.Expo.Out, true);
    }
}