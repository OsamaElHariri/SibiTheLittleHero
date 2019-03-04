import { MainScene } from '../../scenes/mainScene';
import { InputKeys } from '../../helpers/inputKeys/inputKeys';
export class Sibi extends Phaser.Physics.Arcade.Sprite {
  private keyboardInputs: InputKeys;

  constructor(params: { scene: MainScene, x: number, y: number, frame?: string | integer, inputs: InputKeys }) {
    super(params.scene, params.x, params.y, 'SibiIdle');

    this.setupPhysics();
    this.body.setSize(this.body.width * 0.6, this.body.height * 0.8);
    this.body.setOffset(this.body.offset.x, this.body.offset.y + 10);
    this.keyboardInputs = params.inputs;
    this.scene.add.existing(this);

    this.anims.play('Idle', true);

  }

  setupPhysics(): void {
    this.scene.physics.world.enable(this);
  }

  update(): void {
    if (this.keyboardInputs.leftPressed()) {
      this.setVelocityX(-160);
      this.setFlipX(true);
    } else if (this.keyboardInputs.rightPressed()) {
      this.setVelocityX(160);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if (this.keyboardInputs.upPressed() && this.body.blocked.down) {
      this.setVelocityY(-330);
    }
  }
}