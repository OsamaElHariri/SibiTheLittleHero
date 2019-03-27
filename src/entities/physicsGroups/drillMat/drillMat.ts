export class DrillMat extends Phaser.GameObjects.Rectangle {

    private miniDrillWidth: number = 15;
    private overgroundGroup: Phaser.GameObjects.Group;

    private container: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number) {
        super(scene, x, y, width, 15);

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.setOrigin(0, 1);

        this.overgroundGroup = this.scene.data.get('OverGroundHostileGroup');
        this.overgroundGroup.add(this);

        this.container = this.scene.add.container(this.x, this.y);

        for (let i: number = 0; i < width / this.miniDrillWidth - 1; i++) {
            let angle: number = Math.random() * 20 - 10;
            this.container.add(
                this.scene.add.sprite(i * this.miniDrillWidth + 6, 0, 'ThinMetalRod')
                    .setOrigin(0.5, 1)
                    .setScale(0.4)
                    .setAlpha(0.7)
                    .setAngle(angle)
            );
            this.container.add(
                this.scene.add.sprite(i * this.miniDrillWidth + 6, 0, 'Drill')
                    .play('DrillRotate', true, Math.floor(Math.random() * 4))
                    .setOrigin(0.5, 1.25)
                    .setScale(0.4)
                    .setAlpha(0.7)
                    .setAngle(angle)
            );
        }

        for (let i: number = 0; i < width / this.miniDrillWidth; i++) {
            let angle: number = Math.random() * 20 - 10;
            this.container.add(
                this.scene.add.sprite(i * this.miniDrillWidth, 0, 'ThinMetalRod')
                    .setOrigin(0.5, 1)
                    .setScale(0.5)
                    .setAngle(angle)
            );
            this.container.add(
                this.scene.add.sprite(i * this.miniDrillWidth, 0, 'Drill')
                    .play('DrillRotate', true, Math.floor(Math.random() * 4))
                    .setOrigin(0.5, 1.2)
                    .setScale(0.5)
                    .setAngle(angle)
            );
        }
    }

}