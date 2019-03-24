import { PlatformGroup } from "../platforms/platformGroup";
import { Direction } from "../../../helpers/enums/direction";

export class DoubleDrills extends Phaser.GameObjects.Rectangle {

    private platforms: PlatformGroup;

    private overgroundGroup: Phaser.GameObjects.Group;
    private undergroundGroup: Phaser.GameObjects.Group;

    private container: Phaser.GameObjects.Container;
    private drillContainer: Phaser.GameObjects.Container;

    private hitBox: Phaser.GameObjects.Rectangle;
    private gears: Phaser.GameObjects.Sprite[] = [];

    private initailHeight: number = -40;
    private drillwidth: number = 32;
    private holdDelay: number = 3000;
    private timeToMove: number = 1500;
    private numberOfDrills: number;

    private moveSpeed: number = 0.86;
    private moveUp: boolean = false;
    private moveDown: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, platforms: PlatformGroup,
        config: { direction?: Direction, numberOfDrills?: number }) {
        super(scene, x, y);
        this.scene.add.existing(this);
        this.platforms = platforms;
        this.overgroundGroup = this.scene.data.get('OverGroundHostileGroup');
        this.undergroundGroup = this.scene.data.get('UnderGroundHostileGroup');
        this.numberOfDrills = config.numberOfDrills || 5;

        this.container = this.scene.add.container(this.x, this.y);
        this.drillContainer = this.scene.add.container(0, this.initailHeight);
        this.container.add(this.drillContainer);

        let direction: Direction = config.direction || Direction.Up;
        switch (direction) {
            case Direction.Right:
                this.container.angle = 90;
                break;
            case Direction.Down:
                this.container.angle = 180;
                break;
            case Direction.Left:
                this.container.angle = -90;
                break;
        }

        this.spawnStands();
        this.spawnGears();
        this.spawnDrills();
        this.spawnCollider();

        this.startMoveDown();
    }

    spawnStands(): void {
        let leftStand: Phaser.GameObjects.GameObject = this.scene.add.sprite(0, 0, 'DrillsStand')
            .setOrigin(1, 1);
        this.container.add(leftStand);

        let rightStand: Phaser.GameObjects.GameObject = this.scene.add.sprite(this.numberOfDrills * this.drillwidth, 0, 'DrillsStand')
            .setOrigin(0, 1)
            .setFlipX(true);
        this.container.add(rightStand);
    }

    spawnGears(): void {
        let leftGear: Phaser.GameObjects.Sprite = this.scene.add.sprite(-4, this.initailHeight, 'DoubleDrillsGear')
            .setAngle(Math.random() * 360);
        this.container.add(leftGear);


        let rightGear: Phaser.GameObjects.Sprite = this.scene.add.sprite(this.numberOfDrills * this.drillwidth + 4, this.initailHeight, 'DoubleDrillsGear')
            .setAngle(Math.random() * 360);
        this.container.add(rightGear);
        this.gears.push(leftGear, rightGear);
    }

    spawnDrills(): void {
        for (let i = 0; i < this.numberOfDrills; i++) {
            this.spawnSingleDrill(i);
        }
    }

    spawnSingleDrill(index: number): void {
        let xPos = this.drillwidth * (index + 0.5);
        let drillSupport: Phaser.GameObjects.Sprite = this.scene.add.sprite(xPos, 0, 'DrillsSupport');
        this.drillContainer.add(drillSupport);

        let topDrill: Phaser.GameObjects.Sprite = this.scene.add.sprite(xPos, -4, 'Drill')
            .setOrigin(0.5, 1);
        topDrill.play('DrillRotate', true, Math.floor(Math.random() * 4));
        this.drillContainer.add(topDrill);

        let bottomDrill: Phaser.GameObjects.Sprite = this.scene.add.sprite(xPos, 4, 'Drill')
            .setOrigin(0.5, 0)
            .setFlipY(true);
        bottomDrill.play('DrillRotate', true, Math.floor(Math.random() * 4));
        this.drillContainer.add(bottomDrill);
    }

    spawnCollider(): void {
        this.hitBox = this.scene.add.rectangle(0, this.initailHeight, this.drillwidth * this.numberOfDrills, 40)
            .setOrigin(0, 0.5);
        this.scene.physics.world.enable(this.hitBox);
        this.hitBox.body.setAllowGravity(false);
        this.container.add(this.hitBox);
    }

    update(): void {
        let speed: number = 0;
        if (this.moveUp) speed = this.moveSpeed;
        else if (this.moveDown) speed = -this.moveSpeed;

        this.gears[0].y -= speed;
        this.gears[0].angle += speed * 10;
        this.gears[1].y -= speed;
        this.gears[1].angle -= speed * 10;
        this.drillContainer.y -= speed
        this.hitBox.y -= speed;
    }

    startMoveUp(): void {
        this.moveUp = true;
        this.overgroundGroup.add(this.hitBox);
        this.scene.time.addEvent({
            delay: this.timeToMove,
            callbackScope: this,
            callback: () => {
                this.moveUp = false;
                this.moveDown = false;
                this.undergroundGroup.remove(this.hitBox);
                this.scene.time.addEvent({
                    delay: this.holdDelay,
                    callbackScope: this,
                    callback: () => {
                        this.startMoveDown();
                    }
                });
            }
        });
    }

    startMoveDown(): void {
        this.moveDown = true;
        this.undergroundGroup.add(this.hitBox);
        this.scene.time.addEvent({
            delay: this.timeToMove,
            callbackScope: this,
            callback: () => {
                this.moveDown = false;
                this.moveUp = false;
                this.overgroundGroup.remove(this.hitBox);
                this.scene.time.addEvent({
                    delay: this.holdDelay,
                    callbackScope: this,
                    callback: () => {
                        this.startMoveUp();
                    }
                });
            }
        });
    }

}