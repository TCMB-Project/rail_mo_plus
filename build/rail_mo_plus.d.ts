import { Entity, Direction } from "@minecraft/server";
export declare class RailMoPlusEntity {
    private static instances;
    /**
     * Create an instance for control and start control by RailMoPlus.
     * @param entity controlling entity
     * @param initRotate Rotate the entity. (Equivalent to setting runtime_identifier to minecraft:minecart)
     */
    constructor(entity: Entity, initRotate?: boolean);
    lastTickTime: Date;
    entity: Entity;
    connected: RailMoPlusEntity[];
    connect(entity: RailMoPlusEntity[]): void;
    uncouple(offset: number): RailMoPlusEntity;
    onLoop: (entity: RailMoPlusEntity, time: number) => void;
    /**
     * Set the speed.
     * @param speed Speed (km/h) to be set
     */
    setSpeed(speed: number): void;
    getSpeed(): number;
    getEnterDirection(): Direction;
    setEnterDirection(symbol: symbol, direction: Direction): void;
    getMileage(): number;
    setMileage(mileage: number): void;
    addMileage(distance: number): number;
    isValid(): boolean;
    destroy(): void;
    private isDestroyed;
    private gameloop;
}
