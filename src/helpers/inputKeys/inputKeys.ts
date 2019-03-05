import { KeyGroup } from "./keyGroup";

export class InputKeys {
    private keyboard: Phaser.Input.Keyboard.KeyboardPlugin;
    private static singleton: InputKeys;
    
    private up: KeyGroup;
    private down: KeyGroup;
    private right: KeyGroup;
    private left: KeyGroup;

    static setKeyboard(keyboard: Phaser.Input.Keyboard.KeyboardPlugin):void {
        InputKeys.singleton = new InputKeys(keyboard);
    }

    static getInstance():InputKeys {
        return this.singleton;
    }

    private constructor(keyboard: Phaser.Input.Keyboard.KeyboardPlugin) {
        this.keyboard = keyboard;
        this.clear();
        this.addUpKeys(
            keyboard.addKey('UP'),
            keyboard.addKey('W'),
          );
          this.addLeftKeys(
            keyboard.addKey('LEFT'),
            keyboard.addKey('A'),
          );
          this.addRightKeys(
            keyboard.addKey('RIGHT'),
            keyboard.addKey('D'),
          );
    }

    clear(): void {
        this.up = new KeyGroup();
        this.down = new KeyGroup();
        this.right = new KeyGroup();
        this.left = new KeyGroup();
        this.keyboard.removeAllListeners();
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