import { Direction } from "../enums/direction";
import { NumbersUtil } from "../numbersUtil/numberUtil";

export class DirectionUtil {
    static directions:Direction[] = [Direction.Up, Direction.Right, Direction.Down, Direction.Left];

    static clockWise(direction: Direction): Direction {
        let index: number = DirectionUtil.directions.indexOf(direction);
        index = NumbersUtil.mod(index + 1, DirectionUtil.directions.length);
        return DirectionUtil.directions[index];
    }

    static counterClockWise(direction: Direction): Direction {
        let index: number = DirectionUtil.directions.indexOf(direction);
        index = NumbersUtil.mod(index - 1, DirectionUtil.directions.length);
        return DirectionUtil.directions[index];
    }
    
}