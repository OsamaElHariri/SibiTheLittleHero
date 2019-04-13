import { Direction } from "../../helpers/enums/direction";

export class TunnelerSibi extends Phaser.GameObjects.Sprite {
    hitBox: Phaser.GameObjects.Sprite;

    private bodyWidth: number = 30;
    private bodyHeight: number = 30;

    private breatheTween: Phaser.Tweens.Tween;

    constructor(params: { scene: Phaser.Scene, x: number, y: number }) {
        super(params.scene, params.x, params.y, 'UndergroundSibi');

        this.hitBox = this.scene.add.sprite(this.x, this.y, 'UndergroundIndicator');
        this.scene.physics.world.enable(this.hitBox);
        this.hitBox.body.setAllowGravity(false);
        this.hitBox.body.width = this.bodyWidth;
        this.hitBox.body.height = this.bodyHeight;
        this.hitBox.setOrigin(0.5, 0).setDepth(3);
        this.hitBox.body.setSize(this.bodyWidth, this.bodyHeight);

        this.setOrigin(0.5, 1)
        .setDepth(3);

        this.scene.add.existing(this);

        this.breatheTween = this.scene.add.tween({
            targets: [this],
            ease: 'Sine.easeInOut',
            duration: 600,
            loopDelay: 200,
            loop: -1,
            yoyo: true,
            scaleY: {
                getStart: () => 1,
                getEnd: () => 1.25,
            },
        });
    }

    speedUpTween() {
        this.setTweenTimeScale(2.5);
    }

    normalSpeedTween() {
        this.setTweenTimeScale(1);
    }

    setTweenTimeScale(timeScale: number) {
        this.breatheTween.setTimeScale(timeScale);
    }

    playGrowAnim() {
        this.breatheTween.pause();
        this.scaleY = 0;
        this.scene.add.tween({
            targets: [this],
            ease: 'Sine.easeInOut',
            duration: 300,
            scaleY: {
                getStart: () => 0,
                getEnd: () => 1,
            },
            onComplete: () => {
                this.breatheTween.restart();
            }
        });
    }


    update() {
        this.hitBox.x = this.x;
        this.hitBox.y = this.y;
    }

    updateDirection(direction: Direction): void {
        switch (direction) {
            case Direction.Up:
                this.faceUp();
                break;
            case Direction.Left:
                this.faceLeft();
                break;
            case Direction.Down:
                this.faceDown();
                break;
            case Direction.Right:
                this.faceRight();
                break;
        }
    }

    faceUp(): void {
        this.setAngle(0);
        this.hitBox.setAngle(0);
        this.hitBox.body.offset.y = 0;
        this.hitBox.body.offset.x = 0;
    }

    faceRight(): void {
        this.setAngle(90);
        this.hitBox.setAngle(90);
        this.hitBox.body.offset.y = -15;
        this.hitBox.body.offset.x = -15;
    }

    faceDown(): void {
        this.setAngle(180);
        this.hitBox.setAngle(180);
        this.hitBox.body.offset.y = -30;
        this.hitBox.body.offset.x = 0;
    }

    faceLeft(): void {
        this.setAngle(-90);
        this.hitBox.setAngle(-90);
        this.hitBox.body.offset.y = -15;
        this.hitBox.body.offset.x = 15;
    }

    destroy(): void {
        this.hitBox.destroy();

        super.destroy();
    }
}