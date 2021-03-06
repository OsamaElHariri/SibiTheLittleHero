import { PlatformGroup } from "../platforms/platformGroup";
import { EntityType } from "../entityType";

export class RockMelter extends Phaser.GameObjects.Sprite {
    entityType: EntityType = EntityType.RockMelter;

    private melter: Phaser.GameObjects.Sprite;
    private initialMelterPos: { x: number, y: number };
    private initialTime: number;

    private platforms: PlatformGroup;

    private hasSpawnedPuddle: boolean = false;
    private smokeSprites: Phaser.GameObjects.Sprite[] = [];
    private moltenball: Phaser.GameObjects.Sprite;

    private sceneHostileGroup: Phaser.GameObjects.Group;

    private spawnedObjects = [];
    private tween: Phaser.Tweens.Tween;

    private config: RockMelterConfigs;

    constructor(scene: Phaser.Scene, x: number, y: number, platforms: PlatformGroup,
        config: RockMelterConfigs) {
        super(scene, x, y, 'RockMelterCeilingSupport');
        this.config = config;
        this.platforms = platforms;
        this.setDepth(4);
        this.sceneHostileGroup = this.scene.data.get('OverGroundHostileGroup');
        this.scene.add.existing(this);
        this.melter = this.scene.add.sprite(this.x - 5, this.y + 44, 'RockMelter');
        let smokeParticles = this.scene.add.particles('SmokeCloud').setDepth(1);
        smokeParticles.createEmitter({
            x: x + 20,
            y: y + 50,
            scale: { start: Math.random() * 0.5, end: 1.0 + Math.random() * 0.5 },
            alpha: { start: 1.0, end: 0, ease: 'Sine.easeIn' },
            gravityY: -40,
            lifespan: 1750,
            frequency: 400,
            emitZone: { source: new Phaser.Geom.Rectangle(0, 0, 20, 1) }
        });
        this.spawnedObjects.push(this.melter, smokeParticles);
        this.initialMelterPos = {
            x: this.melter.x,
            y: this.melter.y
        }
        this.initialTime = Date.now();
        this.scene.time.addEvent({
            delay: config.initialDelay,
            callbackScope: this,
            callback: this.spawnMoltenball
        });
    }

    update(): void {
        let valueFromGameStart = (Date.now() - this.initialTime) / 30;
        this.melter.x = this.initialMelterPos.x + Math.cos(valueFromGameStart) * 1;
        this.melter.y = this.initialMelterPos.y + Math.sin(valueFromGameStart) * 0.5;
    }

    startMoltenballTimer(): void {
        this.scene.time.addEvent({
            delay: this.config.dropInterval,
            callbackScope: this,
            callback: () => {
                this.spawnMoltenball();
            }
        });
    }

    spawnMoltenball(): void {
        if (!this.scene) return;
        this.moltenball = this.scene.add.sprite(this.x - 5, this.y + 50, 'MoltenBall');
        this.moltenball.setScale(0);
        this.tween = this.scene.add.tween({
            targets: [this.moltenball],
            ease: 'Sine.easeIn',
            duration: 600,
            callbackScope: this,
            scaleX: {
                getStart: () => 0,
                getEnd: () => 1,
            },
            scaleY: {
                getStart: () => 0,
                getEnd: () => 1,
            },
            onComplete: () => {
                this.onMoltenballTweenComplete();
            }
        });
    }

    onMoltenballTweenComplete(): void {
        this.scene.physics.world.enable(this.moltenball);
        this.moltenball.body.setCircle(10);
        this.moltenball.body.setOffset(5, 5);
        this.sceneHostileGroup.add(this.moltenball);
        this.scene.physics.add.collider(this.moltenball, this.platforms,
            (moltenball: Phaser.GameObjects.Sprite) => {
                if (!this.hasSpawnedPuddle) this.spawnMoltenPubble(moltenball.x, moltenball.y + 5);
                moltenball.destroy();
            });
        this.moltenball = null;
        this.startMoltenballTimer();
    }

    spawnMoltenPubble(x: number, y: number) {
        if (!this.scene) return;
        this.hasSpawnedPuddle = true;
        let puddle: Phaser.GameObjects.Sprite = this.scene.add.sprite(x, y + 2, 'MoltenPuddle').setDepth(2).play('MoltenPuddleMovement');
        this.spawnedObjects.push(puddle);
        let numberOfSmoke: number = Math.floor(Math.random() * 3 + 3);
        for (let i = 0; i < numberOfSmoke; i++) {
            let smokeX: number = puddle.getTopLeft().x + (i + 0.25) * (puddle.width / numberOfSmoke);
            smokeX += Math.random() * puddle.width / numberOfSmoke * 0.5;
            let smoke: Phaser.GameObjects.Sprite =
                this.scene.add.sprite(smokeX, y, 'Smoke')
                    .setOrigin(0.5, 1)
                    .setFlipX(Math.random() < 0.5)
                    .setScale(Math.random() * 0.7 + 0.7)
                    .play('SmokeDance', false, Math.floor(Math.random() * 12));
            this.smokeSprites.push(smoke);
        }
        this.scene.physics.world.enable(puddle, Phaser.Physics.Arcade.STATIC_BODY);
        puddle.body.height *= 0.5;
        let widthRatio: number = 0.8;
        puddle.body.x += (puddle.body.width * (1 - widthRatio) / 2);
        puddle.body.width *= 0.8;
        this.sceneHostileGroup.add(puddle);
    }

    destroy() {
        if (this.tween) this.tween.stop();
        this.spawnedObjects.forEach(obj => obj.destroy());
        super.destroy();
    }
}

export class RockMelterConfigs {
    dropInterval: number = 600;
    initialDelay: number = 0;
    constructor(configs?: {
        dropInterval?: number,
        initialDelay?: number,
    }) {
        configs = configs || {};
        this.dropInterval = configs.dropInterval || this.dropInterval
        this.initialDelay = configs.initialDelay || this.initialDelay
    }
}