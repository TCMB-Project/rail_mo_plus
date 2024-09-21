import { Entity, Block, system, Vector2, Vector3, world } from "@minecraft/server"
import { rail_direction } from "./rail_direction"

/**
 * controlling entity
 */
let entities: Map<string, RailMoPlusEntity> = new Map()

export class RailMoPlusEntity{
  constructor(entity: Entity/*, rotate: boolean*/){
    this.entity = entity;
    //this.rotate = rotate;
    if(!entity.getDynamicPropertyIds().includes('rail_mo_plus:speed')){
      entity.setDynamicProperty('rail_mo_plus:speed', 0);
      //virtual rotation
      entity.setDynamicProperty('rail_mo_plus:vrotation_x', entity.getRotation().x);
      entity.setDynamicProperty('rail_mo_plus:vrotation_y', entity.getRotation().y);
    }
    entities.set(entity.id, this);
  }
  entity: Entity;
  setSpeed(speed: number): void{
    this.entity.setDynamicProperty('rail_mo_plus:speed', speed);
    entities.set(this.entity.id, this);
  }
  getSpeed(): number{
    let speedDP = this.entity.getDynamicProperty('rail_mo_plus:speed');
    return typeof speedDP=='number'?speedDP:0;
  }
  getVirtualRotation(): Vector2{
    let vrotation_x_dp = this.entity.getDynamicProperty('rail_mo_plus:vrotation_x');
    let vrotation_y_dp = this.entity.getDynamicProperty('rail_mo_plus:vrotation_y');
    let vrotation_x: number = typeof vrotation_x_dp=="number"?vrotation_x_dp:0;
    let vrotation_y: number = typeof vrotation_y_dp=="number"?vrotation_y_dp:0;

    return {x: vrotation_x, y: vrotation_y};
  }
  isValid(): boolean{
    return entities.has(this.entity.id) && this.entity.isValid();
  }
  destroy(): void{
    entities.delete(this.entity.id);
  }
}

function gameloop(){
  for(const [_, car] of entities){
    const entity = car.entity;
    const location: Vector3 = car.entity.location;
    const current_block: Block | undefined = car.entity.dimension.getBlock({x: Math.floor(location.x), y: Math.floor(location.y), z: Math.floor(location.z)});


  }
  system.run(gameloop);
}
system.run(gameloop);