import { Vector3, Block, Vector2, Dimension } from "@minecraft/server";
export declare const direction: {
    "-180": string;
    "0": string;
    "90": string;
    "-90": string;
};
export declare const edge: {
    north: Vector3;
    south: Vector3;
    west: Vector3;
    east: Vector3;
};
export declare const direction_reverse: {
    north: string;
    south: string;
    west: string;
    east: string;
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
type nextBlockReturn = {
    block: Block;
};
export declare function nextBlock(dimension: Dimension, location: Vector3, rotation: Vector2): nextBlockReturn;
export {};
