import { Sibi } from "./sibi";
import { InputKeys } from '../../helpers/inputKeys/inputKeys';
import { PlatformGroup } from '../physicsGroups/platforms/platformGroup';
import { Platform } from '../physicsGroups/platforms/platform';
import { UndergroundTrack } from "../../helpers/underground/undergroundTrack";
import { DirectionTrack } from '../../helpers/underground/directionTrack';
import { Direction } from "../../helpers/enums/direction";
import { TrackHook } from '../../helpers/underground/trackHook';

export class BurrowingSibi extends Sibi {

    topTrack: UndergroundTrack;
    bottomTrack: UndergroundTrack;
    rightTrack: UndergroundTrack;
    leftTrack: UndergroundTrack;

    trackHook: TrackHook;

    isHooked: boolean = false;

    private inputKeys: InputKeys;

    constructor(params: { scene: Phaser.Scene, x: number, y: number, frame?: string | integer, platforms: PlatformGroup }) {
        super(params);
        this.inputKeys = InputKeys.getInstance();
        params.scene.physics.add.collider(this, params.platforms, this.onCollisionWithPlatforms, null, this);
        this.trackHook = new TrackHook(this).clampOnEdges(true);
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

        if (!this.isHooked && this.inputKeys.downJustPressed() && this.bottomTrack) {
            this.body.checkCollision.none = true;
            this.isHooked = true;
            this.trackHook.setTrack(this.bottomTrack);
            this.body.setAllowGravity(false);
        }

        if (this.isHooked) {
            this.hookMovement();
        } else
            this.overGroundMovement();
    }

    hookMovement(): void {
        if (this.trackHook.track.isHorizontal) {
            if (this.inputKeys.leftPressed())
                this.trackHook.moveReverse();
            else if (this.inputKeys.rightPressed())
                this.trackHook.move();
        } else {
            if (this.inputKeys.upPressed())
                this.trackHook.moveReverse();
            else if (this.inputKeys.downPressed())
                this.trackHook.move();
        }


    }
}