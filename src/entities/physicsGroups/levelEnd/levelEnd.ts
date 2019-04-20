import { EntityType } from "../entityType";
import { CameraZoomInZone } from '../../../helpers/camera/cameraZoomInZone';
import { MainScene } from '../../../scenes/mainScene';
import { InputKeys } from "../../../helpers/inputKeys/inputKeys";
import { Dialog } from "../../ui/dialog/dialog";
import { sibiMotherDialog } from './sibiMotherDialog';
import { redGuyDialog } from './redGuyDialog';
import { baronDialog } from './baronDialog';
import { cowboyDialog } from "./cowboyDialog";

export class LevelEnd extends Phaser.GameObjects.Rectangle {
    entityType: EntityType = EntityType.LevelEnd;
    config: LevelEndConfigs;

    private npcBreatheTween: Phaser.Tweens.Tween;
    private mainScene: MainScene

    private hasEnded: boolean = false;
    private dialog;
    private dialogKey: string;

    private spawnedObjects = [];
    constructor(scene: MainScene, x: number, y: number, configs: LevelEndConfigs) {
        super(scene, x, y, 100, 100);
        this.mainScene = scene;
        this.config = configs;
        this.scene.add.existing(this);

        let zoomInZone = new CameraZoomInZone({ scene: scene, x: x, y: y - 100, 
            onEnter: () => this.onCloseToNpc() })
            .setOrigin(0.5);
        zoomInZone.x -= zoomInZone.width / 2;
        scene.miscGroup.add(zoomInZone);
        this.spawnedObjects.push(zoomInZone);

        let npc: Phaser.GameObjects.Sprite;
        switch (configs.endType) {
            case LevelEndType.SibiMother:
                this.dialogKey = 'SibiMother';
                this.dialog = sibiMotherDialog;
                npc = this.scene.add.sprite(x, y - 12, 'SibiMother')
                    .setOrigin(0.5, 1)
                    .setScale(0.5);
                break;
            case LevelEndType.RedGuy:
                this.dialogKey = 'RedGuy';
                this.dialog = redGuyDialog;
                npc = this.scene.add.sprite(x, y - 12, 'RedGuy')
                    .setOrigin(0.5, 1)
                    .setScale(0.5);
                break;
            case LevelEndType.Baron:
                this.dialogKey = 'Baron';
                this.dialog = baronDialog;
                npc = this.scene.add.sprite(x, y - 12, 'Baron')
                    .setOrigin(0.5, 1)
                    .setScale(0.5);
                break;
            case LevelEndType.Cowboy:
                this.dialogKey = 'Cowboy';
                this.dialog = cowboyDialog;
                npc = this.scene.add.sprite(x, y - 12, 'Cowboy')
                    .setOrigin(0.5, 1)
                    .setScale(0.5);
                break;
        }

        if (npc) {
            this.spawnedObjects.push(npc);
            this.npcBreatheTween = this.scene.add.tween({
                targets: [npc],
                ease: 'Sine.easeInOut',
                duration: 500,
                loopDelay: 200,
                loop: -1,
                yoyo: true,
                angle: {
                    getStart: () => -2,
                    getEnd: () => 2,
                },
            });
        }

        let moundSprite = this.scene.add.sprite(x, y, 'MoundTrap')
            .setOrigin(0.5, 1);
        this.spawnedObjects.push(moundSprite);
    }

    onCloseToNpc(): void {
        if (this.hasEnded) return;
        this.hasEnded = true;

        InputKeys.getInstance().isDisabled = true;

        let npcDialog = new Dialog(this.scene, [{
            key: 'Sibi',
            x: this.mainScene.player.x + 5,
            y: this.y - 100,
            isOnTheRight: false,
        }, {
            key: this.dialogKey,
            x: this.x - 250,
            y: this.y - 100,
            isOnTheRight: true,
        }]);
        npcDialog.startDialog(this.dialog);
        npcDialog.on('done', () => this.mainScene.goToNextLevel());
    }

    destroy() {
        this.spawnedObjects.forEach(obj => obj.destroy());
        if (this.npcBreatheTween) this.npcBreatheTween.stop();
        super.destroy();
    }
}

enum LevelEndType {
    SibiMother = 1,
    RedGuy,
    Cowboy,
    Baron,
}

export class LevelEndConfigs {
    endType: LevelEndType = LevelEndType.SibiMother;
    constructor(configs?: { endType?: LevelEndType }) {
        configs = configs || {};
        this.endType = configs.endType || this.endType;
    }
}