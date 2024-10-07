import { Direction } from "@minecraft/server";
type ExitDirection = {
    direction: Direction;
    ascending?: Direction;
};
export declare const rail_direction: {
    East: ExitDirection;
    West: ExitDirection;
    North: ExitDirection;
    South: ExitDirection;
}[];
export {};
