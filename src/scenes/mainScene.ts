import { InputKeys } from '../helpers/inputKeys/inputKeys';
import { PlatformGroup } from '../entities/physicsGroups/platforms/platformGroup';
import { CameraZoomInZone } from '../helpers/camera/cameraZoomInZone';
import { CameraTarget } from '../helpers/camera/cameraTarget';
import { BurrowingSibi } from '../entities/player/burrowingSibi';
import { TrackIntersectionGroup } from '../entities/physicsGroups/intersection/trackIntersectionGroup';
import { DigSawGroup } from '../entities/physicsGroups/digSaw/digSawGroup';
import { RockMelterGroup } from '../entities/physicsGroups/rockMelter/rockMelterGroup';
import { Direction } from '../helpers/enums/direction';
import { DoubleDrillsGroup } from '../entities/physicsGroups/doubleDrills/doubleDrillsGroup';
import { SpeechBubble } from '../entities/ui/dialog/speechBubble';
import { Dialog } from '../entities/ui/dialog/dialog';
import { DrillPillarGroup } from '../entities/physicsGroups/drillPillar/drillPillarGroup';
import { DrillMat } from '../entities/physicsGroups/drillMat/drillMat';

export class MainScene extends Phaser.Scene {
  private platformGroup: PlatformGroup;
  private trackIntersectionGroup: TrackIntersectionGroup;
  private digSawGroup: DigSawGroup;
  private cameraZoomTriggers: Phaser.GameObjects.Group;
  private cameraTarget: CameraTarget;
  player: BurrowingSibi;
  cursors: InputKeys;
  private rockMelterGroup: RockMelterGroup;
  private drillPillarGroup: DrillPillarGroup;

  private doubleDrillsGroup: DoubleDrillsGroup;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.load.image('SpeechBubble', '../Assets/Sprites/UI/SpeechBubble.png');
    this.load.image('SpeechBubbleMedium', '../Assets/Sprites/UI/SpeechBubbleMedium.png');
    this.load.image('SpeechBubbleSmall', '../Assets/Sprites/UI/SpeechBubbleSmall.png');

    this.load.image('PlatformEdge', '../Assets/Sprites/Platforms/Edge.png');
    this.load.image('PlatformEdgeRotated', '../Assets/Sprites/Platforms/EdgeRotated.png');
    this.load.image('PlatformCorner', '../Assets/Sprites/Platforms/Corner.png');
    for (let i = 1; i <= 5; i++) this.load.image(`Rock${i}`, `../Assets/Sprites/Platforms/Rock${i}.png`);
    this.load.image('MetalBrace', '../Assets/Sprites/Platforms/MetalBrace.png');
    this.load.image('Rock', '../Assets/Sprites/Environment/Rock.png');
    this.load.image('SmokeCloud', '../Assets/Sprites/Environment/SmokeCloud.png');

    this.load.image('YellowSquare', '../Assets/Sprites/Platforms/YellowSquare.png');

    this.load.image('DigSaw', '../Assets/Sprites/Enemies/DigSaw/DigSaw.png');
    this.load.image('DigSawDigArea', '../Assets/Sprites/Enemies/DigSaw/DigSawDigArea.png');

    this.load.image('MetalRod', '../Assets/Sprites/Enemies/DrillPillar/MetalRod.png');
    this.load.image('PillarDigArea', '../Assets/Sprites/Enemies/DrillPillar/PillarDigArea.png');
    this.load.image('PillarDigAreaVertical', '../Assets/Sprites/Enemies/DrillPillar/PillarDigAreaVertical.png');
    this.load.spritesheet('DrillPillarBody', '../Assets/Sprites/Enemies/DrillPillar/PillarBody.png',
      { frameWidth: 88 / 4, frameHeight: 22 });

