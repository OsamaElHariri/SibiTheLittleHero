import { PlatformGroup } from "../platforms/platformGroup";
import { Direction } from "../../../helpers/enums/direction";

export class DrillMat extends Phaser.GameObjects.Rectangle {

    private miniDrillWidth: number = 15;
    private overgroundGroup: Phaser.GameObjects.Group;

    private container: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene, x: number, y: number, platformGroup: PlatformGroup,
        config: { width?: number, direction?: Direction }) {
        super(scene, x, y, config.width || 100, 15);
        let height: number = 15;
        config.width = config.width || 100;

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.setOrigin(0.5);

        this.overgroundGroup = this.scene.data.get('OverGroundHostileGroup');
        this.overgroundGroup.add(this);

        this.container = this.scene.add.container(this.x, this.y);

        this.spawnDrillSprites();

        let direction: Direction = config.direction || Direction.Up;

        switch (direction) {
            case Direction.Right:
                this.container.angle = 90;
                this.body.setSize(height, config.width);
                break;
            case Direction.Down:
                this.container.angle = 180;
                break;
            case Direction.Left:
                this.container.angle = -90;
                this.body.setSize(height, config.width);
                break;
        }
        let particles: Phaser.GameObjects.Particles.ParticleEmitterManager = this.scene.add.particles('Rock');
        particles.setDepth(2).createEmitter({
            x: this.x - this.body.width / 2,
            y: this.y - this.body.height / 2,
            scale: { start: 0.5, end: 0.6 },
            alpha: { start: 1.0, end: 0, ease: 'Sine.easeIn' },
            angle: { min: 240, max: 300 },
            gravityY: 1000,
            lifespan: 400,
            speed: {min: 220, max: 50},
            quantity: 2,
            frequency: 150,
            emitZone: { source: new Phaser.Geom.Rectangle(0, 0, this.body.width, this.body.height) }
        });

        // this.container.add(particles);
    }

    spawnDrillSprites(): void {
        this.spawnDrillRow(0.4, 1.25, 6, 0.7);
        this.spawnDrillRow(0.5, 1.2, 0, 1);

    }

    spawnDrillRow(scale: number, drillOrigin: number, offset: number, alpha: number): void {
        let max: number = this.width / this.miniDrillWidth / 2;
        let min = -max;
        for (let i: number = min; i < max; i++) {
            let angle: number = Math.random() * 20 - 10;
            this.container.add(
                this.scene.add.sprite(i * this.miniDrillWidth + offset, 0, 'ThinMetalRod')
                    .setOrigin(0.5, 1)
                    .setScale(scale)
                    .setAlpha(alpha)
                    .setAngle(angle)
            );
            this.container.add(
                this.scene.add.sprite(i * this.miniDrillWidth + offset, 0, 'Drill')
                    .play('DrillRotate', true, Math.floor(Math.random() * 4))
                    .setOrigin(0.5, drillOrigin)
                    .setScale(scale)
                    .setAlpha(alpha)
                    .setAngle(angle)
            );
        }
    }

}