export class FollowCollider extends Phaser.GameObjects.Rectangle {
    private defaultDimension: number = 30;
    private toFollow: { x: number, y: number };

    constructor(scene: Phaser.Scene, toFollow: { x: number, y: number }, config: {isCircle?: boolean, width?: number, height?: number, xOffset?: number, yOffset?: number}) {
        super(scene, toFollow.x, toFollow.y);
        this.toFollow = toFollow;
        this.scene.physics.world.enable(this);
        this.body.setOffset(config.xOffset || 0, config.yOffset || 0);
        this.body.setAllowGravity(false);

        let hostilesGroup: Phaser.GameObjects.Group = this.scene.data.get('HostileGroup');
        if (hostilesGroup) hostilesGroup.add(this);

        if (config.isCircle)
            this.body.setCircle(config.width || this.defaultDimension);
        else
            this.body.setSize(config.width || this.defaultDimension, config.height || this.defaultDimension);
    }

    update(): void {
        this.x = this.toFollow.x;
        this.y = this.toFollow.y;
    }
}