import { Platform } from './platform';
import { TrackIntersectionGroup } from '../intersection/trackIntersectionGroup';

export class PlatformGroup extends Phaser.Physics.Arcade.StaticGroup {
    private trackIntersectionGroup: TrackIntersectionGroup;

    constructor(scene: Phaser.Scene, trackIntersectionGroup?: TrackIntersectionGroup) {
        super(scene.physics.world, scene);
        this.trackIntersectionGroup = trackIntersectionGroup;
        this.createDefaultPlatforms();
    }

    createDefaultPlatforms(): void {
        this.createPlatform(0, 568, 800, 150);
        this.createPlatform(600, 400, 400, 150);
        this.createPlatform(-100, -50, 150, 200);
        this.createPlatform(-400, -50, 150, 200);
        this.createPlatform(750, 220, 400, 150);


        this.createPlatform(50, 150, 400, 150);
        this.createPlatform(470, 0, 400, 150);
        this.createPlatform(940, -150, 400, 150);
    }

    createPlatform(x: number, y: number, width: number, height: number): Platform {
        let platform: Platform = new Platform(this.scene, x, y, width, height, this.trackIntersectionGroup);
        this.add(platform);
        return platform;
    }
}