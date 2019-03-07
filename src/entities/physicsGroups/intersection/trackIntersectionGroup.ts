import { TrackIntersection } from './trackIntersection';
import { Rectangle } from '../../../helpers/shapes/rectangle';
import { UndergroundTrack } from '../../../helpers/underground/undergroundTrack';

export class TrackIntersectionGroup extends Phaser.Physics.Arcade.StaticGroup {
    constructor(scene: Phaser.Scene) {
        super(scene.physics.world, scene);
    }

    createIntersection(
        dimensions: Rectangle,
        tracks: {
            topTrack?: UndergroundTrack,
            bottomTrack?: UndergroundTrack,
            rightTrack?: UndergroundTrack,
            leftTrack?: UndergroundTrack,
        }): TrackIntersection {
        let intersection: TrackIntersection = new TrackIntersection(this.scene, dimensions, tracks);
        this.add(intersection);
        return intersection;
    }
}