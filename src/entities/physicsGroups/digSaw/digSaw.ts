import { PlatformGroup } from "../platforms/platformGroup";
import { Direction } from "../../../helpers/enums/direction";
import { DirectionUtil } from "../../../helpers/directionUtil/directionUtil";
import { FollowCollider } from "../utilColliders/followCollider";
import { Platform } from "../platforms/platform";
import { EntityType } from "../entityType";

export class DigSaw extends Phaser.GameObjects.Sprite {
    entityType: EntityType = EntityType.DigSaw;
    xOriginal: number;
    yOriginal: number;

    private clockwise: boolean = false;
    private currentDirection: Direction = Direction.Down;

    private nextDirection: (direction: Direction) => Direction;

    private currentSpeed: number = 0;
    private maxSpeed: number = 550;
    private accelerationFactor: number = 1.15;
    private rotationDirection: number = -1;
    private maxRotationSpeed: number = 50;

    private spawnedObjects = [];
    config: DigSawConfigs;

    constructor(scene: Phaser.Scene, x: number, y: number, platforms: PlatformGroup,
        config: DigSawConfigs) {
        super(scene, x, y, 'DigSaw');
        this.xOriginal = x;
        this.yOriginal = y;
        this.config = config;
        this.setDepth(6);

        if (config.clockwise) {
            this.clockwise = config.clockwise;
            this.rotationDirection = 1;
        }
        this.currentDirection = config.initialDirection || Direction.Down;

        this.nextDirection = this.clockwise ? DirectionUtil.counterClockWise : DirectionUtil.clockWise;

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.scene.physics.add.collider(this, platforms);
        this.body.setSize(30, 30);
        this.body.setAllowGravity(false);
        let collider = new FollowCollider(this.scene, this, {
            isCircle: true,
            width: 50,
            xOffset: 13,
            yOffset: 13,
            isOverGroundHostile: true,
            isUnderGroundHostile: true
        });
        this.spawnedObjects.push(collider);
    }

    update(): void {
        this.currentSpeed = this.currentSpeed || 1.1;
        this.currentSpeed = Math.min(this.currentSpeed * this.accelerationFactor, this.maxSpeed);

        let speedFraction: number = Math.abs(this.body.speed) / this.maxSpeed;

        this.angle += Math.pow(speedFraction, 1.2) * this.maxRotationSpeed * this.rotationDirection;

        this.setDirection();
        this.body.setAllowGravity(false);
        this.applySpeedInDirection(this.currentSpeed, this.currentDirection);
    }

    setDirection(): void {
        if (this.justLandedDown())
            this.changeDirection(this.nextDirection(Direction.Down));
        else if (this.justLandedUp())
            this.changeDirection(this.nextDirection(Direction.Up));
        else if (this.justLandedLeft())
            this.changeDirection(this.nextDirection(Direction.Left));
        else if (this.justLandedRight())
            this.changeDirection(this.nextDirection(Direction.Right));
    }

    justLandedDown(): boolean {
        return this.checkBlockedAndDirection(this.body.blocked.down, Direction.Down);
    }

    justLandedUp(): boolean {
        return this.checkBlockedAndDirection(this.body.blocked.up, Direction.Up);
    }

    justLandedLeft(): boolean {
        return this.checkBlockedAndDirection(this.body.blocked.left, Direction.Left);
    }

    justLandedRight(): boolean {
        return this.checkBlockedAndDirection(this.body.blocked.right, Direction.Right);
    }

    private checkBlockedAndDirection(blockDirection: boolean, direction: Direction): boolean {
        return blockDirection && (this.currentDirection == direction);
    }

    changeDirection(direction: Direction): void {
        this.body.setVelocity(0, 0);
        this.currentSpeed = 0;
        this.currentDirection = direction;
    }

    applySpeedInDirection(speed: number, direction: Direction): void {
        switch (direction) {
            case Direction.Up:
                this.body.setVelocity(0, -speed);
                break;
            case Direction.Down:
                this.body.setVelocity(0, speed);
                break;
            case Direction.Right:
                this.body.setVelocity(speed, 0);
                break;
            case Direction.Left:
                this.body.setVelocity(-speed, 0);
                break;
        }
    }
    destroy() {
        this.spawnedObjects.forEach(obj => obj.destroy());
        super.destroy();
    }
}

export class DigSawConfigs {
    clockwise: boolean = false;
    initialDirection: Direction = Direction.Down;
    constructor(configs?: { clockwise?: boolean, initialDirection?: Direction }) {
        configs = configs || {};
        this.clockwise = configs.clockwise || this.clockwise;
        this.initialDirection = configs.initialDirection || this.initialDirection;
    }
}