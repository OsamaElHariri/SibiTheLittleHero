import "phaser";
import { WelcomeScene } from "./scenes/welcomeScene";

const config: GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  scene: WelcomeScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 }
    }
  }
};

let game: Phaser.Game = new Phaser.Game(config);
