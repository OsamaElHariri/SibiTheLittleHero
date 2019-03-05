import { UndergroundTrack } from './undergroundTrack';
import { Direction } from '../enums/direction';

export interface DirectionTrack {
    track: UndergroundTrack;
    platformTrackDirection: Direction;
}