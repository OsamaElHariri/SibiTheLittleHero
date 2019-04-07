import { PlatformGroup } from "../platforms/platformGroup";
import { DoubleDrills, DoubleDrillConfigs } from "./doubleDrills";

export class DoubleDrillsGroup extends Phaser.GameObjects.Group {
    private platformGroup: PlatformGroup;

    constructor(scene: Phaser.Scene, platformGroup: PlatformGroup) {
        super(scene);
        this.platformGroup = platformGroup;
    }

    createDrills(x: number, y: number, config): DoubleDrills {
        let drill: DoubleDrills = new DoubleDrills(this.scene, x, y, this.platformGroup, new DoubleDrillConfigs(config));
        this.add(drill);
        return drill;
    }
}