import { Sibi } from "./sibi";
import { InputKeys } from '../../helpers/inputKeys/inputKeys';
import { PlatformGroup } from '../physicsGroups/platforms/platformGroup';
import { Platform } from '../physicsGroups/platforms/platform';
import { UndergroundTrack } from "../../helpers/underground/undergroundTrack";
import { Direction } from '../../helpers/enums/direction';
import { TrackHook } from '../../helpers/underground/trackHook';
import { TrackIntersectionGroup } from '../physicsGroups/intersection/trackIntersectionGroup';
import { TrackIntersection } from '../physicsGroups/intersection/trackIntersection';

export class BurrowingSibi extends Sibi {

    topTrack: UndergroundTrack;
    bottomTrack: UndergroundTrack;
    rightTrack: UndergroundTrack;
    leftTrack: UndergroundTrack;

    trackHook: TrackHook;

    isHooked: boolean = false;

    private inputKeys: InputKeys;
    private collisionWithPlatforms: Phaser.Physics.Arcade.Collider;

    constructor(params: { scene: Phaser.Scene, x: number, y: number, platforms: PlatformGroup, trackIntersectionGroup?: TrackIntersectionGroup }) {
        super(params);
        this.inputKeys = InputKeys.getInstance();
        this.collisionWithPlatforms =
            params.scene.physics.add.collider(this, params.platforms,
                this.onCollisionWithPlatforms, null, this);

        this.trackHook = new TrackHook(this).clampOnEdges(true);

        if (params.trackIntersectionGroup)
            params.scene.physics.add.collider(this, params.trackIntersectionGroup,
                this.onOverlapWithIntersection, null, this);
    }

    onCollisionWithPlatforms(self: BurrowingSibi, platform: Platform): void {
        let track: UndergroundTrack = platform.getTrack(self.body);
        this.setTrack(track);
    }

    onOverlapWithIntersection(self: BurrowingSibi, intersection: TrackIntersection) {
        let inputKeys: InputKeys = this.inputKeys;
        if (inputKeys.upPressed() && intersection.topTrack)
            self.trackHook.setTrack(intersection.topTrack)
        else if (inputKeys.downPressed() && intersection.bottomTrack)
            self.trackHook.setTrack(intersection.bottomTrack)
        else if (inputKeys.rightPressed() && intersection.rightTrack)
            self.trackHook.setTrack(intersection.rightTrack)
        else if (inputKeys.leftPressed() && intersection.leftTrack)
            self.trackHook.setTrack(intersection.leftTrack)
    }

    setTrack(track: UndergroundTrack): void {
        if (!track) return;
        switch (track.direction) {
            case Direction.Up:
                this.bottomTrack = track;
                break;
            case Direction.Down:
                this.topTrack = track;
                break;
            case Direction.Left:
                this.rightTrack = track;
                break;
            case Direction.Right:
                this.leftTrack = track;
                break;
        }
    }

    update(): void {
        if (!this.body.blocked.up) this.topTrack = null;
        if (!this.body.blocked.down) this.bottomTrack = null;
        if (!this.body.blocked.right) this.rightTrack = null;
        if (!this.body.blocked.left) this.leftTrack = null;

        if (!this.isHooked && this.inputKeys.downJustPressed() && this.bottomTrack) {
            this.collisionWithPlatforms.active = false;
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