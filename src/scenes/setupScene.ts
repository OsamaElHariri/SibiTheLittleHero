export class SetupScene extends Phaser.Scene {

  constructor() {
    super({
      key: "SetupScene"
    });
  }

  preload(): void {
    this.load.image("SibiTitle", "../Assets/Sprites/UI/SibiTitle.png");
    this.load.image("LoadingScreenLight", "../Assets/Sprites/UI/LoadingScreenLight.png");
    this.load.image("LoadingBar", "../Assets/Sprites/UI/LoadingBar.png");
    this.load.image("LoadingBarEmpty", "../Assets/Sprites/UI/LoadingBarEmpty.png");
  }

  create(): void {
    this.scene.start('LoaderScene');
  }
}