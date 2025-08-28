import { Block, Dimension, DimensionLocation, Direction, Vector3 } from "@minecraft/server";
import { correctToRail, directionReverse, edge, getLerpVector, getNormalizedVector, nextBlock, toBlockLocation, VectorAdd } from "./functions";
import { railDirection } from "./railDirection";

type TraceResult = {
  location: Vector3,
  enter: Direction,
  norm?: number,
}
export interface TraceOption{
  t: number,
  onMoved: (location: Vector3, enter: Direction, target: number)=>void
} 

export function traceRail(dimensionLocation: DimensionLocation ,distance: number, enter: Direction, traceOption?: TraceOption): TraceResult{
  let dimension = dimensionLocation.dimension;
  let location: Vector3 = {x: dimensionLocation.x, y: dimensionLocation.y, z: dimensionLocation.z}

  //get block location
  let blockLocation = toBlockLocation(location);
  let currentBlock: Block = dimension.getBlock(blockLocation);
  if(typeof currentBlock == "undefined") return {location: location, enter: enter};
  let state = currentBlock.permutation.getState('rail_direction');
  if(typeof state != "number") return {location: location, enter: enter};

  //get start and end location
  let start = VectorAdd(blockLocation, edge[enter]);
  let end = VectorAdd(blockLocation, edge[railDirection[state][enter].direction]);
  if(railDirection[state][enter].ascending == Direction.Up) end = VectorAdd(end, {x: 0, y: 1, z: 0});
  if(railDirection[state][enter].ascending == Direction.Down) start = VectorAdd(start, {x: 0, y: 1, z: 0});

  location = correctToRail(start, end, location);

  let norm = traceOption?.t || getNormalizedVector(start, end, location);
  let target = distance + norm;

  //trace rail
  while(true){
    if(target >= 1){
      //move to next block
      currentBlock = nextBlock(currentBlock, railDirection[state][enter].direction, railDirection[state][enter].ascending);
      if(typeof currentBlock == "undefined") return {location: end, enter: enter};
      enter = directionReverse[railDirection[state][enter].direction];
      blockLocation = currentBlock.location;
      state = currentBlock.permutation.getState('rail_direction');
      if(typeof state != "number") return {location: end, enter: enter};

      start = VectorAdd(blockLocation, edge[enter]);
      end = VectorAdd(blockLocation, edge[railDirection[state][enter].direction]);
      target--;
    }else{
      //get location
      location = getLerpVector(start, end, target);
      return {location: location, enter: enter, norm: target};
    }
  }
}