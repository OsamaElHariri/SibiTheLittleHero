import { InputKeys } from '../helpers/inputKeys/inputKeys';

export class MainScene extends Phaser.Scene {
  private platformGroup: Phaser.Physics.Arcade.StaticGroup;
  private player: Phaser.Physics.Arcade.Sprite;
  private cursors: InputKeys;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.load.image('BasicSquarePlatform', '../Assets/Sprites/Platforms/SimpleSquare.png');
    this.load.spritesheet("sibiIdle", "../Assets/Sprites/Sibi/SpriteSheets/Idle.png",
      { frameWidth: 300 / 4, frameHeight: 1064 / 8 });
  }

  create(): void {
    this.createPlatforms();
    this.createPlayer();
    this.physics.add.collider(this.player, this.platformGroup);
    // this.physics.add.overlap(this.player, this.platformGroup,
    //   (player: Phaser.GameObjects.GameObject, platform: Phaser.GameObjects.GameObject) => {
        
    //   });
    this.setupKeyboard();
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
  }

  createPlatforms(): void {
    this.platformGroup = this.physics.add.staticGroup();

    this.platformGroup.create(400, 568, 'BasicSquarePlatform').setScale(2, 1).refreshBody();
    this.platformGroup.create(600, 400, 'BasicSquarePlatform').setScale(1, 0.5).refreshBody();
    this.platformGroup.create(50, 150, 'BasicSquarePlatform').setScale(1, 0.5).refreshBody();
    this.platformGroup.create(750, 120, 'BasicSquarePlatform').setScale(1, 0.5).refreshBody();
  }

  createPlayer() {
    this.player = this.physics.add.sprite(100, 450, 'sibiIdle').setScale(0.5);

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('sibiIdle', { start: 0, end: 64 }),
      frameRate: 20,
      repeat: -1
    });

    this.player.anims.play('idle', true);
  }

  setupKeyboard(): void {
    this.cursors = InputKeys.getKeys();
    this.cursors.addUpKeys(
      this.input.keyboard.addKey('UP'),
      this.input.keyboard.addKey('W'),
    );
    this.cursors.addLeftKeys(
      this.input.keyboard.addKey('LEFT'),
      this.input.keyboard.addKey('A'),
    );
    this.cursors.addRightKeys(
      this.input.keyboard.addKey('RIGHT'),
      this.input.keyboard.addKey('D'),
    );
  }

  update(): void {
    if (this.cursors.leftPressed()) {
      this.player.setVelocityX(-160);
      let newScaleX: number = Math.abs(this.player.scaleX)
      this.player.setScale(-newScaleX, this.player.scaleY);
    } else if (this.cursors.rightPressed()) {
      this.player.setVelocityX(160);
      let newScaleX: number = Math.abs(this.player.scaleX)
      this.player.setScale(newScaleX, this.player.scaleY);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.upPressed() && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}