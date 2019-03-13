import { PlatformGroup } from "../platforms/platformGroup";
import { Direction } from "../../../helpers/enums/direction";
import { DirectionUtil } from "../../../helpers/directionUtil/directionUtil";

export class DigSaw extends Phaser.GameObjects.Sprite {

    private clockwise: boolean = false;
    private currentDirection: Direction = Direction.Down;

    private nextDirection: (direction: Direction) => Direction;
    private previousDirection: (direction: Direction) => Direction;

    private currentSpeed: number = 0;
    private maxSpeed: number = 600;
    private accelerationFactor: number = 1.15;

    constructor(scene: Phaser.Scene, x: number, y: number, platforms: PlatformGroup, clockwise?: boolean) {
        super(scene, x, y, 'DigSaw');

        if (clockwise) this.clockwise = clockwise;

        this.nextDirection = this.clockwise ? DirectionUtil.counterClockWise : DirectionUtil.clockWise;
        this.previousDirection = this.clockwise ? DirectionUtil.clockWise : DirectionUtil.counterClockWise;

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.scene.physics.add.collider(this, platforms);
    }

    update(): void {
        this.currentSpeed = this.currentSpeed || 1.1;
        this.currentSpeed = Math.min(this.currentSpeed * this.accelerationFactor, this.maxSpeed);

        if (this.body.blocked.none) {
            this.currentDirection = null;
        } else {
            this.setDirection();
            this.applySpeedInDirection(this.currentSpeed, this.currentDirection);
            if (this.currentDirection) this.applySpeedInDirection(50, this.previousDirection(this.currentDirection));
        }
        this.body.setAllowGravity(this.body.blocked.none);
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
        return blockDirection && (!this.currentDirection || this.currentDirection == direction);
    }

    changeDirection(direction: Direction): void {
        this.body.setVelocity(0, 0);
        this.currentSpeed = 0;
        this.currentDirection = direction;
    }

    applySpeedInDirection(speed: number, direction: Direction): void {
        switch (direction) {
            case Direction.Up:
                this.body.setVelocityY(-speed);
                break;
            case Direction.Down:
                this.body.setVelocityY(speed);
                break;
            case Direction.Right:
                this.body.setVelocityX(speed);
                break;
            case Direction.Left:
                this.body.setVelocityX(-speed);
                break;
        }
    }
}