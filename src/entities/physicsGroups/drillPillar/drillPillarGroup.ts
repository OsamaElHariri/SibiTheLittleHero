import { PlatformGroup } from "../platforms/platformGroup";
import { DrillPillar, DrillPillarConfigs } from "./drillPillar";

export class DrillPillarGroup extends Phaser.GameObjects.Group {
    private platformGroup: PlatformGroup;

    constructor(scene: Phaser.Scene, platformGroup: PlatformGroup) {
        super(scene);
        this.platformGroup = platformGroup;
    }

    createPillar(x: number, y: number, config): DrillPillar {
        let drillPillar: DrillPillar = new DrillPillar(this.scene, x, y, this.platformGroup, new DrillPillarConfigs(config));
        this.add(drillPillar);
        return drillPillar;
    }
}