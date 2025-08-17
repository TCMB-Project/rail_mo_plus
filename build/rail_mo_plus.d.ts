import { Entity, Direction } from "@minecraft/server";
import { VirtualEntity } from "./util";
export declare class RailMoPlusEntity {
    private static instances;
    /**
     * Create an instance for control and start control by RailMoPlus.
     * @param entity controlling entity
     * @param initRotate Rotate the entity on initialisation. (Equivalent to setting runtime_identifier to minecraft:minecart)
     */
    constructor(entity: Entity | VirtualEntity, initRotate?: boolean);
    lastTickTime: Date;
    entity: Entity | VirtualEntity;
    connected: RailMoPlusEntity[];
    /**
     * Determines whether the entity is controlled by RailMoPlus.
     * If set to `true`, RailMoPlus will manage the entity's behavior.
     */
    control: boolean;
    /**
     * Connects an array of RailMoPlusEntity instances to this entity.
     *
     * This method appends the given entities to the `connected` array of the current instance.
     * Before connecting, it checks if the entity is valid. If the entity is invalid, an error is thrown.
     *
     * @param entity - Array of RailMoPlusEntity instances to connect.
     * @throws {Error} If the entity is invalid.
     */
    connect(entity: RailMoPlusEntity[]): void;
    /**
     * Uncouples the connected entities starting from the specified offset.
     *
     * This method removes entities from the `connected` array beginning at the given offset,
     * and returns the first uncoupled entity after reconnecting the remaining uncoupled entities.
     *
     * @param offset - The position in the `connected` array from which to start uncoupling (1-based index).
     * @returns The first entity that was uncoupled.
     * @throws {Error} If the entity is invalid.
     */
    uncouple(offset: number): RailMoPlusEntity;
    onLoop: (entity: RailMoPlusEntity, tickCycle: number) => void;
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
