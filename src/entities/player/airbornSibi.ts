import { BurrowingSibi } from "./burrowingSibi";
import { InputKeys } from "../../helpers/inputKeys/inputKeys";
import { PlatformGroup } from "../physicsGroups/platforms/platformGroup";
import { Direction } from "../../helpers/enums/direction";
import { Platform } from "../physicsGroups/platforms/platform";
import { UndergroundTrack } from "../../helpers/underground/undergroundTrack";

export class AirbornSibi extends Phaser.GameObjects.Sprite {

    private inputKeys: InputKeys;
    private sibi: BurrowingSibi;

    private facingRight = false;

    constructor(params: { scene: Phaser.Scene, x: number, y: number, sibi: BurrowingSibi, platforms: PlatformGroup, mainDirection: Direction }) {
        super(params.scene, params.x, params.y, 'CurledSibi');

        this.inputKeys = InputKeys.getInstance();
        this.sibi = params.sibi;

        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        this.facingRight = this.sibi.facingRight;
        if (!this.facingRight)
            this.setFlipX(true);


        this.scene.physics.add.collider(this, params.platforms, this.onCollisionWithPlatforms, null, this);
        switch (params.mainDirection) {
            case Direction.Up:
                this.body.setVelocityY(-600);
                break;
            case Direction.Down:
                this.body.setVelocityY(600);
                break;
            case Direction.Right:
                this.body.setVelocityX(600);
                break;
            case Direction.Left:
                this.body.setVelocityX(-600);
                break;
        }
    }

    onCollisionWithPlatforms(self: BurrowingSibi, platform: Platform): void {
        let track: UndergroundTrack = platform.getTrack(self.body);
        this.sibi.setTrack(track);
    }

    update(): void {
        this.angle += 4.5 * (this.facingRight ? 1 : -1);

        if (this.active) {
            this.overGroundMovement();
            if (Math.abs(this.body.velocity.x) > 300) {
                this.body.velocity.x *= 0.95;
            }
            if (!this.inputKeys.upPressed() && this.body.velocity.y > -400 && this.body.velocity.y < -50) {
                this.body.velocity.y *= 0.9
            }
            this.sibi.x = this.x;
            this.sibi.y = this.y;
            if (this.body.blocked.down && !this.inputKeys.downPressed()) {
                this.sibi.facingRight = this.facingRight;
                this.sibi.setPosition(this.x, this.y - 20);
                this.sibi.onLandOnGround();
                this.destroy();
            }
        }
    }

    overGroundMovement() {

        if (Math.abs(this.body.velocity.x) <= 300) {
            if (this.inputKeys.leftPressed()) {
                this.facingRight = false;
                this.setFlipX(true);
                this.body.setVelocityX(-250);
            } else if (this.inputKeys.rightPressed()) {
                this.facingRight = true;
                this.setFlipX(false);
                this.body.setVelocityX(250);
            } else {
                this.body.setVelocityX(0);
            }
        }
    }
}