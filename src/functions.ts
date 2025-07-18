import { Vector3, Block, Vector2, Direction } from "@minecraft/server";

export const direction: Record<number, Direction> = {
  "-180": <Direction>"North",
  "0": <Direction>"South",
  "90": <Direction>"West",
  "-90": <Direction>"East"
}
export const edge: Record<Direction, Vector3> = {
  "North": <Vector3>{x: 0.5, y: 0, z: 0},
  "South": <Vector3>{x: 0.5, y: 0, z: 1},
  "West": <Vector3>{x: 0, y: 0, z: 0.5},
  "East": <Vector3>{x: 1, y: 0, z: 0.5},
  "Up": undefined,
  "Down": undefined
}
export const direction_reverse: Record<Direction, Direction> = {
  "North": <Direction>"South",
  "South": <Direction>"North",
  "West": <Direction>"East",
  "East": <Direction>"West",
  "Up": undefined,
  "Down": undefined
}

/**
 * Function to return a normalized value
 * @param {Vector3} start - Starting coordinates
 * @param {Vector3} end - Ending coordinates
 * @param {Vector3} location - Current location
 * @returns {number} - Normalized value
 */
export function getNormalizedVector(start: Vector3, end: Vector3, location: Vector3): number {
  // Calculate the difference vector
  const vectorDiff = {
    x: end.x - start.x,
    y: end.y - start.y,
    z: end.z - start.z
  };

  // Calculate the difference from the start to the current location
  const locationDiff = {
    x: location.x - start.x,
    y: location.y - start.y,
    z: location.z - start.z
  };

  // Calculate the length of the vectors
  const vectorLength = Math.sqrt(vectorDiff.x ** 2 + vectorDiff.y ** 2 + vectorDiff.z ** 2);
  const locationLength = Math.sqrt(locationDiff.x ** 2 + locationDiff.y ** 2 + locationDiff.z ** 2);

  // Calculate the normalized value
  const normalizedValue = locationLength / vectorLength;

  return normalizedValue;
}

/**
 * Function to return interpolated coordinates based on a normalized value
 * @param {Vector3} start - Starting coordinates
 * @param {Vector3} end - Ending coordinates
 * @param {number} t - Normalized value (0 to 1)
 * @returns {Vector3} - Interpolated coordinates
 */
export function getLerpVector(start: Vector3, end: Vector3, t: number): Vector3 {
    // Ensure t is within the range [0, 1]
    t = Math.max(0, Math.min(1, t));

    // Calculate interpolated coordinates
    return {
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t,
      z: start.z + (end.z - start.z) * t
    };
}

/**
 * Function to correct the position to the nearest point on the line segment (start, end)
 * @param start - The starting point of the line
 * @param end - The ending point of the line
 * @param location - The current position
 * @returns The corrected position (the closest point on the line segment)
 */
export function correctToRail(start: Vector3, end: Vector3, location: Vector3): Vector3 {
  // Vector from start to end
  const line = {
    x: end.x - start.x,
    y: end.y - start.y,
    z: end.z - start.z
  };

  // Vector from start to current location
  const locationVector = {
    x: location.x - start.x,
    y: location.y - start.y,
    z: location.z - start.z
  };

  // The squared length (norm) of the line vector
  const lineLengthSquared = line.x * line.x + line.y * line.y + line.z * line.z;

  if (lineLengthSquared === 0) {
    // If the start and end points are the same, return the start point
    return start;
  }

  // Calculate the scalar value to project locationVector onto line
  const t = (locationVector.x * line.x + locationVector.y * line.y + locationVector.z * line.z) / lineLengthSquared;

  // Clamp the value of t to ensure it is within the range 0 <= t <= 1, keeping the point within the line segment
  const clampedT = Math.max(0, Math.min(1, t));

  // Calculate the projected (corrected) position
  const correctedPosition = {
    x: start.x + clampedT * line.x,
    y: start.y + clampedT * line.y,
    z: start.z + clampedT * line.z
  };

  return correctedPosition;
}

export function toBlockLocation(location: Vector3): Vector3{
  return {x: Math.floor(location.x), y: Math.floor(location.y), z: Math.floor(location.z)};
}

export function VectorAdd(vector1: Vector3, vector2: Vector3): Vector3 {
  return {x: vector1.x + vector2.x, y: vector1.y + vector2.y, z: vector1.z + vector2.z}
}
export function toVector3(vector: Vector2): Vector3{
  return { x: vector.x, y: vector.y, z: 0}
}
export function toVector2(vector: Vector3): Vector2{
  return { x: vector.x, y: vector.y}
}

export function nextBlock(block: Block, direction: Direction, ascending: Direction): Block{
  let after_block: Block | undefined;
  switch(direction){
    case "North":{
      after_block = block.offset({x: 0, y: 0, z: -1});
    }
    break;
    case "South":{
      after_block = block.offset({x: 0, y: 0, z: 1});
    }
    break;
    case "East":{
      after_block = block.offset({x: 1, y: 0, z: 0});
    }
    break;
    case "West":{
      after_block = block.offset({x: -1, y: 0, z: 0});
    }
    break;
  }
  if(typeof after_block == undefined) throw new Error('Unable to resolve next block');
  if(after_block.typeId == 'minecraft:air'){
    after_block = after_block.offset({x: 0, y: -1, z: 0});
    if(after_block.typeId == 'minecraft:air') return;
  }
  if(ascending == "Up"){
    after_block = after_block.offset({x: 0, y: 1, z: 0});
  }

  return after_block;
}