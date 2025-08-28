import { DimensionLocation, Direction, Vector3 } from "@minecraft/server";
type TraceResult = {
    location: Vector3;
    enter: Direction;
    norm?: number;
};
export interface TraceOption {
    norm: number;
    onMoved?: (location: DimensionLocation, enter: Direction, residueDistance: number) => void;
}
export declare function traceRail(dimensionLocation: DimensionLocation, distance: number, enter: Direction, traceOption?: TraceOption): TraceResult;
export {};
