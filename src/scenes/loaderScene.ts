export class LoaderScene extends Phaser.Scene {

  constructor() {
    super({
      key: "LoaderScene"
    });
  }

  preload(): void {
    this.load.image('MineWall', '../Assets/Sprites/Environment/MineWall.png');
    this.load.image('WoodenPillars', '../Assets/Sprites/Environment/WoodenPillars.png');
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

    this.load.image('SawBelt', '../Assets/Sprites/Enemies/SawBelt/Saw.png');
    this.load.image('SawBeltDigArea', '../Assets/Sprites/Enemies/SawBelt/DigAreaMid.png');
    this.load.image('SawBeltDigAreaEdge', '../Assets/Sprites/Enemies/SawBelt/DigAreaEdge.png');

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
    this.scene.start('MainScene');
  }
}