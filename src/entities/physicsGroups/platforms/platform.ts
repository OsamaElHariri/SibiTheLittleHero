import { UndergroundTrack } from '../../../helpers/underground/undergroundTrack';
import { Rectangle } from '../../../helpers/shapes/rectangle';
import { Direction } from '../../../helpers/enums/direction';
import { TrackIntersectionGroup } from '../intersection/trackIntersectionGroup';
export class Platform extends Phaser.GameObjects.TileSprite {

    static textureKey: string = 'OrangeRect';
    readonly topTrack: UndergroundTrack;
    readonly bottomTrack: UndergroundTrack;
    readonly rightTrack: UndergroundTrack;
    readonly leftTrack: UndergroundTrack;

    private intersectionWidths: number = 6;
    private intersectionHeight: number = 6;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, intersectionsGroup?: TrackIntersectionGroup) {
        super(scene, x, y, width, height, Platform.textureKey);

        this.topTrack = new UndergroundTrack({ minBound: x, maxBound: x + width, constantAxisPosition: y, direction: Direction.Up });
        this.bottomTrack = new UndergroundTrack({ minBound: x, maxBound: x + width, constantAxisPosition: y + height, direction: Direction.Down });
        this.rightTrack = new UndergroundTrack({ minBound: y, maxBound: y + height, constantAxisPosition: x + width, direction: Direction.Right });
        this.leftTrack = new UndergroundTrack({ minBound: y, maxBound: y + height, constantAxisPosition: x, direction: Direction.Left });

        if (intersectionsGroup)
            this.setupIntersections(intersectionsGroup);


        this.setOrigin(0, 0);
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);
    }

    setupIntersections(intersectionGroup: TrackIntersectionGroup): void {
        this.setupTopLeftIntersection(intersectionGroup);
        this.setupTopRightIntersection(intersectionGroup);
        this.setupBottomLeftIntersection(intersectionGroup);
        this.setupBottomRightIntersection(intersectionGroup);
    }

    setupTopLeftIntersection(intersectionGroup: TrackIntersectionGroup): void {
        intersectionGroup.createIntersection({
            x: this.x,
            y: this.y,
            width: this.intersectionWidths,
            height: this.intersectionHeight
        }, {
                rightTrack: this.topTrack,
                bottomTrack: this.leftTrack
            });
    }

    setupTopRightIntersection(intersectionGroup: TrackIntersectionGroup): void {
        intersectionGroup.createIntersection({
            x: this.x + this.width,
            y: this.y,
            width: this.intersectionWidths,
            height: this.intersectionHeight
        }, {
                leftTrack: this.topTrack,
                bottomTrack: this.rightTrack
            });
    }

    setupBottomLeftIntersection(intersectionGroup: TrackIntersectionGroup): void {
        intersectionGroup.createIntersection({
            x: this.x,
            y: this.y + this.height,
            width: this.intersectionWidths,
            height: this.intersectionHeight
        }, {
                topTrack: this.leftTrack,
                rightTrack: this.bottomTrack
            });
    }

    setupBottomRightIntersection(intersectionGroup: TrackIntersectionGroup): void {
        intersectionGroup.createIntersection({
            x: this.x + this.width,
            y: this.y + this.height,
            width: this.intersectionWidths,
            height: this.intersectionHeight
        }, {
                topTrack: this.rightTrack,
                leftTrack: this.bottomTrack
            });
    }

    getTrack(collider: Rectangle): UndergroundTrack {
        if (collider.y + collider.height <= this.y)
            return this.topTrack;
        else if (collider.y >= this.y + this.height)
            return this.bottomTrack;
        else if (collider.x + collider.width <= this.x)
            return this.leftTrack;
        else if (collider.x >= this.x + this.width)
            return this.rightTrack;
    }
}