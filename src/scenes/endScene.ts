export class EndScene extends Phaser.Scene {

  texts: string[] = ['Thanks for playing!', 'Game Engine:\nPhaser 3', 'Art:\nInkskape', 'Music:\nMusescore']
  currentIndex: number = 0;
  textHolder: Phaser.GameObjects.Text;

  textHoldDuration: number = 3000;

  constructor() {
    super({
      key: "EndScene"
    });
  }

  create(): void {
    this.cameras.main.fadeIn(500, 255, 255, 255);
    this.add.sprite(0, 0, 'Victorious')
      .setOrigin(0);

    this.textHolder = this.add.text(400, 50, this.texts[0], {
      fontFamily: 'Verdana',
      color: '#303A59',
      fontSize: '22px',
    }).setAlign('center')
      .setOrigin(0.5);
    this.cycleThroughText();
  }


  cycleThroughText(): void {
    this.currentIndex = (this.currentIndex + 1) % this.texts.length;
    let text: string = this.texts[this.currentIndex];
    this.add.tween({
      targets: [this.textHolder],
      delay: this.textHoldDuration,
      duration: 500,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0,
      },
      onComplete: () => {
        this.textHolder.setText(text);
        this.add.tween({
          targets: [this.textHolder],
          duration: 500,
          alpha: {
            getStart: () => 0,
            getEnd: () => 1,
          },
          onComplete: () => this.cycleThroughText()
        });
      }
    });
  }
}