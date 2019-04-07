import { MainScene } from "../../scenes/mainScene";
import { EditingPanel } from "./editingPanel";

export class LevelEditor extends Phaser.GameObjects.Rectangle {
    private xPrevious;
    private yPrevious;

    private mainScene: MainScene;

    constructor(scene: MainScene) {
        super(scene, scene.cameras.main.x, scene.cameras.main.y);
        this.mainScene = scene;
        scene.cameraTarget.setTarget(this);
        this.scene.cameras.main.setLerp(1);
        new EditingPanel(scene, this);
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