import { InputKeys } from '../../helpers/inputKeys/inputKeys';
export class Sibi extends Phaser.GameObjects.Sprite {
  private keyboardInputs: InputKeys;

  constructor(params: { scene: Phaser.Scene, x: number, y: number, frame?: string | integer}) {
    super(params.scene, params.x, params.y, 'SibiIdle');

    this.scene.physics.world.enable(this);
    this.body.setSize(this.body.width * 0.6, this.body.height * 0.8);
    this.body.setOffset(this.body.offset.x, this.body.offset.y + 7);
    
    this.keyboardInputs = InputKeys.getInstance();
    this.scene.add.existing(this);
    this.anims.play('Idle', true);
  }

  update(): void {
    this.overGroundMovement();
  }

  overGroundMovement() {

    if (this.keyboardInputs.leftPressed()) {
      this.body.setVelocityX(-160);
      this.setFlipX(true);
    } else if (this.keyboardInputs.rightPressed()) {
      this.body.setVelocityX(160);
      this.setFlipX(false);
    } else {
      this.body.setVelocityX(0);
    }

    if (this.keyboardInputs.upPressed() && this.body.blocked.down) {
      this.body.setVelocityY(-330);
    }
  }
}