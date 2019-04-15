import { UndergroundTrack } from '../../../helpers/underground/undergroundTrack';
import { Rectangle } from '../../../helpers/shapes/rectangle';
import { Direction } from '../../../helpers/enums/direction';
import { TrackIntersectionGroup } from '../intersection/trackIntersectionGroup';
import { EntityType } from '../entityType';
export class Platform extends Phaser.GameObjects.Rectangle {
    entityType: EntityType = EntityType.Platform;
    spriteMask: Phaser.Display.Masks.BitmapMask;

    readonly topTrack: UndergroundTrack;
    readonly bottomTrack: UndergroundTrack;
    readonly rightTrack: UndergroundTrack;
    readonly leftTrack: UndergroundTrack;

    private intersectionWidths: number = 6;
    private intersectionHeight: number = 6;

    private imageWidth: number = 64;

    private spawnedObjects = [];

    config: PlatformConfigs;

    constructor(scene: Phaser.Scene, x: number, y: number,
        config: PlatformConfigs, intersectionsGroup?: TrackIntersectionGroup) {
        super(scene, x, y, config.width, config.height, 0x6d541d);
        this.config = config;
        let width: number = config.width;
        let height: number = config.height;
        this.depth = 1;

        this.topTrack = new UndergroundTrack({ minBound: x, maxBound: x + width, constantAxisPosition: y, direction: Direction.Up });
        this.bottomTrack = new UndergroundTrack({ minBound: x, maxBound: x + width, constantAxisPosition: y + height, direction: Direction.Down });
        this.rightTrack = new UndergroundTrack({ minBound: y, maxBound: y + height, constantAxisPosition: x + width, direction: Direction.Right });
        this.leftTrack = new UndergroundTrack({ minBound: y, maxBound: y + height, constantAxisPosition: x, direction: Direction.Left });

        this.setupEdgeSprites();
        this.setupCornerSprites();

        if (intersectionsGroup)
            this.setupIntersections(intersectionsGroup);

        this.setOrigin(0, 0);
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);

        let mask: Phaser.GameObjects.Graphics = this.scene.make.graphics({ fillStyle: { color: 0x000000 }, add: false })
            .fillRectShape(new Phaser.Geom.Rectangle(this.x, this.y, this.width, this.height));

        this.spriteMask = new Phaser.Display.Masks.BitmapMask(this.scene, mask);
    }

    setupCornerSprites(): void {
        let cornerDepth: number = 2;
        let corner1 = this.scene.add.sprite(this.x, this.y, 'PlatformCorner').setOrigin(0, 0).setDepth(cornerDepth);
        let corner2 = this.scene.add.sprite(this.x + this.width, this.y, 'PlatformCorner').setOrigin(1, 0).setFlip(true, false).setDepth(cornerDepth);
        let corner3 = this.scene.add.sprite(this.x, this.y + this.height, 'PlatformCorner').setOrigin(0, 1).setFlip(false, true).setDepth(cornerDepth);
        let corner4 = this.scene.add.sprite(this.x + this.width, this.y + this.height, 'PlatformCorner').setOrigin(1, 1).setFlip(true, true).setDepth(cornerDepth);
        this.spawnedObjects.push(corner1, corner2, corner3, corner4);
    }

    setupEdgeSprites(): void {
        let edgeDepth: number = 2;
        let edge1 = this.scene.add.tileSprite(this.x, this.y, this.width, this.imageWidth, 'PlatformEdge').setOrigin(0, 0).setDepth(edgeDepth);
        let edge2 = this.scene.add.tileSprite(this.x, this.y + this.height, this.width, this.imageWidth, 'PlatformEdge').setOrigin(0, 1).setDepth(edgeDepth).setFlipY(true);
        let edge3 = this.scene.add.tileSprite(this.x, this.y, this.imageWidth, this.height, 'PlatformEdgeRotated').setOrigin(0, 0).setDepth(edgeDepth);
        let edge4 = this.scene.add.tileSprite(this.x + this.width, this.y, this.imageWidth, this.height, 'PlatformEdgeRotated').setOrigin(1, 0).setDepth(edgeDepth).setFlipX(true);
        this.spawnedObjects.push(edge1, edge2, edge3, edge4);
    }

    setupIntersections(intersectionGroup: TrackIntersectionGroup): void {
        this.setupTopLeftIntersection(intersectionGroup);
        this.setupTopRightIntersection(intersectionGroup);
        this.setupBottomLeftIntersection(intersectionGroup);
        this.setupBottomRightIntersection(intersectionGroup);
    }

    setupTopLeftIntersection(intersectionGroup: TrackIntersectionGroup): void {
        let intersection = intersectionGroup.createIntersection({
            x: this.x,
            y: this.y,
            width: this.intersectionWidths,
            height: this.intersectionHeight
        }, {
                rightTrack: this.topTrack,
                bottomTrack: this.leftTrack
            });
        this.spawnedObjects.push(intersection);
    }

    setupTopRightIntersection(intersectionGroup: TrackIntersectionGroup): void {
        let intersection = intersectionGroup.createIntersection({
            x: this.x + this.width,
            y: this.y,
            width: this.intersectionWidths,
            height: this.intersectionHeight
        }, {
                leftTrack: this.topTrack,
                bottomTrack: this.rightTrack
            });
        this.spawnedObjects.push(intersection);
    }

    setupBottomLeftIntersection(intersectionGroup: TrackIntersectionGroup): void {
        let intersection = intersectionGroup.createIntersection({
            x: this.x,
            y: this.y + this.height,
            width: this.intersectionWidths,
            height: this.intersectionHeight
        }, {
                topTrack: this.leftTrack,
                rightTrack: this.bottomTrack
            });
        this.spawnedObjects.push(intersection);
    }

    setupBottomRightIntersection(intersectionGroup: TrackIntersectionGroup): void {
        let intersection = intersectionGroup.createIntersection({
            x: this.x + this.width,
            y: this.y + this.height,
            width: this.intersectionWidths,
            height: this.intersectionHeight
        }, {
                topTrack: this.rightTrack,
                leftTrack: this.bottomTrack
            });
        this.spawnedObjects.push(intersection);
    }

    getTrack(collider: Rectangle): UndergroundTrack {
        if (collider.y + collider.height <= this.y + 1)
            return this.topTrack;
        else if (collider.y >= this.y + this.height - 1)
            return this.bottomTrack;
        else if (collider.x + collider.width <= this.x + 1)
            return this.leftTrack;
        else if (collider.x >= this.x + this.width - 1)
            return this.rightTrack;
    }

    destroy() {

        this.spawnedObjects.forEach(obj => {
            obj.destroy();
        });
        super.destroy()
    }
}

export class PlatformConfigs {
    width: number = 150;
    height: number = 150;
    constructor(configs?: { width?: number, height?: number }) {
        configs = configs || {};
        this.width = configs.width || this.width;
        this.height = configs.height || this.height;
    }
}