export class MineWall extends Phaser.GameObjects.TileSprite {
    private yInitial: number;
    private xParallaxFactor: number = 1;
    private yParallaxFactor: number = 1;
    private pillarsFlipped: boolean = false;

    private woodenPillars: Phaser.GameObjects.TileSprite;

    constructor(scene: Phaser.Scene, y: number, xParallaxFactor: number, yParallaxFactor: number, scale?: number, tint?: number) {
        super(scene, 0, y, 800, 500, 'MineWall');
        this.setOrigin(0);
        this.scene.add.existing(this);
        this.yInitial = this.y;
        this.xParallaxFactor = xParallaxFactor;
        this.yParallaxFactor = yParallaxFactor;

        this.woodenPillars = this.scene.add.tileSprite(this.x, this.y, this.width, 500, 'WoodenPillars');
        this.woodenPillars.tilePositionX = Math.random() * this.woodenPillars.width;
        this.woodenPillars.setOrigin(0);
        this.pillarsFlipped = Math.random() < 0.5;
        this.woodenPillars.flipX = this.pillarsFlipped;

        // if (scale) {
        //     this.setScale(scale);
        //     this.woodenPillars.setScale(scale);
        // }
        if (tint) {
            this.setTint(tint);
            this.woodenPillars.setTint(tint);
        }
    }

    updateParallax(cameraPositionDelta: { x: number, y: number }) {
        let xDelta: number = cameraPositionDelta.x * this.xParallaxFactor;
        this.tilePositionX += xDelta;

        if (this.pillarsFlipped) xDelta *= -1;
        this.woodenPillars.tilePositionX += xDelta;


        let yDelta: number = cameraPositionDelta.y * this.yParallaxFactor;
        this.y += yDelta;
        this.woodenPillars.y += yDelta;
    }
}