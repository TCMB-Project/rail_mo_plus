import { Dimension, Direction, Vector3 } from "@minecraft/server";
type TraceResult = {
    location: Vector3;
    enter: Direction;
};
export declare function traceRail(location: Vector3, dimension: Dimension, distance: number, enter: Direction): TraceResult;
export {};
