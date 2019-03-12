import { PlatformGroup } from "../platforms/platformGroup";
import { Direction } from "../../../helpers/enums/direction";
import { DirectionUtil } from "../../../helpers/directionUtil/directionUtil";

export class DigSaw extends Phaser.GameObjects.Sprite {

    private clockwise: boolean = false;
    private currentDirection: Direction = Direction.Down;

    private nextDirection: (direction: Direction) => Direction;

    private currentSpeed: number = 0;
    private maxSpeed: number = 600;
    private acceleration: number = 2;

    constructor(scene: Phaser.Scene, x: number, y: number, platforms: PlatformGroup, clockwise?: boolean) {
        super(scene, x, y, 'DigSaw');

        if (clockwise) this.clockwise = clockwise;

        this.nextDirection = this.clockwise ? DirectionUtil.counterClockWise : DirectionUtil.clockWise;

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.scene.physics.add.collider(this, platforms);
    }

    update(): void {
        this.currentSpeed = Math.min(this.currentSpeed + this.acceleration, this.maxSpeed);

        this.setDirection();
        switch (this.currentDirection) {
            case Direction.Up:
                this.body.setVelocityY(-this.currentSpeed);
                break;
            case Direction.Down:
                this.body.setVelocityY(this.currentSpeed);
                break;
            case Direction.Right:
                this.body.setVelocityX(this.currentSpeed);
                break;
            case Direction.Left:
                this.body.setVelocityX(-this.currentSpeed);
                break;
        }
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
        this.currentSpeed = 0;
        this.currentDirection = direction;
        this.body.setVelocity(0, 0);
    }

    isBlockedInDirection(direction: Direction): boolean {
        switch (direction) {
            case Direction.Up:
                return this.body.blocked.up;
            case Direction.Down:
                return this.body.blocked.down;
            case Direction.Right:
                return this.body.blocked.right;
            case Direction.Left:
                return this.body.blocked.left;
            default:
                return false;
        }
    }
}