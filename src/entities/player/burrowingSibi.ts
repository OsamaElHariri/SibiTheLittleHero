import { Sibi } from "./sibi";
import { InputKeys } from "../../helpers/inputKeys/inputKeys";
import { PlatformGroup } from '../physicsGroups/platforms/platformGroup';
import { Platform } from '../physicsGroups/platforms/platform';
import { UndergroundTrack } from "../../helpers/underground/undergroundTrack";
import { DirectionTrack } from '../../helpers/underground/directionTrack';
import { Direction } from "../../helpers/enums/direction";

export class BurrowingSibi extends Sibi {

    topTrack: UndergroundTrack;
    bottomTrack: UndergroundTrack;
    rightTrack: UndergroundTrack;
    leftTrack: UndergroundTrack;

    constructor(params: { scene: Phaser.Scene, x: number, y: number, frame?: string | integer, inputs: InputKeys, platforms: PlatformGroup }) {
        super(params);
        params.scene.physics.add.collider(this, params.platforms, this.onCollisionWithPlatforms, null, this);
    }

    onCollisionWithPlatforms(self: BurrowingSibi, platform: Platform): void {
        let directionTrack: DirectionTrack = platform.getTrack(self.body);
        this.setTrack(directionTrack);
    }

    setTrack(DirectionTrack: DirectionTrack): void {
        if (!DirectionTrack) return;
        switch (DirectionTrack.platformTrackDirection) {
            case Direction.Up:
                this.bottomTrack = DirectionTrack.track
                break;
            case Direction.Down:
                this.topTrack = DirectionTrack.track
                break;
            case Direction.Left:
                this.rightTrack = DirectionTrack.track
                break;
            case Direction.Right:
                this.leftTrack = DirectionTrack.track
                break;
        }
    }

    update(): void {
        if (!this.body.blocked.up) this.topTrack = null;
        if (!this.body.blocked.down) this.bottomTrack = null;
        if (!this.body.blocked.right) this.rightTrack = null;
        if (!this.body.blocked.left) this.leftTrack = null;

        this.overGroundMovement();
    }
}