import { MainScene } from '../../../scenes/mainScene';
export class BeamOfLight extends Phaser.GameObjects.Rectangle {
    private light: Phaser.GameObjects.Sprite;
    private whiteCircles: Phaser.GameObjects.Particles.ParticleEmitterManager;

    private hasOverlapped = false;

    constructor(scene: MainScene, x: number, y: number) {
        super(scene, x, y, 200, 200);
        this.scene.add.existing(this);
        this.light = this.scene.add.sprite(x, y, 'BeamOfLight');
        this.scene.physics.world.enable(this.light, Phaser.Physics.Arcade.STATIC_BODY);

        if (scene.player) this.collideWithPlayer(scene);

        this.scene.events.on('PlayerSpawned', () => {
            this.collideWithPlayer(scene);
        });

        let lightPos = this.light.getTopLeft();
        this.whiteCircles = this.scene.add.particles('WhiteCircle');
        this.whiteCircles.setDepth(2).createEmitter({
            x: lightPos.x,
            y: lightPos.y,
            scale: { min: 0.4, max: 0.6 },
            alpha: { start: 0.7, end: 0, ease: 'Sine.easeOut' },
            angle: { min: 0, max: 360 },
            lifespan: 2500,
            speed: { min: 2, max: 5 },
            quantity: 5,
            frequency: 500,
            emitZone: { source: new Phaser.Geom.Rectangle(0, 0, this.light.width, this.light.height) }
        });
    }

    collideWithPlayer(scene: MainScene): void {
        scene.physics.add.overlap(this.light, scene.player, () => {
            if (this.hasOverlapped) return;
            this.hasOverlapped = true;
            scene.goToNextLevel();
        });
    }

    destroy() {
        this.light.destroy();
        this.whiteCircles.destroy();
        super.destroy();
    }
}