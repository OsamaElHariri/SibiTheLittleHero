import "phaser";
import { WelcomeScene } from "./scenes/welcomeScene";
import { MainScene } from './scenes/mainScene';
import { BackgroundScene } from "./scenes/backgroundScene";

const config: GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: '#303a59',
  scene: [WelcomeScene, MainScene, BackgroundScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 600 }
    }
  }
};

let game: Phaser.Game = new Phaser.Game(config);
