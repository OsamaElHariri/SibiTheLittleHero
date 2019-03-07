import { UndergroundTrack } from '../../../helpers/underground/undergroundTrack';
import { Rectangle } from '../../../helpers/shapes/rectangle';
export class TrackIntersection extends Phaser.GameObjects.Rectangle {
    topTrack: UndergroundTrack;
    bottomTrack: UndergroundTrack;
    rightTrack: UndergroundTrack;
    leftTrack: UndergroundTrack;
    constructor(
        scene: Phaser.Scene,
        dimensions: Rectangle,
        tracks: {
            topTrack?: UndergroundTrack,
            bottomTrack?: UndergroundTrack,
            rightTrack?: UndergroundTrack,
            leftTrack?: UndergroundTrack,
        }) {
        super(scene, dimensions.x, dimensions.y, dimensions.width, dimensions.height);
        this.scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);

        this.topTrack = tracks.topTrack;
        this.bottomTrack = tracks.bottomTrack;
        this.rightTrack = tracks.rightTrack;
        this.leftTrack = tracks.leftTrack;
    }
}