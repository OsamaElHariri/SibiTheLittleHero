import { UndergroundTrack } from "./undergroundTrack";
import { Rectangle } from "../shapes/rectangle";

export class TrackHook {
    dimensions: Rectangle;
    isWithinBounds: boolean = true;

    speed: number = 3;
    track: UndergroundTrack;

    private shouldClamp: boolean = false;


    constructor(dimensions: Rectangle, track?: UndergroundTrack) {
        this.dimensions = dimensions;
        this.setTrack(track);
    }

    setTrack(track: UndergroundTrack): TrackHook {
        this.track = track;
        if (!track) return;
        if (track.isHorizontal) this.dimensions.y = track.constantAxisPosition;
        else this.dimensions.x = track.constantAxisPosition;
        if (this.shouldClamp)
            this.clampToTrack()
        this.updateIsWithinBounds();
    }

    setSpeed(speed: number): TrackHook {
        this.speed = speed;
        return this;
    }

    clampOnEdges(shouldClamp: boolean): TrackHook {
        this.shouldClamp = shouldClamp;
        return this;
    }

    move(): void {
        this.moveBy(this.speed);
    }

    moveReverse(): void {
        this.moveBy(-this.speed);
    }

    private moveBy(speed: number): void {
        if (!this.track) return;
        if (this.track.isHorizontal) this.dimensions.x += speed
        else this.dimensions.y += speed;
        this.updateIsWithinBounds();

        if (!this.isWithinBounds && this.shouldClamp)
            this.clampToTrack()
    }

    private updateIsWithinBounds(): boolean {
        if (!this.track) return true;
        this.isWithinBounds = this.track.checkWithinBound(this.dimensions);
        return this.isWithinBounds;
    }

    private clampToTrack(): void {
        if (this.track.isHorizontal) {
            this.dimensions.x = Math.min(this.track.maxBound, Math.max(this.dimensions.x, this.track.minBound));
        } else {
            this.dimensions.y = Math.min(this.track.maxBound, Math.max(this.dimensions.y, this.track.minBound));
        }
    }
}