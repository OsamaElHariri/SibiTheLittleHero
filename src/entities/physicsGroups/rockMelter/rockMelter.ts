import { PlatformGroup } from "../platforms/platformGroup";

export class RockMelter extends Phaser.GameObjects.Sprite {
    private melter: Phaser.GameObjects.Sprite;
    private initialMelterPos: { x: number, y: number };
    private initialTime: number;

    private platforms: PlatformGroup;

    private hasSpawnedPuddle: boolean = false;
    private smokeSprites: Phaser.GameObjects.Sprite[] = [];
    private moltenball: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, x: number, y: number, platforms: PlatformGroup) {
        super(scene, x, y, 'RockMelterCeilingSupport');
        this.platforms = platforms;
        this.scene.add.existing(this);
        this.melter = this.scene.add.sprite(this.x - 5, this.y + 44, 'RockMelter');
        this.initialMelterPos = {
            x: this.melter.x,
            y: this.melter.y
        }
        this.depth = 1;
        this.initialTime = Date.now();
        this.spawnMoltenball();
    }

    update(): void {
        let valueFromGameStart = (Date.now() - this.initialTime) / 30;
        this.melter.x = this.initialMelterPos.x + Math.cos(valueFromGameStart) * 1;
        this.melter.y = this.initialMelterPos.y + Math.sin(valueFromGameStart) * 0.5;
    }

    startMoltenballTimer(): void {
        this.scene.time.addEvent({
            delay: 3000,
            callbackScope: this,
            callback: () => {
                this.spawnMoltenball();
            }
        });
    }

    spawnMoltenball(): void {
        this.moltenball = this.scene.add.sprite(this.x - 5, this.y + 50, 'MoltenBall');
        this.moltenball.setScale(0);
        this.scene.add.tween({
            targets: [this.moltenball],
            ease: 'Sine.easeIn',
            duration: this.hasSpawnedPuddle ? 600 : 1,
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
        this.scene.physics.add.collider(this.moltenball, this.platforms,
            (moltenball: Phaser.GameObjects.Sprite) => {
                if (!this.hasSpawnedPuddle) this.spawnMoltenPubble(moltenball.x, moltenball.y + 5);
                moltenball.destroy();
            });
        this.moltenball = null;
        this.startMoltenballTimer();
    }

    spawnMoltenPubble(x: number, y: number) {
        this.hasSpawnedPuddle = true;
        let puddle: Phaser.GameObjects.Sprite = this.scene.add.sprite(x, y + 2, 'MoltenPuddle').setDepth(2).play('MoltenPuddleMovement');
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
    }
}