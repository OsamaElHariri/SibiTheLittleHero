import { Platform } from './platform';

export class PlatformGroup extends Phaser.Physics.Arcade.StaticGroup {
    constructor(scene: Phaser.Scene) {
        super(scene.physics.world, scene);
        this.createDefaultPlatforms();
    }

    createDefaultPlatforms(): void {
        this.createPlatform(0, 568, 800, 100);
        this.createPlatform(600, 400, 400, 100);
        this.createPlatform(50, 150, 400, 100);
        this.createPlatform(750, 220, 400, 100);
    }

    createPlatform(x: number, y: number, width: number, height: number) {
        let platform: Platform = new Platform(this.scene, x, y, width, height);
        this.add(platform);
        return platform;
    }
}