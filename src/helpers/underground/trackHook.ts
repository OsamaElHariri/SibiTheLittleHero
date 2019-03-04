import { UndergroundTrack } from "./undergroundTrack";
import { Rectangle } from "../shapes/rectangle";

export class TrackHook {
    dimensions: Rectangle;
    isWithinBounds: boolean = true;

    speed: number = 1;
    private track: UndergroundTrack;


    constructor(track: UndergroundTrack, dimensions: Rectangle) {
        this.dimensions = dimensions;
        this.hookToTrack(track);
    }

    private hookToTrack(track: UndergroundTrack) {
        this.track = track;
        if (track.isHorizontal) this.dimensions.y = track.constantAxisPosition;
        else this.dimensions.x = track.constantAxisPosition;
        this.updateIsWithinBounds();
    }

    setSpeed(speed: number): TrackHook {
        this.speed = speed;
        return this;
    }

    move(): void {
        if (this.track.isHorizontal) this.dimensions.x += this.speed
        else this.dimensions.y += this.speed;
        this.updateIsWithinBounds();
    }

    updateIsWithinBounds(): boolean {
        this.isWithinBounds = this.track.checkWithinBound(this.dimensions);
        return this.isWithinBounds;
    }
}