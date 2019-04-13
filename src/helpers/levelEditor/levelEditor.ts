import { MainScene } from "../../scenes/mainScene";
import { EditingPanel } from "./editingPanel";

export class LevelEditor extends Phaser.GameObjects.Rectangle {
    private xPrevious;
    private yPrevious;

    private mainScene: MainScene;

    constructor(scene: MainScene) {
        super(scene, scene.cameras.main.x, scene.cameras.main.y);
        this.mainScene = scene;
        if (this.mainScene.player)
            this.setPosition(this.mainScene.player.x, this.mainScene.player.y);
        this.takeCamera();
        new EditingPanel(scene, this);
        this.scene.events.on('PlayerSpawned', () => {
            this.takeCamera();
        });
    }

    takeCamera() {
        this.mainScene.cameraTarget.setTarget(this);
        this.scene.cameras.main.setLerp(1);
    }

    update() {
        if (this.scene.input.activePointer.justDown) {
            this.xPrevious = this.scene.input.activePointer.worldX;
            this.yPrevious = this.scene.input.activePointer.worldY;
        } else if (this.scene.input.activePointer.isDown) {
            let xOffset = this.xPrevious - this.scene.input.activePointer.worldX;
            let yOffset = this.yPrevious - this.scene.input.activePointer.worldY;

            if (xOffset) this.x += xOffset;
            if (yOffset) this.y += yOffset;
            this.xPrevious = this.scene.input.activePointer.worldX;
            this.yPrevious = this.scene.input.activePointer.worldY;
        }
    }
}