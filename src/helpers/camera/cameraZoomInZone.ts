import { MainScene } from '../../scenes/mainScene';
import { CameraTarget } from './cameraTarget';
export class CameraZoomInZone extends Phaser.GameObjects.Image {
    zoomDuration: number = 1500;
    zoomAmount: number = 2;

    private isOverlapping = false;
    private previousOverlapping = false;
    private mainScene: MainScene;
    private cameraTarget: CameraTarget;

    constructor(params: { scene: MainScene, x: number, y: number, frame?: string | integer, camTarget: CameraTarget }) {
        super(params.scene, params.x, params.y, 'YellowSquare');
        this.cameraTarget = params.camTarget;
        this.mainScene = params.scene;
        this.setupPhysics();
        this.scene.add.existing(this);

        this.scene.physics.add.overlap(params.scene.player, this,
            (player: Phaser.GameObjects.GameObject, trigger: CameraZoomInZone) => {
                trigger.onOverlap();
            });
    }

    setupPhysics(): void {
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
    }

    update(): void {
        if (this.previousOverlapping && !this.isOverlapping) this.revertCameraState();

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