    this.load.image("UndergroundSibi", "../Assets/Sprites/Sibi/UndergroundSibi.png");
    this.load.image("UndergroundIndicator", "../Assets/Sprites/Sibi/UndergroundIndicator.png");
    this.load.image("CurledSibi", "../Assets/Sprites/Sibi/CurledBall.png");
    this.load.spritesheet("SibiIdle", "../Assets/Sprites/Sibi/SpriteSheets/Idle.png",
      { frameWidth: 148 / 4, frameHeight: 396 / 6 });

    this.load.image('ThinMetalRod', '../Assets/Sprites/Enemies/ThinMetalRod.png');
    this.load.spritesheet("Drill", "../Assets/Sprites/Enemies/Drill.png",
      { frameWidth: 44 / 2, frameHeight: 64 / 2 });


    this.load.image("RockMelterCeilingSupport", "../Assets/Sprites/Enemies/RockMelter/CeilingSupport.png");
    this.load.image("RockMelter", "../Assets/Sprites/Enemies/RockMelter/Melter.png");
    this.load.image("MoltenBall", "../Assets/Sprites/Enemies/RockMelter/MoltenBall.png");
    this.load.spritesheet("MoltenPuddle", "../Assets/Sprites/Enemies/RockMelter/MoltenPuddleSheet.png",
      { frameWidth: 135, frameHeight: 78 / 4 });
    this.load.spritesheet("Smoke", "../Assets/Sprites/Enemies/RockMelter/Smoke.png",
      { frameWidth: 96 / 3, frameHeight: 296 / 4 });

    this.load.image("DrillsStand", "../Assets/Sprites/Enemies/DoubleDrills/Stand.png");
    this.load.image("DoubleDrillsGear", "../Assets/Sprites/Enemies/DoubleDrills/Gear.png");
    this.load.image("DrillsSupport", "../Assets/Sprites/Enemies/DoubleDrills/DrillsSupport.png");
    this.load.image("DoubleDrillDigArea", "../Assets/Sprites/Enemies/DoubleDrills/DoubleDrillDigArea.png");
  }

  create(): void {
    let dialog = new Dialog(this, [{
      key: 'Sibi',
      x: 100,
      y: 60,
      isOnTheRight: false,
    }, {
      key: 'SibiMother',
      x: 250,
      y: -110,
      isOnTheRight: true,
    }]);


    this.createAnims();
    this.scene.launch('BackgroundScene');
    this.scene.moveAbove('BackgroundScene', 'MainScene');
    this.data.set('OverGroundHostileGroup', this.add.group({ runChildUpdate: true }));
    this.data.set('UnderGroundHostileGroup', this.add.group({ runChildUpdate: true }));
    this.setupKeyboard();
    this.createPlatforms();
    this.spawnPlayer();
    this.createRockMelters();
    this.createSaws();
    this.createDrills();
    this.createDrillPillars();
    this.createDrillMats();
    this.cameraZoomTriggers = this.add.group({
      runChildUpdate: true
    });

    // this.cameraZoomTriggers.add(new CameraZoomInZone({ scene: this, x: 300, y: 450, camTarget: this.cameraTarget }));

    this.events.on('PlayerDead', () => {
      this.spawnPlayer();
    });
  }

  createAnims(): void {
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
    this.anims.create({
      key: 'DrillRotate',
      frames: this.anims.generateFrameNumbers('Drill', { start: 0, end: 3 }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: 'DrillBodyRotate',
      frames: this.anims.generateFrameNumbers('DrillPillarBody', { start: 0, end: 3 }),
      frameRate: 20,
      repeat: -1,
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
      x: 250,
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

  createDrills(): void {
    this.doubleDrillsGroup = new DoubleDrillsGroup(this, this.platformGroup);
  }

  createDrillPillars(): void {
    this.drillPillarGroup = new DrillPillarGroup(this, this.platformGroup);
  }

  createDrillMats(): void {
    new DrillMat(this, 50, 50, this.platformGroup, { width: 200 });
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
    this.doubleDrillsGroup.children.entries.forEach(
      (child) => { child.update(); }
    );
    this.drillPillarGroup.children.entries.forEach(
      (child) => { child.update(); }
    );
  }
}