export class CameraTarget extends Phaser.GameObjects.Container {

    private target: { x: number, y: number };
    private default: { x: number, y: number };

    constructor(scene: Phaser.Scene, defaultBodyToFollow: { x: number, y: number }) {
        super(scene);
        this.scene.add.existing(this);
        this.target = defaultBodyToFollow;
        this.default = defaultBodyToFollow;
        this.trackTarget();
        this.scene.cameras.main.startFollow(this, true, 0.1, 0.1);
    }

    setTarget(target: { x: number, y: number }): void {
        if (target) this.target = target;
    }

    revertToDefault(): void {
        this.setTarget(this.default);
    }

    update(): void {
        this.trackTarget();
    }

    trackTarget() {
        this.x = this.target.x;
        this.y = this.target.y;
    }

}