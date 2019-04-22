export class EndScene extends Phaser.Scene {

  constructor() {
    super({
      key: "EndScene"
    });
  }

  create(): void {
    this.cameras.main.fadeIn(500);
    this.add.sprite(0, 0, 'Victorious')
      .setOrigin(0);

    this.add.text(300, 50, 'Thanks for playing!', {
      fontFamily: 'Verdana',
      color: '#303A59',
      fontSize: '22px',
    });
  }
}