import { InputKeys } from '../helpers/inputKeys/inputKeys';
import { PlatformGroup } from '../entities/physicsGroups/platforms/platformGroup';
import { CameraZoomInZone } from '../helpers/camera/cameraZoomInZone';
import { CameraTarget } from '../helpers/camera/cameraTarget';
import { BurrowingSibi } from '../entities/player/burrowingSibi';
import { TrackIntersectionGroup } from '../entities/physicsGroups/intersection/trackIntersectionGroup';
import { DigSawGroup } from '../entities/physicsGroups/digSaw/digSawGroup';
import { RockMelterGroup } from '../entities/physicsGroups/rockMelter/rockMelterGroup';
import { DoubleDrillsGroup } from '../entities/physicsGroups/doubleDrills/doubleDrillsGroup';
import { Dialog } from '../entities/ui/dialog/dialog';
import { DrillPillarGroup } from '../entities/physicsGroups/drillPillar/drillPillarGroup';
import { DrillMatGroup } from '../entities/physicsGroups/drillMat/drillMatGroup';
import { EntityType } from '../entities/physicsGroups/entityType';
import { JsonHandler } from '../helpers/levelEditor/jsonHandler';
import { LevelEditor } from '../helpers/levelEditor/levelEditor';
import { SawBeltGroup } from '../entities/physicsGroups/sawBelt/sawBeltGroup';
import { levels } from '../levels/levels';

export class MainScene extends Phaser.Scene {

  groupsNeedUpdate: Phaser.GameObjects.Group[] = [];
  miscGroup: Phaser.GameObjects.Group;
  player: BurrowingSibi;
  cursors: InputKeys;

  playerSpawnPosition: { x: number, y: number } = { x: 250, y: -100 };

  platformGroup: PlatformGroup;
  digSawGroup: DigSawGroup;
  rockMelterGroup: RockMelterGroup;
  drillPillarGroup: DrillPillarGroup;
  drillMatGroup: DrillMatGroup;
  doubleDrillsGroup: DoubleDrillsGroup;
  sawBeltGroup: SawBeltGroup;

  cameraTarget: CameraTarget;

  private level: number;
  private backgroundScene: Phaser.Scenes.ScenePlugin;
  private trackIntersectionGroup: TrackIntersectionGroup;
  private cameraZoomTriggers: Phaser.GameObjects.Group;

  private respawnDelay: number = 500;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  create(): void {
    this.cameraTarget = null;
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
    this.cameras.main.fadeIn(500);
    this.backgroundScene = this.scene.launch('BackgroundScene');
    this.scene.moveAbove('BackgroundScene', 'MainScene');
    this.data.set('OverGroundHostileGroup', this.add.group({ runChildUpdate: true }));
    this.data.set('UnderGroundHostileGroup', this.add.group({ runChildUpdate: true }));

    this.setupKeyboard();
    this.createPlatforms();
    this.createRockMelters();
    this.createSaws();
    this.createDrills();
    this.createDrillPillars();
    this.createDrillMats();
    this.createSawBelts();
    this.miscGroup = this.add.group();

    this.level = this.registry.get('Level') || 1;
    this.events.emit('LevelStart', this.level);

    new JsonHandler(this).instantiateFromJson(levels[this.level - 1]);
    this.spawnPlayer();

    this.miscGroup.add(new LevelEditor(this));

    // this.cameraZoomTriggers = this.add.group({
    //   runChildUpdate: true
    // });
    // this.cameraZoomTriggers.add(new CameraZoomInZone({ scene: this, x: 300, y: 450, camTarget: this.cameraTarget }));

    this.miscGroup.add(this.cameraTarget);
    this.groupsNeedUpdate = [];
    this.groupsNeedUpdate.push(this.miscGroup);

    this.groupsNeedUpdate.push(this.digSawGroup);
    this.groupsNeedUpdate.push(this.rockMelterGroup);
    this.groupsNeedUpdate.push(this.doubleDrillsGroup);
    this.groupsNeedUpdate.push(this.drillPillarGroup);
    this.groupsNeedUpdate.push(this.sawBeltGroup);

    this.events.on('PlayerDead', () => {
      this.time.addEvent({
        delay: this.respawnDelay,
        callbackScope: this,
        callback: () => {
          this.spawnPlayer();
        }
      });
    });
  }

