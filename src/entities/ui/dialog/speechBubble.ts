import { SpeechBubbleConfigs } from "./speechBubbleConfigs";

export class SpeechBubble extends Phaser.GameObjects.Sprite {

    private container: Phaser.GameObjects.Container;

    private fullText: string;
    private bubbleText: Phaser.GameObjects.Text;
    private cursorIndex: number = 0;

    private shortDelay: number = 50;
    private mediumDelay: number = 120;
    private longDelay: number = 200;

    private config: SpeechBubbleConfigs;

    constructor(scene: Phaser.Scene, x: number, y: number, fullText: string, isOnTheRight?: boolean,
        config?: { addedDelay?: number, prePause?: number, postPause?: number }) {
        super(scene, 0, 0, 'SpeechBubble');
        this.scene.add.existing(this);
        this.container = this.scene.add.container(x, y, this);
        this.fullText = fullText;

        this.config = config || new SpeechBubbleConfigs();

        this.bubbleText = this.scene.add.text(20, -this.height + 20, '', {
            fontFamily: 'Verdana',
            color: '#000',
            fontSize: '18px',
        }).setWordWrapWidth(this.width - 40);

        this.setOrigin(0, 1);
        this.bubbleText.setOrigin(0, 0);
        if (isOnTheRight) this.setFlipX(true);

        this.container.add(this.bubbleText);

        this.scene.add.tween({
            targets: [this.container],
            ease: 'Sine.easeInOut',
            duration: 800,
            loop: -1,
            yoyo: true,
            y: {
                getStart: () => y,
                getEnd: () => y + 5,
            },
        });

        this.setText(fullText);
    }

    skip(): void {
        if (this.fullText)
            this.cursorIndex = this.fullText.length - 1;
    }

    isActive():boolean {
        return this.cursorIndex <= this.fullText.length
    }

    setText(text: string, config?: SpeechBubbleConfigs): void {
        this.fullText = text;
        this.updateSize(text);
        this.cursorIndex = 0;
        this.bubbleText.setText('');
        if (config != null) this.config = config;

        this.container.setAlpha(text ? 1 : 0);
        if (!text) return;

        if (this.config.prePause) {
            this.scene.time.addEvent({
                delay: this.config.prePause,
                callbackScope: this,
                callback: this.printFullText
            })
        } else {
            this.printFullText();
        }
    }

    private updateSize(text: string): void {
        if (text.length < 40) {
            this.setTexture('SpeechBubbleSmall');
        } else if (text.length < 65) {
            this.setTexture('SpeechBubbleMedium');
        } else {
            this.setTexture('SpeechBubble');
        }
        this.bubbleText.setPosition(20, -this.height + 20);
    }

    private printFullText(): void {
        this.cursorIndex++;
        if (this.cursorIndex > this.fullText.length) {
            if (this.config.postPause) {
                this.scene.time.addEvent({
                    delay: this.config.postPause,
                    callbackScope: this,
                    callback: () => {
                        this.emit('done', this.fullText);
                    }
                })
            } else {
                this.emit('done', this.fullText);
            }
            return;
        }

        let nextChar: string = this.fullText.charAt(this.cursorIndex);
        let textInBubble: string = this.fullText.substr(0, this.cursorIndex);
        this.bubbleText.setText(textInBubble);

        this.scene.time.addEvent({
            delay: this.getDelay(nextChar),
            callbackScope: this,
            callback: this.printFullText
        });

    }

    getDelay(char: string): number {
        let delay: number = this.shortDelay;
        if (['.', '?', '!'].indexOf(char) >= 0) {
            delay = this.longDelay;
        } else if ([',', ';'].indexOf(char) >= 0) {
            delay = this.mediumDelay;
        }
        return delay + (this.config.addedDelay || 0);
    }

    remove() {
        this.bubbleText.destroy();
        this.container.destroy();
        this.destroy();
    }
}
