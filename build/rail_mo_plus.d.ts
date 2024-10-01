import { Entity, Vector2 } from "@minecraft/server";
export declare class RailMoPlusEntity {
    constructor(entity: Entity);
    entity: Entity;
    setSpeed(speed: number): void;
    getSpeed(): number;
    getVirtualRotation(): Vector2;
    /**
     * Internal use only
     * Sets the virtual rotation of the entity.
     * @param symbol Symbol stored in PRIVATE_SYMBOL
     * @param rotation The x and y virtual rotation of the entity (in degrees).
     */
    setVirtualRotation(symbol: symbol, rotation: Vector2): void;
    getEnterDirection(): string;
    setEnterDirection(symbol: symbol, direction: string): void;
    isValid(): boolean;
    destroy(): void;
    private isDestroyed;
    private gameloop;
}
