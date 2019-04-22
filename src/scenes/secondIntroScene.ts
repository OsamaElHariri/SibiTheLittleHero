export class SecondIntroScene extends Phaser.Scene {
    nightBackground: Phaser.GameObjects.Sprite;
    constructor() {
        super({
            key: "SecondIntroScene"
        });
    }

    create(): void {
        this.nightBackground = this.add.sprite(0, -424, 'NightCatastrophe')
            .setOrigin(0);
        let fadeDuration: number = 4000;
        let holdDuration: number = 3000;
        this.cameras.main.fadeIn(4000);
        this.time.addEvent({
            delay: holdDuration + fadeDuration,
            callback: () => this.fadeToMainScene()
        });
    }

    fadeToMainScene(): void {
        this.cameras.main.fade(500, 0, 0, 0, true, (cam, progress: number) => {
            if (progress == 1)
                this.scene.start('MainScene');
        });
    }
}