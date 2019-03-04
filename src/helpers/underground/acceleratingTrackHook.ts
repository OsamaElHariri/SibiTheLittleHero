import { TrackHook } from './trackHook';
import { UndergroundTrack } from './undergroundTrack';
import { Rectangle } from '../shapes/rectangle';

export class AcceleratingTrackHook extends TrackHook {
    private acceleration: number = 1;
    private maxSpeed: number = 2;

    constructor(track: UndergroundTrack, dimensions: Rectangle) {
        super(track, dimensions);
    }

    setAcceleration(acceleration: number): AcceleratingTrackHook {
        this.acceleration = acceleration;
        return this;
    }

    setMaxSpeed(maxSpeed: number): AcceleratingTrackHook {
        this.maxSpeed = maxSpeed;
        return this;
    }

    move(): void {
        this.setSpeed(Math.min(this.maxSpeed, this.speed + this.acceleration));
        super.move();
    }
}