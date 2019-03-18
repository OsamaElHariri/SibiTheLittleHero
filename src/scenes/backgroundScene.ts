import { MineWall } from "../entities/environment/mineWall";

export class BackgroundScene extends Phaser.Scene {
    private walls: MineWall[] = [];

    private previousCameraPosition: { x: number, y: number } = { x: 0, y: 0 };

    constructor() {
        super({
            key: "BackgroundScene"
        });
    }

    preload(): void {
        this.load.image('MineWall', '../Assets/Sprites/Environment/MineWall.png');
        this.load.image('WoodenPillars', '../Assets/Sprites/Environment/WoodenPillars.png');
    }

    create(): void {
        this.walls = [
            new MineWall(this, -250, 0.7, 0.08, 0.8, 0xe7e7e7),
            new MineWall(this, 150, 0.8, 0.09, 0.9, 0xf0f0f0),
            new MineWall(this, 550, 0.9, 0.1, 0xf5f5f5),
        ];
    }

    update(): void {
        let mainCameraPosition: { x: number, y: number } = this.registry.get('MainCameraPosition');
        let mainCameraDelta: { x: number, y: number } = {
            x: mainCameraPosition.x - this.previousCameraPosition.x,
            y: mainCameraPosition.y - this.previousCameraPosition.y,
        }
        for (let i = 0; i < this.walls.length; i++) {
            this.walls[i].updateParallax(mainCameraDelta);
        }

        this.previousCameraPosition = mainCameraPosition;
    }
}