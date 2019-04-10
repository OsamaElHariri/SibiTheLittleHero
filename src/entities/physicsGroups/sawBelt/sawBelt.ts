import { EntityType } from "../entityType";

export class SawBelt extends Phaser.GameObjects.Rectangle {
    entityType: EntityType = EntityType.SawBelt;

    private container: Phaser.GameObjects.Container;

    private undergroundGroup: Phaser.GameObjects.Group;
    private sawWidth: number = 22;

    private saws: Phaser.GameObjects.Sprite[] = [];

    config: SawBeltConfigs;

    constructor(scene: Phaser.Scene, x: number, y: number,
        config: SawBeltConfigs) {
        super(scene, x, y, config.isVertical ? 22 : 22 * config.numberOfSaws, config.isVertical ? 22 * config.numberOfSaws : 22);
        this.scene.add.existing(this);
        this.setOrigin(0, 0.5);
        this.config = config;

        this.container = this.scene.add.container(x, y).setDepth(4);

        this.undergroundGroup = this.scene.data.get('UnderGroundHostileGroup');

        if (this.config.isVertical) this.container.setAngle(90);

        this.constructDigAreas();
        this.constructBar();
        this.constructSaws();

    }

    constructDigAreas(): void {
        for (let i = 0; i < this.config.numberOfSaws; i++) {
            let sprite = this.scene.add.sprite(i * this.sawWidth, 0, 'SawBeltDigArea').setOrigin(0, 0.5);
            this.container.add(sprite);
        }

        let leftEdge = this.scene.add.sprite(0, 0, 'SawBeltDigAreaEdge').setOrigin(0.9, 0.5);
        this.container.add(leftEdge);

        let rightEdge = this.scene.add.sprite(this.config.numberOfSaws * this.sawWidth, 0, 'SawBeltDigAreaEdge').setOrigin(0.1, 0.5).setFlipX(true);
        this.container.add(rightEdge);

    }

    constructBar(): void {
        let bar = this.scene.add.rectangle(0, 0, this.config.numberOfSaws * this.sawWidth, 8, 0x6d541d).setOrigin(0, 0.5);
        this.scene.physics.world.enable(bar);
        bar.body.setAllowGravity(false);
        this.undergroundGroup.add(bar);
        if (this.config.isVertical) {
            let width = this.config.numberOfSaws * this.sawWidth;
            bar.body.setSize(8, width);
            bar.body.offset.x -= width / 2;
            bar.body.offset.y += width / 2;
        }
        this.container.add(bar);
    }

    constructSaws(): void {
        for (let i = 0; i < this.config.numberOfSaws; i++) {
            let saw = this.scene.add.sprite((i + 0.5) * this.sawWidth, 0, 'SawBelt')
                .setOrigin(0.5)
                .setAngle(Math.random() * 360);
            this.saws.push(saw)
            this.container.add(saw);
        }
    }


    update(): void {
        this.saws.forEach(saw => saw.angle += 5);
    }

    destroy() {
        this.container.removeAll(true);
        this.container.destroy();
        super.destroy();
    }
}

export class SawBeltConfigs {
    numberOfSaws: number = 10;
    isVertical: boolean = false;
    constructor(configs?: { numberOfSaws?: number, isVertical?: boolean }) {
        configs = configs || {};
        this.numberOfSaws = configs.numberOfSaws || this.numberOfSaws;
        this.isVertical = configs.isVertical || this.isVertical;
    }
}