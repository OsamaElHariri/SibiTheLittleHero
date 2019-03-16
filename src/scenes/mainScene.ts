import { InputKeys } from '../helpers/inputKeys/inputKeys';
import { PlatformGroup } from '../entities/physicsGroups/platforms/platformGroup';
import { CameraZoomInZone } from '../helpers/camera/cameraZoomInZone';
import { CameraTarget } from '../helpers/camera/cameraTarget';
import { BurrowingSibi } from '../entities/player/burrowingSibi';
import { TrackIntersectionGroup } from '../entities/physicsGroups/intersection/trackIntersectionGroup';
import { DigSawGroup } from '../entities/physicsGroups/digSaw/digSawGroup';

export class MainScene extends Phaser.Scene {
  private platformGroup: PlatformGroup;
  private trackIntersectionGroup: TrackIntersectionGroup;
  private digSawGroup: DigSawGroup;
  private cameraZoomTriggers: Phaser.GameObjects.Group;
  private cameraTarget: CameraTarget;
  player: BurrowingSibi;
  cursors: InputKeys;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    for (let i = 1; i <= 5; i++) {
      this.load.image(`Rock${i}`, `../Assets/Sprites/Platforms/Rock${i}.png`);
    }
    this.load.image('PlatformEdge', '../Assets/Sprites/Platforms/Edge.png');
    this.load.image('PlatformEdgeRotated', '../Assets/Sprites/Platforms/EdgeRotated.png');
    this.load.image('PlatformCorner', '../Assets/Sprites/Platforms/Corner.png');
    this.load.image('MetalBrace', '../Assets/Sprites/Platforms/MetalBrace.png');
    this.load.image('BasicSquarePlatform', '../Assets/Sprites/Platforms/SimpleSquare.png');
    this.load.image('OrangeRect', '../Assets/Sprites/Platforms/OrangeRect.png');
    this.load.image('YellowSquare', '../Assets/Sprites/Platforms/YellowSquare.png');
    this.load.image('DigSaw', '../Assets/Sprites/Enemies/DigSaw.png');
    this.load.image("UndergroundSibi", "../Assets/Sprites/Sibi/UndergroundSibi.png");
    this.load.image("CurledSibi", "../Assets/Sprites/Sibi/CurledBall.png");
    this.load.spritesheet("SibiIdle", "../Assets/Sprites/Sibi/SpriteSheets/Idle.png",
      { frameWidth: 148 / 4, frameHeight: 396 / 6 });
  }

  create(): void {
    this.data.set('HostileGroup', this.add.group({runChildUpdate: true}))
    this.setupKeyboard();
    this.createPlatforms();
    this.createPlayer();
    this.createSaws();
    this.cameraTarget = new CameraTarget(this, this.player.body);
    this.player.cameraTarget = this.cameraTarget;
    this.cameraZoomTriggers = this.add.group({
      runChildUpdate: true
    });

    this.cameraZoomTriggers.add(new CameraZoomInZone({ scene: this, x: 300, y: 450, camTarget: this.cameraTarget }));

    let rect: Phaser.GameObjects.Rectangle = this.add.rectangle(300, 400, 20, 20, 0xff9821);
    this.physics.world.enable(rect);
    this.physics.add.collider(rect, this.platformGroup);
    this.physics.add.collider(rect, this.player);
  }

  createPlatforms(): void {
    this.trackIntersectionGroup = new TrackIntersectionGroup(this);
    this.platformGroup = new PlatformGroup(this, this.trackIntersectionGroup);
  }

  createPlayer() {
    this.anims.create({
      key: 'Idle',
      frames: this.anims.generateFrameNumbers('SibiIdle', { start: 0, end: 24 }),
      frameRate: 20,
      repeat: -1
    });

    this.player = new BurrowingSibi({
      scene: this,
      x: 100,
      y: -100,
      platforms: this.platformGroup,
      trackIntersectionGroup: this.trackIntersectionGroup
    });
  }

  createSaws(): void {
    this.digSawGroup = new DigSawGroup(this, this.platformGroup);
  }

  setupKeyboard(): void {
    InputKeys.setKeyboard(this.input.keyboard);
  }

  update(): void {
    this.player.update();
    this.cameraTarget.update();
    this.digSawGroup.children.entries.forEach(
      (child) => { child.update(); }
  )
  }
}