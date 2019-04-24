export class SecondIntroScene extends Phaser.Scene {
    catastropheSound: Phaser.Sound.BaseSound;

    private nightBackground: Phaser.GameObjects.Sprite;
    private isTransitioning: boolean = false;
    constructor() {
        super({
            key: "SecondIntroScene"
        });
    }

    create(): void {
        this.setupAudio();
        this.nightBackground = this.add.sprite(0, -424, 'NightCatastrophe')
            .setOrigin(0);
        let fadeDuration: number = 4000;
        let holdDuration: number = 3000;
        this.cameras.main.fadeIn(4000);
        this.time.addEvent({
            delay: holdDuration + fadeDuration,
            callback: () => this.fadeToMainScene()
        });

        this.input.keyboard.on('keydown', (key) => {
            if (!this.isTransitioning && key.keyCode == Phaser.Input.Keyboard.KeyCodes.SPACE) {
                this.isTransitioning = true;
                this.cameras.main.fade(500, 0, 0, 0, true, (cam, progress: number) => {
                    if (progress == 1) this.scene.start('MainScene')
                });
            }
        });
    }

    setupAudio(): void {
        this.catastropheSound = this.sound.add('CatastropheHitsRise', { loop: false, volume: 0.5 });
        this.catastropheSound.play();
        let isMuted: boolean = this.registry.get('Muted');
        if (isMuted) this.sound.pauseAll();
        else this.sound.resumeAll();

        this.input.keyboard.on('keydown', (key: any) => {
            if (key.keyCode == Phaser.Input.Keyboard.KeyCodes.M) {
                let isMuted: boolean = !this.registry.get('Muted');
                if (isMuted) this.sound.pauseAll();
                else this.sound.resumeAll();
                this.registry.set('Muted', isMuted);
            }
        });
    }

    fadeToMainScene(): void {
        this.cameras.main.fade(500, 0, 0, 0, true, (cam, progress: number) => {
            if (progress == 1) {
                this.scene.start('MainScene');
                this.catastropheSound.destroy();
            }
        });
    }
}