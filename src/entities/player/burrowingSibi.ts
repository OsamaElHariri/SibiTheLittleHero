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
import { AirbornSibi } from "./airbornSibi";

export class BurrowingSibi extends Sibi {

    topTrack: UndergroundTrack;
    bottomTrack: UndergroundTrack;
    rightTrack: UndergroundTrack;
    leftTrack: UndergroundTrack;

    trackHook: TrackHook;

    isBurrowing: boolean = false;

    private inputKeys: InputKeys;
    private platforms: PlatformGroup;
    private collisionWithPlatforms: Phaser.Physics.Arcade.Collider;
    private collisionWithIntersections: Phaser.Physics.Arcade.Collider;
    private launchHoldTween: Phaser.Tweens.Tween;
    private launchCameraZoom: number = 1.05;

    private underGroundHostileGroup: Phaser.GameObjects.Group;
    private hostileGroup: Phaser.GameObjects.Group;
    private hostileGroupCollision: Phaser.Physics.Arcade.Collider;


    private tunneler: TunnelerSibi;
    private airbornSibi: AirbornSibi;

    constructor(params: { scene: Phaser.Scene, x: number, y: number, platforms: PlatformGroup, trackIntersectionGroup?: TrackIntersectionGroup }) {
        super(params);
        this.platforms = params.platforms;
        this.inputKeys = InputKeys.getInstance();
        this.collisionWithPlatforms =
            params.scene.physics.add.collider(this, params.platforms,
                this.onCollisionWithPlatforms, null, this);

        this.trackHook = new TrackHook(this).clampOnEdges(true).setSpeed(5);

        if (params.trackIntersectionGroup) {
            this.collisionWithIntersections = params.scene.physics.add.overlap(this, params.trackIntersectionGroup,
                this.onOverlapWithIntersection, null, this);
            this.collisionWithIntersections.active = false;
        }

        this.underGroundHostileGroup = this.scene.data.get('UnderGroundHostileGroup');

        this.hostileGroup = this.scene.data.get('OverGroundHostileGroup');
        this.hostileGroupCollision = this.scene.physics.add.overlap(this, this.hostileGroup, this.kill, null, this);
    }

    kill(): void {
        if (this.tunneler) this.tunneler.destroy();
        if (this.airbornSibi) this.airbornSibi.destroy();
        this.removeLaunchHoldTween();
        this.scene.events.emit('PlayerDead');
        this.destroy();
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
        if (this.airbornSibi)
            this.airbornSibi.update();

        let objectToCheck = this.airbornSibi || this;
        if (!objectToCheck.body.blocked.up) this.topTrack = null;
        if (!objectToCheck.body.blocked.down) this.bottomTrack = null;
        if (!objectToCheck.body.blocked.right) this.rightTrack = null;
        if (!objectToCheck.body.blocked.left) this.leftTrack = null;
        this.burrowIfPossible();



        if (this.isBurrowing) {
            this.hookMovement();
            this.moveTunneler();
            this.launchIfButtonIsHeld();
        } else {
            this.overGroundMovement();
        }
    }

    overGroundMovement() {
        if (!this.airbornSibi) {
            if (this.inputKeys.leftPressed()) {
                this.facingRight = false;
                this.setFlipX(true);
                this.body.setVelocityX(-160);
            } else if (this.inputKeys.rightPressed()) {
                this.facingRight = true;
                this.setFlipX(false);
                this.body.setVelocityX(160);
            } else {
                this.body.setVelocityX(0);
            }
        }

        if (this.inputKeys.upPressed() && this.body.blocked.down) {
            this.body.setVelocityY(-110);
        }
    }

    burrowIfPossible(): void {
        if (this.isBurrowing) return;

        if (this.inputKeys.downPressed() && this.bottomTrack) {
            this.burrow(this.bottomTrack);
        } else if (this.inputKeys.leftPressed() && this.leftTrack) {
            this.burrow(this.leftTrack);
        } else if (this.inputKeys.rightPressed() && this.rightTrack) {
            this.burrow(this.rightTrack);
        } else if (this.inputKeys.upPressed() && this.topTrack) {
            this.burrow(this.topTrack);
        }
    }

    burrow(track: UndergroundTrack): void {
        this.isBurrowing = true;
        this.spawnTunneler(track);
        this.trackHook.setTrack(track);
        this.body.setAllowGravity(false);
        this.setAlpha(0);
        this.body.setVelocity(0, 0);
        this.collisionWithIntersections.active = true;
        this.hostileGroupCollision.active = false;
        this.collisionWithPlatforms.active = false;
        if (this.airbornSibi) {
            this.airbornSibi.destroy();
            this.airbornSibi = null;
        }
    }

    spawnTunneler(track: UndergroundTrack): void {
        this.tunneler = new TunnelerSibi({ scene: this.scene, x: this.x, y: this.y });
        this.scene.physics.add.overlap(this.tunneler.hitBox, this.underGroundHostileGroup, this.kill, null, this);
        this.tunneler.updateDirection(track.direction);
    }

    hookMovement(): void {
        let hasMoved: boolean = false;
        if (this.trackHook.track.isHorizontal) {
            if (this.inputKeys.leftPressed()) {
                this.trackHook.moveReverse();
                this.facingRight = false;
                hasMoved = true;
            } else if (this.inputKeys.rightPressed()) {
                this.trackHook.move();
                this.facingRight = true;
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

    launchIfButtonIsHeld(): void {
        let trackDirectionPressed: boolean = this.inputKeys.isDirectionPressed(this.trackHook.track.direction);
        if (this.launchHoldTween && !trackDirectionPressed) {
            this.removeLaunchHoldTween();
        } else if (!this.launchHoldTween && trackDirectionPressed) {
            if (!this.scene) return;
            this.launchHoldTween = this.scene.add.tween({
                targets: [this.scene.cameras.main],
                duration: 150,
                delay: 80,
                zoom: {
                    getStart: () => 1,
                    getEnd: () => this.launchCameraZoom,
                },
                onComplete: () => {
                    this.launchSibi();
                }
            });
        }
    }

    launchSibi(): void {
        this.isBurrowing = false;
        this.removeLaunchHoldTween();
        this.airbornSibi = new AirbornSibi({
            scene: this.scene,
            x: this.x,
            y: this.y,
            platforms: this.platforms,
            sibi: this,
            mainDirection: this.trackHook.track.direction
        });
        this.scene.physics.add.overlap(this.airbornSibi, this.hostileGroup, this.kill, null, this);
        this.tunneler.destroy();
        this.isBurrowing = false;
        this.collisionWithIntersections.active = false;
    }

    removeLaunchHoldTween(): void {
        if (this.launchHoldTween) {
            this.launchHoldTween.stop();
            this.launchHoldTween = null;
            this.scene.cameras.main.zoomTo(1, 50, 'Linear', true);
        }
    }

    onLandOnGround(): void {
        this.collisionWithPlatforms.active = true;
        this.hostileGroupCollision.active = true;
        this.body.setAllowGravity(true);
        this.setAlpha(1);
        this.airbornSibi = null;

        if (!this.facingRight)
            this.setFlipX(true);
        else
            this.setFlipX(false);
    }
}