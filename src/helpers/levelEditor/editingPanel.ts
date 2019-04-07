import * as dat from 'dat.gui';
import { MainScene } from '../../scenes/mainScene';
import { EntityType } from '../../entities/physicsGroups/entityType';
import { JsonHandler } from './jsonHandler';

export class EditingPanel extends Phaser.GameObjects.Container {
    private ok = 'ok';
    private gui: dat.GUI;
    private objectFolder: dat.GUI;
    private editingObject;
    private mainScene: MainScene;
    constructor(scene: MainScene) {
        super(scene);
        this.mainScene = scene;
        this.gui = new dat.GUI();

        let spawnObjectsFolder: dat.GUI = this.gui.addFolder('Spawn Object');

        let keys = Object.keys(EntityType).filter(key => !isNaN(Number(key)));
        keys.forEach(key => {
            spawnObjectsFolder.add({
                spawn: () => {
                    let type = Number(key);
                    this.edit(scene.spawnFromType(type, 0, 0, {}));
                }
            }, 'spawn').name(EntityType[key]);
        });

        let saveObject = {
            filename: 'sibi_level',
            onSave: function () {
                new JsonHandler(scene).downloadLevelJson(this.filename);
            }
        }

        let saveFolder: dat.GUI = this.gui.addFolder('Save');
        saveFolder.add(saveObject, 'filename');
        saveFolder.add(saveObject, 'onSave').name('Download');

    }

    edit(gameObject) {
        if (this.objectFolder) this.gui.removeFolder(this.objectFolder);
        if (this.editingObject && this.editingObject.destroy) this.editingObject.destroy();
        this.editingObject = gameObject;
        this.objectFolder = this.gui.addFolder('Edit Object');
        this.objectFolder.open();
        if (gameObject.x == 0 || gameObject.x) {
            this.objectFolder.add(gameObject, 'x').onChange(() => this.onSelectedObjectUpdate(this.mainScene));
        }
        if (gameObject.y == 0 || gameObject.y) {
            this.objectFolder.add(gameObject, 'y').onChange(() => this.onSelectedObjectUpdate(this.mainScene));
        }
        if (gameObject.config) {
            let keys: string[] = Object.keys(gameObject.config);
            keys.forEach((key: string) => {
                this.objectFolder.add(gameObject.config, key).onChange(() => this.onSelectedObjectUpdate(this.mainScene));
            });
        }
    }

    private onSelectedObjectUpdate(mainScene: MainScene) {
        let tempCurrentEditingObject = this.editingObject;
        let newObj = this.mainScene.spawnFromType(this.editingObject.entityType, this.editingObject.x, this.editingObject.y, this.editingObject.config);
        this.edit(newObj);
        if (tempCurrentEditingObject.destroy) tempCurrentEditingObject.destroy();
    }
}