import { Direction } from "@minecraft/server";
type ExitDirection = {
    direction: Direction;
    ascending?: Direction;
};
export declare const railDirection: {
    East: ExitDirection;
    West: ExitDirection;
    North: ExitDirection;
    South: ExitDirection;
    default_enter: Direction;
}[];
export {};
