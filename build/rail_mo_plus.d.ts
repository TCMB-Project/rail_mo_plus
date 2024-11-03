import { Entity, Direction } from "@minecraft/server";
export declare class RailMoPlusEntity {
    private static instances;
    /**
     * Create an instance for control and start control by RailMoPlus.
     * @param entity controlling entity
     * @param initRotate Rotate the entity. (Equivalent to setting runtime_identifier to minecraft:minecart)
     */
    constructor(entity: Entity, initRotate?: boolean);
    entity: Entity;
    connected: RailMoPlusEntity[];
    connect(entity: RailMoPlusEntity): void;
    onLoop: () => void;
    /**
     * Set the speed.
     * @param speed Speed (km/h) to be set
     */
    setSpeed(speed: number): void;
    getSpeed(): number;
    getEnterDirection(): Direction;
    setEnterDirection(symbol: symbol, direction: Direction): void;
    getLastTickTime(): Date;
    setLastTickTime(symbol: symbol, time: Date): void;
    getMileage(): number;
    setMileage(mileage: number): void;
    addMileage(distance: number): number;
    isValid(): boolean;
    destroy(): void;
    private isDestroyed;
    private gameloop;
}
