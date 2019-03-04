import { Rectangle } from "../shapes/rectangle";

export class UndergroundTrack {
    readonly isVertical: boolean;
    readonly isHorizontal: boolean;

    readonly minBound: number;
    readonly maxBound: number;
    readonly constantAxisPosition: number;

    constructor(track: {
        minBound: number,
        maxBound: number,
        constantAxisPosition: number,
        isVertical?: boolean
    }) {
        this.minBound = track.minBound;
        this.maxBound = track.maxBound;
        this.constantAxisPosition = track.constantAxisPosition;
        this.isVertical = track.isVertical;
        this.isHorizontal = !this.isVertical;
    }

    checkWithinBound(point: Rectangle): boolean {
        let axisToCheck: number = this.isHorizontal ? point.x : point.y;
        let dimensionToAdd: number = this.isHorizontal ? point.width : point.height;
        return this.minBound < axisToCheck && axisToCheck + dimensionToAdd < this.maxBound;
    }

}