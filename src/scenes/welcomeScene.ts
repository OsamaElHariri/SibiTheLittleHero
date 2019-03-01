export class WelcomeScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;
  private helloText: Phaser.GameObjects.Text;
  
    constructor() {
      super({
        key: "WelcomeScene"
      });
    }
  
    preload(): void {
      this.load.image("logo", "./src/boilerplate/assets/phaser.png");
    }
  
    create(): void {
      this.phaserSprite = this.add.sprite(400, 300, "logo");
      this.helloText = this.add.text(100, 200, 'I am a Text!',{color: 'blue'});
    }
  }