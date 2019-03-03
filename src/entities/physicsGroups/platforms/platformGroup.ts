import { MainScene } from '../../../scenes/mainScene';

export class PlatformGroup extends Phaser.Physics.Arcade.StaticGroup {
    private spriteKey: string = 'OrangeRect';

    constructor(scene: MainScene) {
        super(scene.physics.world, scene);
        scene.physics.add.collider(scene.player, this);
        this.createDefaultPlatforms();
    }

    createDefaultPlatforms(): void {
        this.createPlatform(0, 568, 800, 100);
        this.createPlatform(600, 400, 400, 100);
        this.createPlatform(50, 150, 400, 100);
        this.createPlatform(750, 120, 400, 100);
    }

    createPlatform(x: number, y: number, width: number, height: number) {
        let platform: Phaser.GameObjects.TileSprite =
            this.scene.add.tileSprite(x, y, width, height, this.spriteKey);
        this.scene.physics.world.enable(platform, Phaser.Physics.Arcade.STATIC_BODY);
        this.add(platform);
        return platform;
    }
}