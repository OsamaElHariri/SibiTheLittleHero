import { DrillMat, DrillMatConfigs } from "./drillMat";

export class DrillMatGroup extends Phaser.GameObjects.Group {
    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    createDrillMat(x: number, y: number, config): DrillMat {
        let drillMat: DrillMat = new DrillMat(this.scene, x, y, new DrillMatConfigs(config));
        this.add(drillMat);
        return drillMat;
    }
}