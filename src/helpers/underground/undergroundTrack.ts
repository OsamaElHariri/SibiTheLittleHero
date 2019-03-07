import { Rectangle } from "../shapes/rectangle";
import { Direction } from '../enums/direction';

export class UndergroundTrack {
    readonly isVertical: boolean;
    readonly isHorizontal: boolean;

    readonly minBound: number;
    readonly maxBound: number;
    readonly constantAxisPosition: number;

    readonly direction: Direction;

    constructor(track: {
        minBound: number,
        maxBound: number,
        constantAxisPosition: number,
        direction: Direction
    }) {
        this.minBound = track.minBound;
        this.maxBound = track.maxBound;
        this.constantAxisPosition = track.constantAxisPosition;
        this.direction = track.direction;
        this.isVertical = track.direction == Direction.Left || track.direction == Direction.Right;
        this.isHorizontal = !this.isVertical;
    }

    checkWithinBound(point: Rectangle): boolean {
        let axisToCheck: number = this.isHorizontal ? point.x : point.y;
        let dimensionToAdd: number = this.isHorizontal ? point.width : point.height;
        return this.minBound < axisToCheck && axisToCheck + dimensionToAdd < this.maxBound;
    }

}