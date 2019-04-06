import * as dat from 'dat.gui';
import { MainScene } from '../../scenes/mainScene';

export class EditingPanel extends Phaser.GameObjects.Container {

    private gui: dat.GUI;
    private editingObject;
    constructor(scene: MainScene) {
        super(scene);
    }

    edit(gameObject) {
        if (this.gui) this.gui.destroy();
        if (this.editingObject && this.editingObject.destroy) this.editingObject.destroy();
        this.editingObject = gameObject;
        this.gui = new dat.GUI();
        this.gui.addFolder('Edit');
        if (gameObject.x == 0 || gameObject.x) {
            this.gui.add(gameObject, 'x');
        }
        if (gameObject.y == 0 || gameObject.y) {
            this.gui.add(gameObject, 'y');
        }
        if (gameObject.config) {
            let keys: string[] = Object.keys(gameObject.config);
            keys.forEach((key: string) => {
                this.gui.add(gameObject.config, key);
            });
        }
    }
}