import { DrillMat, DrillMatConfigs } from "./drillMat";
import { Direction } from "../../../helpers/enums/direction";

export class DrillMatGroup extends Phaser.GameObjects.Group {
    constructor(scene: Phaser.Scene) {
        super(scene);
        this.createDefaultMats();
    }

    createDefaultMats(): void {
        this.createDrillMat(50, 50, new DrillMatConfigs({direction: Direction.Right}));
    }

    createDrillMat(x: number, y: number, config: DrillMatConfigs): DrillMat {
        let drillMat: DrillMat = new DrillMat(this.scene, x, y, config);
        this.add(drillMat);
        return drillMat;
    }
}