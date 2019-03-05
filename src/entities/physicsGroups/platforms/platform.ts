import { UndergroundTrack } from '../../../helpers/underground/undergroundTrack';
import { Rectangle } from '../../../helpers/shapes/rectangle';
import { DirectionTrack } from '../../../helpers/underground/directionTrack';
import { Direction } from '../../../helpers/enums/direction';
export class Platform extends Phaser.GameObjects.TileSprite {

    static textureKey: string = 'OrangeRect';
    readonly topTrack: UndergroundTrack;
    readonly bottomTrack: UndergroundTrack;
    readonly rightTrack: UndergroundTrack;
    readonly leftTrack: UndergroundTrack;

    private XtopLeft: number;
    private YtopLeft: number;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y, width, height, Platform.textureKey);
        this.topTrack = new UndergroundTrack({ minBound: x, maxBound: x + width, constantAxisPosition: y });
        this.bottomTrack = new UndergroundTrack({ minBound: x, maxBound: x + width, constantAxisPosition: y + height });
        this.rightTrack = new UndergroundTrack({ minBound: y, maxBound: y + height, constantAxisPosition: x + width });
        this.leftTrack = new UndergroundTrack({ minBound: y, maxBound: y + height, constantAxisPosition: x });
        this.XtopLeft = this.x - this.width / 2;
        this.YtopLeft = this.y - this.height / 2;
        this.setOrigin(0, 0);
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);
    }

    getTrack(collider: Rectangle): DirectionTrack {
        if (collider.y + collider.height <= this.y)
            return { platformTrackDirection: Direction.Up, track: this.topTrack };
        else if (collider.y >= this.y + this.height)
            return { platformTrackDirection: Direction.Down, track: this.bottomTrack };
        else if (collider.x + collider.width <= this.x)
            return { platformTrackDirection: Direction.Left, track: this.leftTrack };
        else if (collider.x >= this.x + this.width)
            return { platformTrackDirection: Direction.Right, track: this.rightTrack };
    }
}