import { PlatformGroup } from "../platforms/platformGroup";
import { DoubleDrills, DoubleDrillConfigs } from "./doubleDrills";

export class DoubleDrillsGroup extends Phaser.GameObjects.Group {
    private platformGroup: PlatformGroup;

    constructor(scene: Phaser.Scene, platformGroup: PlatformGroup) {
        super(scene);
        this.platformGroup = platformGroup;
        this.createDrills(-80, -50, new DoubleDrillConfigs({ numberOfDrills: 3 }));
    }

    createDrills(x: number, y: number, config: DoubleDrillConfigs): DoubleDrills {
        let drill: DoubleDrills = new DoubleDrills(this.scene, x, y, this.platformGroup, config);
        this.add(drill);
        return drill;
    }
}