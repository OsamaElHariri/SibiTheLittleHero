import { KeyGroup } from "./keyGroup";

export class InputKeys {
    private static instance: InputKeys;

    static getKeys(): InputKeys {
        return this.instance || new InputKeys();
    }

    private up: KeyGroup;
    private down: KeyGroup;
    private right: KeyGroup;
    private left: KeyGroup;

    private constructor() {
        this.clear();
    }

    clear(): void {
        this.up = new KeyGroup();
        this.down = new KeyGroup();
        this.right = new KeyGroup();
        this.left = new KeyGroup();
    }

    addUpKeys(...keys: Phaser.Input.Keyboard.Key[]): void {
        this.up.addKeys(keys);
    }
    addDownKeys(...keys: Phaser.Input.Keyboard.Key[]): void {
        this.down.addKeys(keys);
    }
    addRightKeys(...keys: Phaser.Input.Keyboard.Key[]): void {
        this.right.addKeys(keys);
    }
    addLeftKeys(...keys: Phaser.Input.Keyboard.Key[]): void {
        this.left.addKeys(keys);
    }

    upPressed(): boolean {
        return this.up.hasKeyDown();
    }

    downPressed(): boolean {
        return this.down.hasKeyDown();
    }

    rightPressed(): boolean {
        return this.right.hasKeyDown();
    }

    leftPressed(): boolean {
        return this.left.hasKeyDown();
    }

}
