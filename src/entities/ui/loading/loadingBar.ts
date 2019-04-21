export class LoadingBar extends Phaser.GameObjects.Container {
    done: boolean = false;
    private loadingBar: Phaser.GameObjects.Sprite;
    private loadingBarEmpty: Phaser.GameObjects.Sprite;
    private progressIndicator: Phaser.GameObjects.Rectangle;
    private loadingText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        this.scene.add.existing(this);

        this.loadingBarEmpty = this.scene.add.sprite(0, 0, 'LoadingBarEmpty')
            .setOrigin(0);
        this.loadingBar = this.scene.add.sprite(0, 0, 'LoadingBar')
            .setOrigin(0);
        this.progressIndicator = this.scene.add.rectangle(16, 0, this.loadingBar.width - 32, this.loadingBar.height, 0xf2cc20)
            .setOrigin(0)
            .setScale(0, 1);

        this.loadingText = this.scene.add.text(150, 120, '0%', {
            fontFamily: 'Verdana',
            color: '#F2CC20',
            fontSize: '18px',
        }).setOrigin(0.5);

        this.add([this.loadingBarEmpty, this.progressIndicator, this.loadingBar, this.loadingText]);
    }

    updateRatio(ratio: number): void {
        if (this.done) return;
        this.progressIndicator.setScale(ratio, 1);
        let percent: number = Math.floor(ratio * 100);
        if (ratio < 1) {
            this.loadingText.setText(`${percent}%`);
        } else {
            this.done = true;
            this.loadingText.setText('Press any key to start');
            let yStart = this.loadingText.y;
            let yEnd = this.loadingText.y + 10;
            this.scene.add.tween({
                targets: [this.loadingText],
                ease: 'Sine.easeInOut',
                duration: 600,
                repeat: -1,
                yoyo: true,
                y: {
                    getStart: () => yStart,
                    getEnd: () => yEnd
                }
            })
        }
    }
}