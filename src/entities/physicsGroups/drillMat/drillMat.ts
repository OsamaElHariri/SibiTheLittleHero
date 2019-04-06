import { Direction } from "../../../helpers/enums/direction";
import { EntityType } from "../entityType";

export class DrillMat extends Phaser.GameObjects.Rectangle {
    entityType: EntityType = EntityType.DrillMat;

    private miniDrillWidth: number = 15;
    private overgroundGroup: Phaser.GameObjects.Group;

    private container: Phaser.GameObjects.Container;
    private rockParticles: Phaser.GameObjects.Particles.ParticleEmitterManager;

    config: DrillMatConfigs;

    constructor(scene: Phaser.Scene, x: number, y: number,
        config: DrillMatConfigs) {
        super(scene, x, y, config.width, 15);
        let height: number = 15;

        this.config = config;
        config.width = config.width || 100;

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.setOrigin(0.5);

        this.overgroundGroup = this.scene.data.get('OverGroundHostileGroup');
        this.overgroundGroup.add(this);

        this.container = this.scene.add.container(this.x, this.y);

        this.spawnDrillSprites();

        let direction: Direction = config.direction || Direction.Right;

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
        this.rockParticles = this.scene.add.particles('Rock');
        this.rockParticles.setDepth(2).createEmitter({
            x: this.x - this.body.width / 2,
            y: this.y - this.body.height / 2,
            scale: { start: 0.3, end: 0.4 },
            alpha: { start: 1.0, end: 0, ease: 'Sine.easeIn' },
            angle: { min: 240, max: 300 },
            gravityY: 1000,
            lifespan: 250,
            speed: { min: 220, max: 50 },
            quantity: 2,
            frequency: 250,
            emitZone: { source: new Phaser.Geom.Rectangle(0, 0, this.body.width, this.body.height) }
        });
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

    destroy() {
        this.container.removeAll(true);
        this.container.destroy();
        this.rockParticles.destroy();
        super.destroy();
    }
}

export class DrillMatConfigs {
    width: number = 100;
    direction: Direction = Direction.Up;
    constructor(configs?: { width?: number, direction?: Direction }) {
        configs = configs || {};
        this.width = configs.width || this.width;
        this.direction = configs.direction || this.direction;
    }
}