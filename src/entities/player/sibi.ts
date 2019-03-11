import { InputKeys } from '../../helpers/inputKeys/inputKeys';
export class Sibi extends Phaser.GameObjects.Sprite {
  facingRight: boolean = true;
  
  protected isCurledUp: boolean = false;
  
  private keyboardInputs: InputKeys;


  constructor(params: { scene: Phaser.Scene, x: number, y: number, frame?: string | integer }) {
    super(params.scene, params.x, params.y, 'SibiIdle');

    this.scene.physics.world.enable(this);
    this.setNormalBody(true);

    this.keyboardInputs = InputKeys.getInstance();
    this.scene.add.existing(this);
    this.anims.play('Idle', true);
    this.body.setSize(22.2, 52.8);
    this.body.setOffset(7.5, 14);
  }

  update(): void {
    this.overGroundMovement();
  }

  overGroundMovement() {
    if (Math.abs(this.body.velocity.x) <= 300 || this.body.blocked.down) {
      if (this.keyboardInputs.leftPressed()) {
        this.facingRight = false;
        this.setFlipX(true);
        this.body.setVelocityX(-160);
      } else if (this.keyboardInputs.rightPressed()) {
        this.facingRight = true;
        this.setFlipX(false);
        this.body.setVelocityX(160);
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
    // this.setTexture('CurledSibi');
    this.body.setSize(25, 25);
    this.body.setOffset(7.5, 14);
  }

  setNormalBody(forceUpdate?: boolean): void {
    if (!this.isCurledUp && !forceUpdate) return;

    this.isCurledUp = false;
    this.angle = 0;
    this.y -= 25;
    // this.setTexture('SibiIdle');
    this.anims.play('Idle', true);
    this.body.setSize(22.2, 52.8);
    this.body.setOffset(7.5, 14);
  }
}