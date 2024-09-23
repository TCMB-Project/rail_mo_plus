import { Entity, Vector2 } from "@minecraft/server";
export declare class RailMoPlusEntity {
    constructor(entity: Entity);
    entity: Entity;
    setSpeed(speed: number): void;
    getSpeed(): number;
    getVirtualRotation(): Vector2;
    isValid(): boolean;
    destroy(): void;
}