  createAnims(): void {
    this.anims.create({
      key: 'Idle',
      frames: this.anims.generateFrameNumbers('SibiIdle', { start: 0, end: 24 }),
      frameRate: 20,
      repeat: -1
    });
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

  setupKeyboard(): void {
    InputKeys.setKeyboard(this.input.keyboard);
  }

  createPlatforms(): void {
    this.trackIntersectionGroup = new TrackIntersectionGroup(this);
    this.platformGroup = new PlatformGroup(this, this.trackIntersectionGroup);
  }
  createRockMelters(): void {
    this.rockMelterGroup = new RockMelterGroup(this, this.platformGroup);
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
    this.drillMatGroup = new DrillMatGroup(this);
  }

  createSawBelts(): void {
    this.sawBeltGroup = new SawBeltGroup(this);
  }

  spawnPlayer() {
    if (this.player && this.player.destroy) this.player.destroy();
    this.player = new BurrowingSibi({
      scene: this,
      x: this.playerSpawnPosition.x,
      y: this.playerSpawnPosition.y,
      platforms: this.platformGroup,
      trackIntersectionGroup: this.trackIntersectionGroup
    });
    this.miscGroup.add(this.player);

    if (!this.cameraTarget) {
      this.cameraTarget = new CameraTarget(this, this.player.body);
    } else {
      this.cameraTarget.setTarget(this.player);
    }
    this.events.emit('PlayerSpawned');
  }

  update(): void {
    this.registry.set('MainCameraPosition', { x: this.cameras.main.scrollX, y: this.cameras.main.scrollY });
    this.groupsNeedUpdate.forEach(group => {
      this.updateChildrenInGroup(group)
    });
  }

  updateChildrenInGroup(group: Phaser.GameObjects.Group) {
    group.children.entries.forEach(
      (child) => { child.update(); }
    );
  }

  spawnFromType(type: EntityType, x: number, y: number, config: any) {
    switch (type) {
      case EntityType.Platform:
        return this.platformGroup.createPlatform(x, y, config);
      case EntityType.DrillMat:
        return this.drillMatGroup.createDrillMat(x, y, config);
      case EntityType.DigSaw:
        return this.digSawGroup.createDigSaw(x, y, config);
      case EntityType.RockMelter:
        return this.rockMelterGroup.createRockMelter(x, y, config);
      case EntityType.DoubleDrill:
        return this.doubleDrillsGroup.createDrills(x, y, config);
      case EntityType.DrillPillar:
        return this.drillPillarGroup.createPillar(x, y, config);
      case EntityType.SawBelt:
        return this.sawBeltGroup.createSawBelt(x, y, config);
      default:
        throw `Type ${type} is unknown`;
    }
  }

  getSpawnedEntities(): any[] {
    let allEntities = [];
    allEntities = allEntities.concat(this.platformGroup.children.getArray());
    allEntities = allEntities.concat(this.digSawGroup.children.getArray());
    allEntities = allEntities.concat(this.rockMelterGroup.children.getArray());
    allEntities = allEntities.concat(this.drillPillarGroup.children.getArray());
    allEntities = allEntities.concat(this.drillMatGroup.children.getArray());
    allEntities = allEntities.concat(this.doubleDrillsGroup.children.getArray());
    allEntities = allEntities.concat(this.sawBeltGroup.children.getArray());
    return allEntities
  }

  goToLevel(level: number): void {
    this.registry.set('Level', level);
    this.cameras.main.fade(500, 0, 0, 0, false, (camera, progress) => {
      if (progress == 1) {
        this.backgroundScene.stop();
        this.scene.restart();
      }
    });
  }
}