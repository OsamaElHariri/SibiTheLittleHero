import * as dat from 'dat.gui';
import { MainScene } from '../../scenes/mainScene';
import { EntityType } from '../../entities/physicsGroups/entityType';
import { JsonHandler } from './jsonHandler';

export class EditingPanel extends Phaser.GameObjects.Container {
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
                    let newObj = scene.spawnFromType(type, 0, 0, {});
                    this.setObjectInteractive(newObj);
                    this.edit(newObj);
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

        scene.getSpawnedEntities().forEach(gameObject => {
            this.setObjectInteractive(gameObject);
        });

        let playerFolder: dat.GUI = this.gui.addFolder('Player');
        playerFolder.add(scene.playerSpawnPosition, 'x');
        playerFolder.add(scene.playerSpawnPosition, 'y');
    }

    setObjectInteractive(gameObject) {
        gameObject.setInteractive();
        gameObject.on('pointerdown', () => {
            this.edit(gameObject);
        })
    }

    edit(gameObject) {
        if (this.objectFolder) this.gui.removeFolder(this.objectFolder);
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
        let type: EntityType = this.editingObject.entityType;
        let x: number = this.editingObject.xOriginal || this.editingObject.x;
        let y: number = this.editingObject.yOriginal || this.editingObject.y;
        let newObj = this.mainScene.spawnFromType(type, x, y, this.editingObject.config);
        this.edit(newObj);
        if (tempCurrentEditingObject && tempCurrentEditingObject.destroy) tempCurrentEditingObject.destroy();
    }
}