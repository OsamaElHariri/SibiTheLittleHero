import { PlatformGroup } from "../platforms/platformGroup";

export class DrillPillar extends Phaser.GameObjects.Container {

    private platforms: PlatformGroup;
    private overgroundGroup: Phaser.GameObjects.Group;
    private undergroundGroup: Phaser.GameObjects.Group;
    private pillarBodyWidth: number = 22;

    private segments: Phaser.GameObjects.Sprite[] = [];
    private leftCollider: Phaser.GameObjects.Rectangle;
    private rightCollider: Phaser.GameObjects.Rectangle;

    private isVertical: boolean;
    private speed: number = 0.5;
    private direction: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, platformGroup: PlatformGroup,
        config: { numberOfBodySegments?: number, isVertical?: boolean }) {
        super(scene, x, y);
        this.scene.add.existing(this);
        this.platforms = platformGroup;

        this.overgroundGroup = this.scene.data.get('OverGroundHostileGroup');
        this.undergroundGroup = this.scene.data.get('UnderGroundHostileGroup');

        this.isVertical = config.isVertical;
        if (config.isVertical) this.setAngle(90);

        let segmentCount: number = config.numberOfBodySegments || 5
        this.constructDrills(segmentCount);
        this.constructBodySegments(segmentCount);
        this.constructColliders(segmentCount);
    }

    constructBodySegments(numberOfSegments: number): void {
        for (let i = 0; i < numberOfSegments; i++) {
            let segment: Phaser.GameObjects.Sprite = this.scene.add.sprite(
                this.pillarBodyWidth * i, 0, 'DrillPillarBody')
                .setOrigin(0, 0);
            segment.anims.play('DrillBodyRotate');
            this.add(segment);
            this.segments.push(segment);
        }
    }

    constructDrills(numberOfSegments: number): void {
        this.add(
            this.scene.add.sprite(
                0, this.pillarBodyWidth / 2, 'MetalRod')
                .setOrigin(0.5));
        this.add(
            this.scene.add.sprite(
                numberOfSegments * this.pillarBodyWidth, this.pillarBodyWidth / 2, 'MetalRod')
                .setOrigin(0.5));
        this.add(
            this.scene.add.sprite(
                -3, this.pillarBodyWidth / 2, 'Drill')
                .setOrigin(0.5, 1)
                .setAngle(-90)
                .play('DrillRotate'));
        this.add(
            this.scene.add.sprite(
                numberOfSegments * this.pillarBodyWidth + 3, this.pillarBodyWidth / 2, 'Drill')
                .setOrigin(0.5, 1)
                .setAngle(90)
                .play('DrillRotate'));
    }

    constructColliders(numberOfSegments: number): void {
        let maxWidth: number = this.pillarBodyWidth * numberOfSegments;
        let width: number = this.isVertical ? this.pillarBodyWidth / 2 : maxWidth / 2 + 25;
        let height: number = this.isVertical ? maxWidth / 2 + 25 : this.pillarBodyWidth / 2;
        let y: number = this.isVertical ? this.pillarBodyWidth * 0.75 : this.pillarBodyWidth * 0.25;

        this.leftCollider = this.scene.add.rectangle(-25, y, width, height).setOrigin(0);
        this.scene.physics.world.enable(this.leftCollider);
        this.leftCollider.body.setAllowGravity(false);
        this.add(this.leftCollider);
        this.overgroundGroup.add(this.leftCollider);
        this.undergroundGroup.add(this.leftCollider);

        this.rightCollider = this.scene.add.rectangle(maxWidth / 2, y, width, height).setOrigin(0);
        this.scene.physics.world.enable(this.rightCollider);
        this.rightCollider.body.setAllowGravity(false);
        this.add(this.rightCollider);
        this.overgroundGroup.add(this.rightCollider);
        this.undergroundGroup.add(this.rightCollider);

        this.scene.physics.add.overlap(this.leftCollider, this.platforms, () => {
            if (this.direction == 0) this.reverseSegmentAnims();
            if (this.direction <= 0) this.direction = -1;
        }, null, this);
        this.scene.physics.add.overlap(this.rightCollider, this.platforms, () => {
            if (this.direction == 0) this.playSegmentAnims();
            if (this.direction >= 0) this.direction = 1;
        }, null, this);
    }

    reverseSegmentAnims(): void {
        this.segments.forEach((segment: Phaser.GameObjects.Sprite) => {
            segment.anims.playReverse('DrillBodyRotate')
        });
    }
    playSegmentAnims(): void {
        this.segments.forEach((segment: Phaser.GameObjects.Sprite) => {
            segment.anims.play('DrillBodyRotate')
        });
    }

    update(): void {
        if (this.isVertical) {
            this.y += this.speed * this.direction;
        } else {
            this.x += this.speed * this.direction;
        }

        this.direction *= 0.95;
        if (Math.abs(this.direction) < 0.25) this.direction = 0;
    }
}