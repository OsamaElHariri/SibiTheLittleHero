import { InputKeys } from '../../helpers/inputKeys/inputKeys';
export class Sibi extends Phaser.GameObjects.Sprite {
  private keyboardInputs: InputKeys;

  protected facingRight: boolean = true;
  protected isCurledUp: boolean = false;

  constructor(params: { scene: Phaser.Scene, x: number, y: number, frame?: string | integer }) {
    super(params.scene, params.x, params.y, 'SibiIdle');

    this.scene.physics.world.enable(this);
    this.setNormalBody(true);

    this.keyboardInputs = InputKeys.getInstance();
    this.scene.add.existing(this);
    this.anims.play('Idle', true);
  }

  update(): void {
    this.overGroundMovement();
  }

  overGroundMovement() {
    if (Math.abs(this.body.velocity.x) <= 300 || this.body.blocked.down) {
      if (this.keyboardInputs.leftPressed()) {
        this.facingRight = false;
        this.body.setVelocityX(-160);
        this.setFlipX(true);
      } else if (this.keyboardInputs.rightPressed()) {
        this.facingRight = true;
        this.body.setVelocityX(160);
        this.setFlipX(false);
      } else {
        this.body.setVelocityX(0);
      }
    }

    if (this.keyboardInputs.upPressed() && this.body.blocked.down) {
      this.body.setVelocityY(-330);
      this.setCurledUpBody();
    }
  }

  setCurledUpBody(forceUpdate?: boolean): void {
    if (this.isCurledUp && !forceUpdate) return;

    this.isCurledUp = true;
    this.anims.stop();
    this.setTexture('CurledSibi');
    this.body.setSize(25, 25);
    this.body.setOffset(7.5, 14);
  }

  setNormalBody(forceUpdate?: boolean): void {
    if (!this.isCurledUp && !forceUpdate) return;

    this.isCurledUp = false;
    this.angle = 0;
    this.y -= 15;
    this.setTexture('SibiIdle');
    this.anims.play('Idle', true);
    this.body.setSize(22.2, 52.8);
    this.body.setOffset(7.5, 14);
  }
}