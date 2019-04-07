import { MainScene } from "../../scenes/mainScene";
import { EntityType } from "../../entities/physicsGroups/entityType";
import { JsonDownload } from "./jsonDownload";

export class JsonHandler {
    private mainScene: MainScene;
    constructor(mainScene: MainScene) {
        this.mainScene = mainScene;
    }

    instantiateFromJson(json) {
        this.mainScene.playerSpawnPosition = json.playerSpawnPosition;
        json.objects.forEach((obj: EncodedGameObject) => {
            this.mainScene.spawnFromType(obj.type, obj.x, obj.y, obj.config);
        });
    }

    downloadLevelJson(levelName?: string) {
        JsonDownload.download(this.saveAsJson(), levelName);
    }

    saveAsJson(): any {
        return {
            playerSpawnPosition: this.getPlayerSpawnPosition(),
            objects: this.encodeAll()
        }
    }

    private getPlayerSpawnPosition(): { x: number, y: number } {
        return {
            x: this.mainScene.playerSpawnPosition.x || 0,
            y: this.mainScene.playerSpawnPosition.y || 0,
        }
    }

    private encodeAll(): EncodedGameObject[] {
        let encodedObjects: EncodedGameObject[] = [];
        this.mainScene.getSpawnedEntities().forEach(gameObject => {
            let encodedObject: EncodedGameObject = this.encodeGameObject(gameObject);
            if (encodedObject) encodedObjects.push(encodedObject);
        });
        return encodedObjects;
    }

    private encodeGameObject(gameObject): EncodedGameObject {
        if (!gameObject.entityType) return null;
        let encodedObject: EncodedGameObject = new EncodedGameObject();
        encodedObject.type = gameObject.entityType;
        if (gameObject.xOriginal || gameObject.x) encodedObject.x = gameObject.xOriginal || gameObject.x;
        if (gameObject.yOriginal || gameObject.y) encodedObject.y = gameObject.yOriginal || gameObject.y;
        if (gameObject.config) encodedObject.config = gameObject.config;
        return encodedObject;
    }
}

class EncodedGameObject {
    type: EntityType;
    x: number = 0;
    y: number = 0;
    config: any = {};
}