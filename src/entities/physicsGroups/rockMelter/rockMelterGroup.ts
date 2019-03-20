import { RockMelter } from "./rockMelter";
import { PlatformGroup } from "../platforms/platformGroup";

export class RockMelterGroup extends Phaser.GameObjects.Group {
    private platformGroup: PlatformGroup;

    constructor(scene: Phaser.Scene, platformGroup: PlatformGroup) {
        super(scene, [], { runChildUpdate: true });
        this.platformGroup = platformGroup;
        this.createDefaultRockMelters();
    }

    createDefaultRockMelters(): void {
        this.createRockMelter(150 - 25, -100 - 200);
        this.createRockMelter(350 + 25, -100 - 200);

        this.createRockMelter(470 + 100 - 25, 0 - 250 - 200);
        this.createRockMelter(670 + 25 + 100, 0 - 250 - 200);

        this.createRockMelter(940 + 100 - 25, -150 - 250 - 200);
        this.createRockMelter(1140 + 25 + 100, -150 - 250 - 200);
    }

    createRockMelter(x: number, y: number): RockMelter {
        let platform: RockMelter = new RockMelter(this.scene, x, y, this.platformGroup);
        this.add(platform);
        return platform;
    }
}