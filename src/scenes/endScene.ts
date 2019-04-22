export class EndScene extends Phaser.Scene {

    constructor() {
      super({
        key: "EndScene"
      });
    }

    create():void {
        this.add.text(400, 300, 'THE END!');
    }
}