import "phaser";
import { WelcomeScene } from "./scenes/welcomeScene";
import { MainScene } from './scenes/mainScene';

const config: GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  scene: [WelcomeScene, MainScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 600 }
    }
  }
};

let game: Phaser.Game = new Phaser.Game(config);
