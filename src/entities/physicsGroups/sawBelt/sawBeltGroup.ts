import { SawBelt, SawBeltConfigs } from "./sawBelt";

export class SawBeltGroup extends Phaser.GameObjects.Group {
    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    createSawBelt(x: number, y: number, config): SawBelt {
        let sawBelt: SawBelt = new SawBelt(this.scene, x, y, new SawBeltConfigs(config));
        this.add(sawBelt);
        return sawBelt;
    }
}