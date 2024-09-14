import { Entity, world } from "@minecraft/server"

const PRIVATE_CONSTRUCTOR_SYMBOL = Symbol('private');
/**
 * controlling entity
 */
let entities: Map<string, RailMoPlusEntity> = new Map()

export class RailMoPlusEntity{
  constructor(entity: Entity){
    this.entity = entity;
    this.speed = 0;
    if(entity.getDynamicPropertyIds().includes('rail_mo_plus:speed')){
      let speedDP = entity.getDynamicProperty('rail_mo_plus:speed')
      this.speed = typeof speedDP=='number'?speedDP:0;
    }
    entities.set(entity.id, this);
  }
  entity: Entity;
  private speed: number;
  setSpeed(speed: number): void{
    this.speed = speed;
    this.entity.setDynamicProperty('rail_mo_plus:speed', this.speed);
    entities.set(this.entity.id, this);
  }
  getSpeed(): number{
    let speedDP = this.entity.getDynamicProperty('rail_mo_plus:speed');
    return typeof speedDP=='number'?speedDP:0;
  }
  isValid(): boolean{
    return entities.has(this.entity.id) && this.entity.isValid();
  }
  destroy(): void{
    entities.delete(this.entity.id);
  }
}