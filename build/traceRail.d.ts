import { DimensionLocation, Direction, Vector3 } from "@minecraft/server";
type TraceResult = {
    location: Vector3;
    enter: Direction;
    norm?: number;
};
export interface TraceOption {
    t: number;
    onMoved: (location: Vector3, enter: Direction, target: number) => void;
}
export declare function traceRail(dimensionLocation: DimensionLocation, distance: number, enter: Direction, traceOption?: TraceOption): TraceResult;
export {};
