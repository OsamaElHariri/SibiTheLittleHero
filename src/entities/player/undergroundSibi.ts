import { DirectionTrack } from '../../helpers/underground/directionTrack';
import { InputKeys } from '../../helpers/inputKeys/inputKeys';

export class UndergroundSibi extends Phaser.GameObjects.Sprite {
    static textureKey: string = 'UndergroundSibi';
    
    private keyboardInputs: InputKeys;

    constructor(scene: Phaser.Scene, x: number, y: number, directionTrack: DirectionTrack) {
        super(scene, x, y, UndergroundSibi.textureKey);

        this.scene.physics.world.enable(this);
        // set offset based on track direction
        // handle inputs

        this.keyboardInputs = InputKeys.getInstance();
        this.scene.add.existing(this);
    }
}