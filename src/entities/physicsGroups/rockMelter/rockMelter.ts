export class RockMelter extends Phaser.GameObjects.Sprite {
    private melter: Phaser.GameObjects.Sprite;
    private initialMelterPos: {x: number, y: number};
    private initialTime: number;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'RockMelterCeilingSupport');
        this.scene.add.existing(this);
        this.melter = this.scene.add.sprite(this.x - 5, this.y + 44, 'RockMelter');
        this.initialMelterPos = {
            x: this.melter.x,
            y: this.melter.y
        }
        this.depth = 1;
        this.initialTime = Date.now();
    }

    update():void {
        let valueFromGameStart = (Date.now() - this.initialTime) / 30;
        this.melter.x = this.initialMelterPos.x + Math.cos(valueFromGameStart) * 2;
        this.melter.y = this.initialMelterPos.y + Math.sin(valueFromGameStart) * 0.5;
    }


}