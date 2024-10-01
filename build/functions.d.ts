import { Vector3 } from "@minecraft/server";
/**
 * Function to return a normalized value
 * @param {Vector3} start - Starting coordinates
 * @param {Vector3} end - Ending coordinates
 * @param {Vector3} location - Current location
 * @returns {number} - Normalized value
 */
export declare function getNormalizedVector(start: Vector3, end: Vector3, location: Vector3): number;
/**
 * Function to correct the position to the nearest point on the line segment (start, end)
 * @param start - The starting point of the line
 * @param end - The ending point of the line
 * @param location - The current position
 * @returns The corrected position (the closest point on the line segment)
 */
export declare function correctToRail(start: Vector3, end: Vector3, location: Vector3): Vector3;
export declare function toBlockLocation(location: Vector3): Vector3;
