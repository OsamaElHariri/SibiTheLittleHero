import { PlatformGroup } from "../platforms/platformGroup";
import { DigSaw, DigSawConfigs } from "./digSaw";

export class DigSawGroup extends Phaser.Physics.Arcade.Group {
    private platformGroup: PlatformGroup;

    constructor(scene: Phaser.Scene, platformGroup: PlatformGroup) {
        super(scene.physics.world, scene);
        this.platformGroup = platformGroup;
    }

    createDigSaw(x: number, y: number, config): DigSaw {
        let digSaw: DigSaw = new DigSaw(this.scene, x, y, this.platformGroup, new DigSawConfigs(config));
        this.add(digSaw);
        return digSaw;
    }
}