export class IntroScene extends Phaser.Scene {
    waitTime: number = 2000;
    dawnProgress = 0;
    drillProgress = 0;
    isTransitioning = false;

    dawnBackground: Phaser.GameObjects.Sprite;
    largeDrillBackground: Phaser.GameObjects.Container;
    largeDrillAndDigArea: Phaser.GameObjects.Container;
    ground: Phaser.GameObjects.TileSprite;
    dawnTween: Phaser.Tweens.Tween;
    drillTween: Phaser.Tweens.Tween;
    largeDigArea: Phaser.GameObjects.Sprite;
    SecondIntroScene: any;
    peacefulTune: Phaser.Sound.BaseSound;
    drillSound: Phaser.Sound.BaseSound;

    constructor() {
        super({
            key: "IntroScene"
        });
    }

    create(): void {
        this.anims.create({
            key: 'LargeDrillRotate',
            frames: this.anims.generateFrameNumbers('LargeDrill', { start: 0, end: 4 }),
            frameRate: 20,
            repeat: -1
        });

        this.largeDrillBackground = this.add.container(400, 600);
        this.ground = this.add.tileSprite(0, -300, 800, 600, 'Ground').setScale(1.3);
        this.largeDrillBackground.add(this.ground);

        this.largeDrillAndDigArea = this.add.container(0, 500).setDepth(-1);
        this.largeDrillBackground.add(this.largeDrillAndDigArea);
        this.largeDigArea = this.add.sprite(0, 0, 'LargeDrillDigArea')
            .setOrigin(0.5, 1)
        this.largeDrillAndDigArea.add(this.largeDigArea);
        this.largeDrillAndDigArea.add(
            this.add.sprite(0, 0, 'LargeDrill')
                .setOrigin(0.5, 1)
                .play('LargeDrillRotate')
        );

        this.dawnBackground = this.add.sprite(0, 0, 'DawnGathering')
            .setOrigin(0);

        this.createTweens();
        this.setupAudio();
        this.playDawnScene();

        this.input.keyboard.on('keydown', (key) => {
            if (!this.isTransitioning && (key.keyCode == Phaser.Input.Keyboard.KeyCodes.DOWN || key.keyCode == Phaser.Input.Keyboard.KeyCodes.S)) {
                this.isTransitioning = true;
                this.peacefulTune.stop();
                this.drillSound.stop();
                this.cameras.main.fade(500, 0, 0, 0, true, (cam, progress: number) => {
                    if (progress == 1) this.scene.start('MainScene')
                });
            }
        });
    }

    setupAudio(): void {
        this.peacefulTune = this.sound.add('PeacefulNormalness', { loop: true, volume: 0.1 });
        this.peacefulTune.play();
        this.drillSound = this.sound.add('DrillSounds', { loop: true, volume: 0.05 });
        this.drillSound.play();
        let isMuted: boolean = this.registry.get('Muted');

        if (isMuted) this.sound.pauseAll();
        else this.sound.resumeAll();

        this.drillSound.pause();

        this.input.keyboard.on('keydown', (key: any) => {
            if (key.keyCode == Phaser.Input.Keyboard.KeyCodes.M) {
                let isMuted: boolean = !this.registry.get('Muted');
                if (isMuted) this.sound.pauseAll();
                this.registry.set('Muted', isMuted);
            }
        });
    }

    createTweens() {
        this.drillTween = this.add.tween({
            targets: [this],
            duration: 8600,
            delay: this.waitTime,
            drillProgress: {
                getStart: () => 0,
                getEnd: () => 1,
            },
            onComplete: () => this.onTweenComplete()
        });

        this.dawnTween = this.add.tween({
            targets: [this],
            duration: 8000,
            delay: this.waitTime,
            dawnProgress: {
                getStart: () => 0,
                getEnd: () => 1,
            },
            onComplete: () => this.onTweenComplete()
        });
    }

    playDawnScene(): void {
        this.largeDrillBackground.setDepth(-1);
        if (!this.registry.get('Muted')) this.peacefulTune.resume();
        this.time.addEvent({
            delay: this.waitTime,
            callbackScope: this,
            callback: () => {
                this.peacefulTune.pause();
                this.waitTime -= 200;
                this.waitTime = Math.max(1500, this.waitTime);
                this.playDrillScene();
            },
        });
    }

    playDrillScene(): void {
        this.largeDrillBackground.setDepth(2);
        if (!this.registry.get('Muted')) this.drillSound.resume();
        this.cameras.main.shake(this.waitTime, 0.01);
        this.time.addEvent({
            delay: this.waitTime,
            callbackScope: this,
            callback: () => {
                this.drillSound.pause();
                this.playDawnScene();
            },
        });
    }

    onTweenComplete(): void {
        if (!this.isTransitioning && this.dawnProgress === 1 && this.drillProgress === 1) {
            this.isTransitioning = true;
            this.time.addEvent({
                delay: 2000,
                callbackScope: this,
                callback: () => {
                    this.peacefulTune.stop();
                    this.drillSound.stop();
                    this.cameras.main.flash(1000000, 0, 0, 0, true);
                    this.time.addEvent({
                        delay: 2000,
                        callbackScope: this,
                        callback: () => {
                            this.scene.start('SecondIntroScene');
                        }
                    });
                }
            });
        }
    }

    update(): void {
        this.dawnBackground.y = -424 * this.dawnProgress;
        this.largeDrillAndDigArea.y = 500 * (1 - this.drillProgress);
        this.ground.tilePositionY -= 10;
        if (Math.random() < 0.07) this.largeDigArea.scaleX *= -1;
    }
}