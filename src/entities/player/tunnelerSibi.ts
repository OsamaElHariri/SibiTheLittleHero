import { Direction } from "../../helpers/enums/direction";

export class TunnelerSibi extends Phaser.GameObjects.Sprite {
    hitBox: Phaser.GameObjects.Rectangle;

    private bodyWidth: number = 40;
    private bodyHeight: number = 30;

    private breatheTween: Phaser.Tweens.Tween;

    constructor(params: { scene: Phaser.Scene, x: number, y: number }) {
        super(params.scene, params.x, params.y, 'UndergroundSibi');

        this.hitBox = this.scene.add.rectangle(this.x, this.y, this.bodyWidth, this.bodyHeight);
        this.scene.physics.world.enable(this.hitBox);
        this.hitBox.body.setAllowGravity(false);

        this.setOrigin(0.5, 1);

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

    duplicateHereAndShrink() {
        let shrinkSprite: Phaser.GameObjects.Sprite = this.scene.add.sprite(this.x, this.y, 'UndergroundSibi').setOrigin(0.5, 1).setAngle(this.angle);

        this.scene.add.tween({
            targets: [shrinkSprite],
            ease: 'Sine.easeInOut',
            duration: 300,
            scaleY: {
                getStart: () => 1,
                getEnd: () => 0,
            },
            onComplete: () => {
                shrinkSprite.destroy();
            }
        });
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
        this.hitBox.body.offset.y = 18;
        this.hitBox.body.offset.x = 0;
        this.hitBox.body.width = this.bodyWidth;
        this.hitBox.body.height = this.bodyHeight;
    }

    faceRight(): void {
        this.setAngle(90);
        this.hitBox.body.offset.y = -3;
        this.hitBox.body.offset.x = -12;
        this.hitBox.body.width = this.bodyHeight;
        this.hitBox.body.height = this.bodyWidth;
    }

    faceDown(): void {
        this.setAngle(180);
        this.hitBox.body.offset.y = -18;
        this.hitBox.body.offset.x = 0;
        this.hitBox.body.width = this.bodyWidth;
        this.hitBox.body.height = this.bodyHeight;
    }

    faceLeft(): void {
        this.setAngle(-90);
        this.hitBox.body.offset.y = -3;
        this.hitBox.body.offset.x = 22;
        this.hitBox.body.width = this.bodyHeight;
        this.hitBox.body.height = this.bodyWidth;
    }

    destroy(): void {
        this.hitBox.destroy();
        super.destroy();
    }
}