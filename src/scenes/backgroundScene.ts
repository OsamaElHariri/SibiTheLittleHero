import { MineWall } from "../entities/environment/mineWall";
import { MineCart } from "../entities/environment/mineCart";

export class BackgroundScene extends Phaser.Scene {
    private walls: MineWall[] = [];
    private carts: MineCart[] = [];

    private previousCameraPosition: { x: number, y: number } = { x: 0, y: 0 };

    constructor() {
        super({
            key: "BackgroundScene"
        });
    }

    create(): void {
        this.walls = [
            new MineWall(this, -250, 0.7, 0.08, 0.8, 0xe7e7e7),
            new MineWall(this, 150, 0.8, 0.09, 0.9, 0xf0f0f0),
            new MineWall(this, 550, 0.9, 0.1, 0xf5f5f5),
        ];
        this.carts = [
            new MineCart(this, 100 + Math.random() * 400, 0.65, 0.11, Math.random() * 40 - 20),
            new MineCart(this, 600 + Math.random() * 400, 0.65, 0.11, Math.random() * 40 - 20),
            new MineCart(this, 1200 - Math.random() * 400, 0.65, 0.11, Math.random() * 40 - 20),
        ];
    }

    update(): void {
        let mainCameraPosition: { x: number, y: number } = this.registry.get('MainCameraPosition');
        let mainCameraDelta: { x: number, y: number } = {
            x: mainCameraPosition.x - this.previousCameraPosition.x,
            y: mainCameraPosition.y - this.previousCameraPosition.y,
        }
        this.carts.forEach(cart => cart.updateParallax(mainCameraDelta));
        this.walls.forEach(wall => wall.updateParallax(mainCameraDelta));

        this.previousCameraPosition = mainCameraPosition;
    }
}