import { Dimension, Vector2, Vector3 } from "@minecraft/server";

export class VirtualEntity{
  private rotation: Vector2;
  location: Vector3;
  dimension: Dimension;
  id: string;
  private dynamicProperties: Map<string, string | number | boolean | Vector3> = new Map();
  constructor(location: Vector3, rotation: Vector2, dimension: Dimension){
    this.location = location;
    this.rotation = rotation;
    this.dimension = dimension;
    this.id = genId();
  }
  getRotation(): Vector2{
    return this.rotation;
  }
  setRotation(rotation: Vector2): void{
    this.rotation = rotation;
  }
  getDynamicProperty(property: string): string | number | boolean | Vector3{
    return this.dynamicProperties.get(property);
  }
  getDynamicPropertyIds(): string[]{
    return Array.from(this.dynamicProperties.keys());
  }
  setDynamicProperty(property: string, value: string | number | boolean | Vector3): void{
    if(value === undefined){
      this.dynamicProperties.delete(property);
    }else{
      this.dynamicProperties.set(property, value);
    }
  }
  teleport(location: Vector3): void{
    this.location = location;
  }
  isValid(): boolean{
    return true;
  }
}

function genId(): string{
  let id = "RailMoPlusVirtual_";
  for(let i = 0; i < 10; i++){
    id += randomInt(0, 9);
  }
  return id;
}
function randomInt(min: number, max: number): number{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}