export class MineCart extends Phaser.GameObjects.Container {
    private xParallaxFactor: number = 1;
    private yParallaxFactor: number = 1;
    private baseCartSpeed: number = 1.5;
    private cartSpeed: number = 3;

    private cartTrack: Phaser.GameObjects.TileSprite;
    private mineCart: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, y: number, xParallaxFactor: number, yParallaxFactor: number, angle?: number) {
        super(scene, 0, y);
        this.angle = angle || 0;
        this.scene.add.existing(this);
        this.setDepth(2);
        this.xParallaxFactor = xParallaxFactor;
        this.yParallaxFactor = yParallaxFactor;
        this.cartTrack = this.scene.add.tileSprite(-10, 0, 1010, 8, 'CartTrack')
            .setOrigin(0, 0.25)
        this.add(this.cartTrack);

        this.mineCart = this.scene.add.sprite(-1000, 0, 'MineCart')
            .setOrigin(0.5, 1)
            .setScale(0.4);
        this.add(this.mineCart);
    }

    updateParallax(cameraPositionDelta: { x: number, y: number }) {
        let xDelta: number = cameraPositionDelta.x * this.xParallaxFactor;
        let yDelta: number = cameraPositionDelta.y * this.yParallaxFactor;

        this.cartTrack.tilePositionX += xDelta * Math.cos(this.rotation);
        this.y += yDelta + Math.sin(this.rotation) * xDelta;

        this.mineCart.x += this.cartSpeed - xDelta * Math.cos(this.rotation);

        if (this.mineCart.x < -400 || this.mineCart.x > 1200) {
            this.cartSpeed = this.baseCartSpeed + Math.random() * 2;
            if (Math.random() < 0.5) {
                this.mineCart.x = -200 - Math.random() * 200;
            } else {
                this.mineCart.x = 1000 + Math.random() * 200;
                this.cartSpeed *= -1;
            }
        }

    }
}