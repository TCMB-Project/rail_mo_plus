import { Vector3, Block, Vector2, Direction } from "@minecraft/server";
export declare const direction: {
    "-180": Direction;
    "0": Direction;
    "90": Direction;
    "-90": Direction;
};
export declare const edge: {
    North: Vector3;
    South: Vector3;
    West: Vector3;
    East: Vector3;
};
export declare const direction_reverse: {
    North: Direction;
    South: Direction;
    West: Direction;
    East: Direction;
};
/**
 * Function to return a normalized value
 * @param {Vector3} start - Starting coordinates
 * @param {Vector3} end - Ending coordinates
 * @param {Vector3} location - Current location
 * @returns {number} - Normalized value
 */
export declare function getNormalizedVector(start: Vector3, end: Vector3, location: Vector3): number;
/**
 * Function to return interpolated coordinates based on a normalized value
 * @param {Vector3} start - Starting coordinates
 * @param {Vector3} end - Ending coordinates
 * @param {number} t - Normalized value (0 to 1)
 * @returns {Vector3} - Interpolated coordinates
 */
export declare function getLerpVector(start: Vector3, end: Vector3, t: number): Vector3;
/**
 * Function to correct the position to the nearest point on the line segment (start, end)
 * @param start - The starting point of the line
 * @param end - The ending point of the line
 * @param location - The current position
 * @returns The corrected position (the closest point on the line segment)
 */
export declare function correctToRail(start: Vector3, end: Vector3, location: Vector3): Vector3;
export declare function toBlockLocation(location: Vector3): Vector3;
export declare function VectorAdd(vector1: Vector3, vector2: Vector3): Vector3;
export declare function toVector3(vector: Vector2): Vector3;
export declare function toVector2(vector: Vector3): Vector2;
export declare function nextBlock(block: Block, direction: Direction, ascending: Direction): Block;
