import { InputKeys } from '../helpers/inputKeys/inputKeys';
import { Sibi } from '../entities/player/sibi';
import { PlatformGroup } from '../entities/physicsGroups/platforms/platformGroup';
import { CameraZoomInZone } from '../helpers/camera/cameraZoomInZone';
import { CameraTarget } from '../helpers/camera/cameraTarget';

export class MainScene extends Phaser.Scene {
  private platformGroup: Phaser.GameObjects.Group;
  private cameraZoomTriggers: Phaser.GameObjects.Group;
  private cameraTarget: CameraTarget;
  player: Sibi;
  cursors: InputKeys;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.load.image('BasicSquarePlatform', '../Assets/Sprites/Platforms/SimpleSquare.png');
    this.load.image('OrangeRect', '../Assets/Sprites/Platforms/OrangeRect.png');
    this.load.image('YellowSquare', '../Assets/Sprites/Platforms/YellowSquare.png');
    this.load.image("SibiHead", "../Assets/Sprites/Sibi/Head.png");
    this.load.spritesheet("SibiIdle", "../Assets/Sprites/Sibi/SpriteSheets/Idle.png",
      { frameWidth: 300 / 4, frameHeight: 1064 / 8 });
  }

  create(): void {
    this.setupKeyboard();
    this.createPlayer();
    this.cameraTarget = new CameraTarget(this, this.player.body);
    this.createPlatforms();
    this.cameraZoomTriggers = this.add.group({
      runChildUpdate: true
    });

    this.cameraZoomTriggers.add(new CameraZoomInZone({ scene: this, x: 300, y: 450, camTarget: this.cameraTarget }));

    let rect: Phaser.GameObjects.Rectangle = this.add.rectangle(300, 400, 20,20, 0xff9821);
    this.physics.world.enable(rect);
    this.physics.add.collider(rect, this.platformGroup);
    this.physics.add.collider(rect, this.player);
  }

  createPlatforms(): void {
    this.platformGroup = new PlatformGroup(this);
  }

  createPlayer() {
    this.anims.create({
      key: 'Idle',
      frames: this.anims.generateFrameNumbers('SibiIdle', { start: 0, end: 64 }),
      frameRate: 20,
      repeat: -1
    });

    this.player = new Sibi({
      scene: this,
      x: 100,
      y: 450,
      inputs: this.cursors
    }).setScale(0.5);
  }

  setupKeyboard(): void {
    this.cursors = new InputKeys(this.input.keyboard);
  }

  update(): void {
    this.player.update();
    this.cameraTarget.update();
  }
}