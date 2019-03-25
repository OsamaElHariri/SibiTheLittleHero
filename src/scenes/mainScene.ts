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

export class MainScene extends Phaser.Scene {
  private platformGroup: PlatformGroup;
  private trackIntersectionGroup: TrackIntersectionGroup;
  private digSawGroup: DigSawGroup;
  private cameraZoomTriggers: Phaser.GameObjects.Group;
  private cameraTarget: CameraTarget;
  player: BurrowingSibi;
  cursors: InputKeys;
  private rockMelterGroup: RockMelterGroup;

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

    this.load.spritesheet("Drill", "../Assets/Sprites/Enemies/DoubleDrills/Drill.png",
      { frameWidth: 44 / 2, frameHeight: 64 / 2 });
    this.load.image("DrillsStand", "../Assets/Sprites/Enemies/DoubleDrills/Stand.png");
    this.load.image("DoubleDrillsGear", "../Assets/Sprites/Enemies/DoubleDrills/Gear.png");
    this.load.image("DrillsSupport", "../Assets/Sprites/Enemies/DoubleDrills/DrillsSupport.png");
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

    dialog.startDialog([
      {
        key: 'SibiMother',
        text: 'Sibi, is that you?',
        config: {
          addedDelay: 100,
          postPause: 1000
        }
      },
      {
        key: 'SibiMother',
        text: 'Oh dear',
        config: {
          addedDelay: 100,
          postPause: 1000
        }
      },
      {
        key: 'SibiMother',
        text: "You didn't have to risk your life for me",
        config: {
          addedDelay: 50,
          postPause: 1000
        }
      },
      {
        key: 'SibiMother',
        text: "You should have left when you could",
        config: {
          addedDelay: 50,
          postPause: 500
        }
      },
      {
        key: 'Sibi',
        text: 'Mom...',
        config: {}
      },
      {
        key: 'SibiMother',
        text: "I'm not worth saving...",
        config: { addedDelay: 50,
          postPause: 500 }
      },
      {
        key: 'SibiMother',
        text: "An old woman like me should be the last thing on your mind",
        config: {}
      },
      {
        key: 'Sibi',
        text: 'Mom!',
        config: {}
      },
      {
        key: 'SibiMother',
        text: 'You must be very scared',
        config: {
          postPause: 500
        }
      },
      {
        key: 'SibiMother',
        text: "You're brave for being here",
        config: {
          postPause: 500
        }
      },
      {
        key: 'SibiMother',
        text: "Oh, how I hate myself for having to put you through this, I...",
        config: {}
      },
      {
        key: 'Sibi',
        text: 'MOM, Enough!',
        config: {
          postPause: 1500
        }
      },
      {
        key: 'Sibi',
        text: "I'm here now, I'm getting you out of here",
        config: {
          postPause: 200
        }
      },
      {
        key: 'Sibi',
        text: "I'd come for you always and no matter what",
        config: {
          postPause: 600
        }
      },
      {
        key: 'Sibi',
        text: "Every single time",
        config: {
          postPause: 1500
        }
      },
      {
        key: 'SibiMother',
        text: "Oh, Sibi. I thought I was going to die",
        config: {
          addedDelay: 100
        }
      },
      {
        key: 'Sibi',
        text: "Mom...",
        config: {
          addedDelay: 50
        }
      },
      {
        key: 'SibiMother',
        text: "I was so scared",
        config: {
          addedDelay: 200
        }
      },
      {
        key: 'Sibi',
        text: "I...",
        config: {
          addedDelay: 50
        }
      },
      {
        key: 'SibiMother',
        text: "I am so scared",
        config: {
          addedDelay: 250
        }
      },
      {
        key: 'Sibi',
        text: "I know",
        config: {
          addedDelay: 100,
          postPause: 3000
        }
      },
      {
        key: 'Sibi',
        text: "Come on, let's get out of here",
        config: {}
      },
    ]);

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

  createDrills(): void {
    this.doubleDrillsGroup = new DoubleDrillsGroup(this, this.platformGroup);
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
  }
}