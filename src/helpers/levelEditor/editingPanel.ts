import * as dat from 'dat.gui';
import { MainScene } from '../../scenes/mainScene';
import { EntityType } from '../../entities/physicsGroups/entityType';
import { JsonHandler } from './jsonHandler';

export class EditingPanel extends Phaser.GameObjects.Container {

    private gui: dat.GUI;
    private objectFolder: dat.GUI;
    private editingObject;
    constructor(scene: MainScene) {
        super(scene);
        this.gui = new dat.GUI();

        let spawnObjectsFolder:dat.GUI = this.gui.addFolder('Spawn Object') ;

        let keys = Object.keys(EntityType).filter(key => !isNaN(Number(key)));
        keys.forEach(key => {
            spawnObjectsFolder.add({
                spawn: function() {
                    let type = Number(key);
                    scene.spawnFromType(type, 0, 0, {});
                }
            }, 'spawn').name(EntityType[key]);
        });

        let saveObject = {
            filename: 'sibi_level',
            onSave: function () {
                new JsonHandler(scene).downloadLevelJson(this.filename);
            }
        }

        let saveFolder:dat.GUI = this.gui.addFolder('Save');
        saveFolder.add(saveObject, 'filename');
        saveFolder.add(saveObject, 'onSave').name('Download');

    }

    edit(gameObject) {
        if (this.objectFolder) this.objectFolder.destroy();
        if (this.editingObject && this.editingObject.destroy) this.editingObject.destroy();
        this.editingObject = gameObject;
        this.objectFolder = this.gui.addFolder('Edit');
        if (gameObject.x == 0 || gameObject.x) {
            this.objectFolder.add(gameObject, 'x');
        }
        if (gameObject.y == 0 || gameObject.y) {
            this.objectFolder.add(gameObject, 'y');
        }
        if (gameObject.config) {
            let keys: string[] = Object.keys(gameObject.config);
            keys.forEach((key: string) => {
                this.objectFolder.add(gameObject.config, key);
            });
        }
    }
}