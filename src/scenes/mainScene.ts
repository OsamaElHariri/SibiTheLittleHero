import { InputKeys } from '../helpers/inputKeys/inputKeys';
import { PlatformGroup } from '../entities/physicsGroups/platforms/platformGroup';
import { CameraZoomInZone } from '../helpers/camera/cameraZoomInZone';
import { CameraTarget } from '../helpers/camera/cameraTarget';
import { BurrowingSibi } from '../entities/player/burrowingSibi';
import { TrackIntersectionGroup } from '../entities/physicsGroups/intersection/trackIntersectionGroup';
import { DigSawGroup } from '../entities/physicsGroups/digSaw/digSawGroup';
import { RockMelterGroup } from '../entities/physicsGroups/rockMelter/rockMelterGroup';

export class MainScene extends Phaser.Scene {
  private platformGroup: PlatformGroup;
  private trackIntersectionGroup: TrackIntersectionGroup;
  private digSawGroup: DigSawGroup;
  private cameraZoomTriggers: Phaser.GameObjects.Group;
  private cameraTarget: CameraTarget;
  player: BurrowingSibi;
  cursors: InputKeys;
  private rockMelterGroup: RockMelterGroup;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.load.image('PlatformEdge', '../Assets/Sprites/Platforms/Edge.png');
    this.load.image('PlatformEdgeRotated', '../Assets/Sprites/Platforms/EdgeRotated.png');
    this.load.image('PlatformCorner', '../Assets/Sprites/Platforms/Corner.png');
    for (let i = 1; i <= 5; i++) this.load.image(`Rock${i}`, `../Assets/Sprites/Platforms/Rock${i}.png`);
    this.load.image('MetalBrace', '../Assets/Sprites/Platforms/MetalBrace.png');

    this.load.image('YellowSquare', '../Assets/Sprites/Platforms/YellowSquare.png');

    this.load.image('DigSaw', '../Assets/Sprites/Enemies/DigSaw.png');

    this.load.image("UndergroundSibi", "../Assets/Sprites/Sibi/UndergroundSibi.png");
    this.load.image("CurledSibi", "../Assets/Sprites/Sibi/CurledBall.png");
    this.load.spritesheet("SibiIdle", "../Assets/Sprites/Sibi/SpriteSheets/Idle.png",
      { frameWidth: 148 / 4, frameHeight: 396 / 6 });


    this.load.image("RockMelterCeilingSupport", "../Assets/Sprites/Enemies/RockMelter/CeilingSupport.png");
    this.load.image("RockMelter", "../Assets/Sprites/Enemies/RockMelter/Melter.png");
    this.load.image("MoltenBall", "../Assets/Sprites/Enemies/RockMelter/MoltenBall.png");
    this.load.spritesheet("MoltenPuddle", "../Assets/Sprites/Enemies/RockMelter/MoltenPuddleSheet.png",
      { frameWidth: 135, frameHeight: 78 / 4 });
    this.load.spritesheet("Smoke", "../Assets/Sprites/Enemies/RockMelter/Smoke.png",
      { frameWidth: 96 / 3, frameHeight: 296 / 4 });
  }

  create(): void {
    this.scene.launch('BackgroundScene');
    this.scene.moveAbove('BackgroundScene', 'MainScene');
    this.data.set('OverGroundHostileGroup', this.add.group({ runChildUpdate: true }));
    this.data.set('UnderGroundHostileGroup', this.add.group({ runChildUpdate: true }));
    this.setupKeyboard();
    this.createPlatforms();
    this.createRockMelters();
    this.spawnPlayer();
    this.createSaws();
    this.cameraZoomTriggers = this.add.group({
      runChildUpdate: true
    });

    // this.cameraZoomTriggers.add(new CameraZoomInZone({ scene: this, x: 300, y: 450, camTarget: this.cameraTarget }));

    let rect: Phaser.GameObjects.Rectangle = this.add.rectangle(300, 400, 20, 20, 0xff9821);
    this.physics.world.enable(rect);
    this.physics.add.collider(rect, this.platformGroup);
    this.physics.add.collider(rect, this.player);

    this.anims.create({
      key: 'SmokeDance',
      frames: this.anims.generateFrameNumbers('Smoke', { start: 0, end: 12 }),
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: 'MoltenPuddleMovement',
      frames: this.anims.generateFrameNumbers('MoltenPuddle', { start: 0, end: 2 }),
      frameRate: 7,
      repeat: -1,
      yoyo: true
    });

    this.events.on('PlayerDead', () => {
      this.spawnPlayer();
    });
  }

  createPlatforms(): void {
    this.trackIntersectionGroup = new TrackIntersectionGroup(this);
    this.platformGroup = new PlatformGroup(this, this.trackIntersectionGroup);
  }
  createRockMelters(): void {
    this.rockMelterGroup = new RockMelterGroup(this, this.platformGroup);
  }

  spawnPlayer() {
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
    if (!this.cameraTarget)
      this.cameraTarget = new CameraTarget(this, this.player.body);
    else
      this.cameraTarget.setTarget(this.player);
  }

  createSaws(): void {
    this.digSawGroup = new DigSawGroup(this, this.platformGroup);
  }

  setupKeyboard(): void {
    InputKeys.setKeyboard(this.input.keyboard);
  }

  update(): void {
    this.registry.set('MainCameraPosition', { x: this.cameras.main.scrollX, y: this.cameras.main.scrollY });
    this.player.update();
    this.cameraTarget.update();
    this.digSawGroup.children.entries.forEach(
      (child) => { child.update(); }
    );
    this.rockMelterGroup.children.entries.forEach(
      (child) => { child.update(); }
    );
  }
}