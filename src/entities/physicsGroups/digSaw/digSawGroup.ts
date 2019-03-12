import { PlatformGroup } from "../platforms/platformGroup";
import { DigSaw } from "./digSaw";

export class DigSawGroup extends Phaser.Physics.Arcade.Group {
    private platformGroup: PlatformGroup;

    constructor(scene: Phaser.Scene, platformGroup: PlatformGroup) {
        super(scene.physics.world, scene);
        this.platformGroup = platformGroup;
        this.createDigSaw(150, -100, false);
    }

    createDigSaw(x: number, y: number, clockWise?: boolean): DigSaw {
        let digSaw: DigSaw = new DigSaw(this.scene, x, y, this.platformGroup, clockWise);
        this.add(digSaw);
        return digSaw;
    }

}