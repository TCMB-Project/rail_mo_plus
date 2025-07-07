import { Dimension, Vector2, Vector3 } from "@minecraft/server";
export declare class VirtualEntity {
    private rotation;
    location: Vector3;
    dimension: Dimension;
    id: string;
    private dynamicProperties;
    constructor(location: Vector3, rotation: Vector2, dimension: Dimension);
    getRotation(): Vector2;
    setRotation(rotation: Vector2): void;
    getDynamicProperty(property: string): string | number | boolean | Vector3;
    getDynamicPropertyIds(): string[];
    setDynamicProperty(property: string, value: string | number | boolean | Vector3): void;
    teleport(location: Vector3): void;
    isValid(): boolean;
}
