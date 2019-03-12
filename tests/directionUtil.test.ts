import {expect} from 'chai';
import { DirectionUtil } from '../src/helpers/directionUtil/directionUtil';
import { Direction } from '../src/helpers/enums/direction';

describe('directionUtil', function() {
    it('clockwise', function() {
      let dir:Direction = DirectionUtil.clockWise(Direction.Up);
      expect(dir).to.be.equal(Direction.Right);
    }); 
    it('clockwise wrap', function() {
        let dir:Direction = DirectionUtil.clockWise(Direction.Left);
        expect(dir).to.be.equal(Direction.Up);
      }); 
      it('counterclockwise', function() {
        let dir:Direction = DirectionUtil.counterClockWise(Direction.Left);
        expect(dir).to.be.equal(Direction.Down);
      }); 
      it('another counterclockwise', function() {
        let dir:Direction = DirectionUtil.counterClockWise(Direction.Right);
        expect(dir).to.be.equal(Direction.Up);
      }); 
      it('counterclockwise wrap', function() {
          let dir:Direction = DirectionUtil.counterClockWise(Direction.Up);
          expect(dir).to.be.equal(Direction.Left);
        }); 
  });