import { Entity } from "@minecraft/server";
export declare class RailMoPlusEntity {
    constructor(entity: Entity);
    entity: Entity;
    private speed;
    setSpeed(speed: number): void;
    getSpeed(): number;
    isValid(): boolean;
    destroy(): void;
}
