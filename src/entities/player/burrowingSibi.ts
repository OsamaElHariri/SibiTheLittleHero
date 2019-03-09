import { Sibi } from "./sibi";
import { InputKeys } from '../../helpers/inputKeys/inputKeys';
import { PlatformGroup } from '../physicsGroups/platforms/platformGroup';
import { Platform } from '../physicsGroups/platforms/platform';
import { UndergroundTrack } from "../../helpers/underground/undergroundTrack";
import { Direction } from '../../helpers/enums/direction';
import { TrackHook } from '../../helpers/underground/trackHook';
import { TrackIntersectionGroup } from '../physicsGroups/intersection/trackIntersectionGroup';
import { TrackIntersection } from '../physicsGroups/intersection/trackIntersection';
import { TunnelerSibi } from "./tunnelerSibi";

export class BurrowingSibi extends Sibi {

    topTrack: UndergroundTrack;
    bottomTrack: UndergroundTrack;
    rightTrack: UndergroundTrack;
    leftTrack: UndergroundTrack;

    trackHook: TrackHook;

    isHooked: boolean = false;

    private inputKeys: InputKeys;
    private collisionWithPlatforms: Phaser.Physics.Arcade.Collider;

    private tunneler: TunnelerSibi;

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
        if (Math.abs(self.x - intersection.x) > 20 || Math.abs(self.y - intersection.y) > 20) return;

        let inputKeys: InputKeys = this.inputKeys;
        if (inputKeys.upPressed() && intersection.topTrack)
            this.switchTracks(intersection.topTrack)
        else if (inputKeys.downPressed() && intersection.bottomTrack)
            this.switchTracks(intersection.bottomTrack)
        else if (inputKeys.rightPressed() && intersection.rightTrack)
            this.switchTracks(intersection.rightTrack)
        else if (inputKeys.leftPressed() && intersection.leftTrack)
            this.switchTracks(intersection.leftTrack)
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

    switchTracks(track: UndergroundTrack): void {
        if (track == this.trackHook.track) return;
        
        if (track && this.tunneler) {
            this.tunneler.duplicateHereAndShrink();
            this.tunneler.playGrowAnim();
            this.tunneler.updateDirection(track.direction);
        }
        this.trackHook.setTrack(track);
    }

    update(): void {
        if (this.tunneler)
            this.tunneler.update();

        if (!this.body.blocked.up) this.topTrack = null;
        if (!this.body.blocked.down) this.bottomTrack = null;
        if (!this.body.blocked.right) this.rightTrack = null;
        if (!this.body.blocked.left) this.leftTrack = null;

        if (!this.isHooked && this.inputKeys.downJustPressed() && this.bottomTrack) {
            this.collisionWithPlatforms.active = false;
            this.isHooked = true;
            this.spawnTunneler(this.bottomTrack);
            this.trackHook.setTrack(this.bottomTrack);
            this.body.setAllowGravity(false);
            this.setAlpha(0);
            this.body.setVelocityX(0);
        }

        if (this.isHooked) {
            this.hookMovement();
            this.moveTunneler();
        } else
            this.overGroundMovement();
    }

    spawnTunneler(track: UndergroundTrack): void {
        this.tunneler = new TunnelerSibi({ scene: this.scene, x: this.x, y: this.y });
        this.tunneler.updateDirection(track.direction);
    }

    hookMovement(): void {
        let hasMoved: boolean = false;
        if (this.trackHook.track.isHorizontal) {
            if (this.inputKeys.leftPressed()) {
                this.trackHook.moveReverse();
                hasMoved = true;
            } else if (this.inputKeys.rightPressed()) {
                this.trackHook.move();
                hasMoved = true;
            }
        } else {
            if (this.inputKeys.upPressed()) {
                this.trackHook.moveReverse();
                hasMoved = true;
            } else if (this.inputKeys.downPressed()) {
                this.trackHook.move();
                hasMoved = true;
            }
        }
        if (hasMoved)
            this.tunneler.speedUpTween();
        else
            this.tunneler.normalSpeedTween();
    }

    moveTunneler(): void {
        if (!this.tunneler) return;
        this.tunneler.x = this.x;
        this.tunneler.y = this.y;
    }
}