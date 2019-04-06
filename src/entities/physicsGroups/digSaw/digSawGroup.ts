import { PlatformGroup } from "../platforms/platformGroup";
import { DigSaw, DigSawConfigs } from "./digSaw";

export class DigSawGroup extends Phaser.Physics.Arcade.Group {
    private platformGroup: PlatformGroup;

    constructor(scene: Phaser.Scene, platformGroup: PlatformGroup) {
        super(scene.physics.world, scene);
        this.platformGroup = platformGroup;
        this.createDigSaw(150, -100, new DigSawConfigs());
    }

    createDigSaw(x: number, y: number, config: DigSawConfigs): DigSaw {
        let digSaw: DigSaw = new DigSaw(this.scene, x, y, this.platformGroup, config);
        this.add(digSaw);
        return digSaw;
    }
}