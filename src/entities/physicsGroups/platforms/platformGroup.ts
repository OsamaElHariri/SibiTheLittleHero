import { Platform, PlatformConfigs } from './platform';
import { TrackIntersectionGroup } from '../intersection/trackIntersectionGroup';

export class PlatformGroup extends Phaser.Physics.Arcade.StaticGroup {
    private trackIntersectionGroup: TrackIntersectionGroup;

    constructor(scene: Phaser.Scene, trackIntersectionGroup?: TrackIntersectionGroup) {
        super(scene.physics.world, scene);
        this.trackIntersectionGroup = trackIntersectionGroup;
    }
    createPlatform(x: number, y: number, config: PlatformConfigs): Platform {
        let platform: Platform = new Platform(this.scene, x, y, config, this.trackIntersectionGroup);
        this.add(platform);
        return platform;
    }
}