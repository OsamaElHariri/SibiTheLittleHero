import { RockMelter, RockMelterConfigs } from "./rockMelter";
import { PlatformGroup } from "../platforms/platformGroup";

export class RockMelterGroup extends Phaser.GameObjects.Group {
    private platformGroup: PlatformGroup;

    constructor(scene: Phaser.Scene, platformGroup: PlatformGroup) {
        super(scene, [], { runChildUpdate: true });
        this.platformGroup = platformGroup;
    }

    createRockMelter(x: number, y: number, config: RockMelterConfigs): RockMelter {
        let platform: RockMelter = new RockMelter(this.scene, x, y, this.platformGroup, config);
        this.add(platform);
        return platform;
    }
}