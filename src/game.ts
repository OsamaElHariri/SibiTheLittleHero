import "phaser";
import { LoaderScene } from "./scenes/loaderScene";
import { MainScene } from './scenes/mainScene';
import { BackgroundScene } from "./scenes/backgroundScene";
import { SetupScene } from "./scenes/setupScene";
import { IntroScene } from "./scenes/introScene";
import { SecondIntroScene } from "./scenes/secondIntroScene";
import { EndScene } from "./scenes/endScene";

const config: GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: '#303a59',
  scene: [SetupScene, LoaderScene, IntroScene, SecondIntroScene, MainScene, BackgroundScene, EndScene],
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
      gravity: { y: 600 }
    }
  }
};

let game: Phaser.Game = new Phaser.Game(config);
