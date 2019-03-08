import { UndergroundTrack } from "../../helpers/underground/undergroundTrack";
import { Direction } from "../../helpers/enums/direction";

export class TunnelerSibi extends Phaser.GameObjects.Sprite {

    private bodyWidth: number = 40;
    private bodyHeight: number = 30;

    constructor(params: { scene: Phaser.Scene, x: number, y: number, }) {
        super(params.scene, params.x, params.y, 'UndergroundSibi');

        this.scene.physics.world.enable(this);
        this.body.width = 40;
        this.body.height = 30;
        this.body.setAllowGravity(false);

        this.setOrigin(0.5, 1);

        this.scene.add.existing(this);
    }

    updateDirection(direction: Direction): void {
        switch (direction) {
            case Direction.Up:
                this.faceUp();
                break;
            case Direction.Left:
                this.faceLeft();
                break;
            case Direction.Down:
                this.faceDown();
                break;
            case Direction.Right:
                this.faceRight();
                break;
        }
    }

    faceUp(): void {
        this.setAngle(0);
        this.body.offset.y = 12;
        this.body.offset.x = 0;
        this.body.width = this.bodyWidth;
        this.body.height = this.bodyHeight;
    }

    faceRight(): void {
        this.setAngle(90);
        this.body.offset.y = -6;
        this.body.offset.x = -10;
        this.body.width = this.bodyHeight;
        this.body.height = this.bodyWidth;
    }

    faceDown(): void {
        this.setAngle(180);
        this.body.offset.y = -18;
        this.body.offset.x = 0;
        this.body.width = this.bodyWidth;
        this.body.height = this.bodyHeight;
    }

    faceLeft(): void {
        this.setAngle(-90);
        this.body.offset.y = -6;
        this.body.offset.x = 20;
        this.body.width = this.bodyHeight;
        this.body.height = this.bodyWidth;
    }
}