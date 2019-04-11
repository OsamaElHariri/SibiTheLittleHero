import * as dat from 'dat.gui';
import { MainScene } from '../../scenes/mainScene';
import { EntityType } from '../../entities/physicsGroups/entityType';
import { JsonHandler } from './jsonHandler';
import { LevelEditor } from './levelEditor';

export class EditingPanel extends Phaser.GameObjects.Container {
    private gui: dat.GUI;
    private objectFolder: dat.GUI;
    private editingObject;
    private mainScene: MainScene;
    private levelEditor: LevelEditor;

    private objectProperties;
    constructor(scene: MainScene, levelEditor: LevelEditor) {
        super(scene);
        this.mainScene = scene;
        this.levelEditor = levelEditor;
        this.gui = new dat.GUI();

        let spawnObjectsFolder: dat.GUI = this.gui.addFolder('Spawn Object');

        let keys = Object.keys(EntityType).filter(key => !isNaN(Number(key)));
        keys.forEach(key => {
            spawnObjectsFolder.add({
                spawn: () => {
                    let type = Number(key);
                    let newObj = scene.spawnFromType(type, levelEditor.x, levelEditor.y, {});
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
        gameObject.on('pointerup', () => {
            this.edit(gameObject);
        })
    }

    edit(gameObject) {
        if (this.objectFolder) this.gui.removeFolder(this.objectFolder);
        this.editingObject = gameObject;
        this.objectFolder = this.gui.addFolder('Edit Object');
        this.objectFolder.open();
        this.objectProperties = {config: {}};

        if (gameObject.xOriginal == 0 || gameObject.xOriginal) {
            this.objectProperties.x = gameObject.xOriginal;
        } else if (gameObject.x == 0 || gameObject.x) {
            this.objectProperties.x = gameObject.x;
        }
        this.objectFolder.add(this.objectProperties, 'x').onChange(() => this.onSelectedObjectUpdate());

        if (gameObject.yOriginal == 0 || gameObject.yOriginal) {
            this.objectProperties.y = gameObject.yOriginal;
        } else if (gameObject.y == 0 || gameObject.y) {
            this.objectProperties.y = gameObject.y;
        }
        this.objectFolder.add(this.objectProperties, 'y').onChange(() => this.onSelectedObjectUpdate());


        if (gameObject.config) {
            let keys: string[] = Object.keys(gameObject.config);
            keys.forEach((key: string) => {
                this.objectProperties.config[key] = gameObject.config[key]
                this.objectFolder.add(this.objectProperties.config, key).onChange(() => this.onSelectedObjectUpdate());
            });
        }

        this.objectFolder.add({
            focus: () => {
                if (this.editingObject)
                    this.levelEditor.setPosition(this.editingObject.x, this.editingObject.y);
            }
        }, 'focus').name('Focus');

        this.objectFolder.add({
            delete: () => {
                if (this.editingObject && this.editingObject.destroy) this.editingObject.destroy();
                this.editingObject = null;
            }
        }, 'delete').name('Delete');
    }

    private onSelectedObjectUpdate() {
        let tempCurrentEditingObject = this.editingObject;
        let type: EntityType = this.editingObject.entityType;
        let x: number = this.objectProperties.x;
        let y: number = this.objectProperties.y;
        let newObj = this.mainScene.spawnFromType(type, x, y, this.objectProperties.config);
        this.editingObject = newObj;
        if (tempCurrentEditingObject && tempCurrentEditingObject.destroy) tempCurrentEditingObject.destroy();
    }
}