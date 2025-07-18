import { Entity, Block, system, Vector3, Direction } from "@minecraft/server"
import { rail_direction } from "./rail_direction"
import { toBlockLocation, direction_reverse } from "./functions";
import { traceRail } from "./traceRail";
import { VirtualEntity } from "./util";

const PRIVARE_SYMBOL = Symbol('rail_mo_plus_private');

export class RailMoPlusEntity{
  private static instances: Map<string, RailMoPlusEntity> = new Map();
  /**
   * Create an instance for control and start control by RailMoPlus.
   * @param entity controlling entity
   * @param initRotate Rotate the entity on initialisation. (Equivalent to setting runtime_identifier to minecraft:minecart)
   */
  constructor(entity: Entity | VirtualEntity, initRotate: boolean = false/*, rotate: boolean*/){
    if(RailMoPlusEntity.instances.has(entity.id)) {
      return RailMoPlusEntity.instances.get(entity.id)!;
    }

    this.entity = entity;
    //this.rotate = rotate;
    if(!entity.getDynamicPropertyIds().includes('rail_mo_plus:speed')){
      entity.setDynamicProperty('rail_mo_plus:speed', 0);
      this.setMileage(0);
      this.entity.setDynamicProperty('rail_mo_plus:reverse', false);
    }
    if(initRotate){
      entity.setRotation({x: 0, y: 0});
    }
    let current_time = new Date();
    this.lastTickTime = current_time;

    RailMoPlusEntity.instances.set(entity.id, this);
    system.run(()=>this.gameloop());
  }
  lastTickTime: Date;
  entity: Entity | VirtualEntity;
  connected: RailMoPlusEntity[] = [];
  control: boolean = true;
  connect(entity: RailMoPlusEntity[]): void{
    if(!this.isValid()){
      throw new Error('The entity is invalid.');
    }
    this.connected.concat(entity);
  }
  uncouple(offset: number): RailMoPlusEntity{
    if(!this.isValid()){
      throw new Error('The entity is invalid.');
    }

    let uncoupled = this.connected.splice(offset - 1);
    let uncoupled_front = uncoupled.shift();
    uncoupled_front.connect.apply(uncoupled);

    return uncoupled_front;
  }
  onLoop: (entity: RailMoPlusEntity, tickCycle: number)=>void = function(_){};
  /**
   * Set the speed.
   * @param speed Speed (km/h) to be set
   */
  setSpeed(speed: number): void{
    if(!this.isValid()){
      throw new Error('The entity is invalid.');
    }

    this.entity.setDynamicProperty('rail_mo_plus:speed', speed);
    
    let reverse = this.entity.getDynamicProperty('rail_mo_plus:reverse');
    if(reverse != speed < 0) this.setEnterDirection(PRIVARE_SYMBOL, direction_reverse[this.getEnterDirection()]);
    this.entity.setDynamicProperty('rail_mo_plus:reverse', speed < 0);

    for(let entity of this.connected){
      entity.setSpeed(speed);
    }
  }
  getSpeed(): number{
    if(!this.isValid()){
      throw new Error('The entity is invalid.');
    }

    let speedDP = this.entity.getDynamicProperty('rail_mo_plus:speed');
    return typeof speedDP=='number'?speedDP:0;
  }
  getEnterDirection(): Direction{
    if(!this.isValid()){
      throw new Error('The entity is invalid.');
    }

    let direction_dp = this.entity.getDynamicProperty('rail_mo_plus:enter_direction');
    if(typeof direction_dp != "string"){
      let block_location = toBlockLocation(this.entity.location);
      let current_block: Block = this.entity.dimension.getBlock(block_location);
      let state = current_block.permutation.getState('rail_direction');
      if(typeof state != "number") throw new Error("Unable to resolve Enter direction.");
      direction_dp = rail_direction[state].default_enter;
      this.entity.setDynamicProperty('rail_mo_plus:enter_direction', direction_dp);
    }
    return <Direction>direction_dp;
  }
  setEnterDirection(symbol: symbol, direction: Direction): void{
    if(!this.isValid()){
      throw new Error('The entity is invalid.');
    }

    if(symbol != PRIVARE_SYMBOL) throw Error('Use from outside the module is not allowed.');
    this.entity.setDynamicProperty('rail_mo_plus:enter_direction', direction);
  }
  getMileage(): number{
    if(!this.isValid()){
      throw new Error('The entity is invalid.');
    }

    let mileage_dp = this.entity.getDynamicProperty('rail_mo_plus:mileage');
    if(typeof mileage_dp != "number") throw new Error('rail_mo_plus:mileage is not a number.');
    return mileage_dp;
  }
  setMileage(mileage: number): void{
    if(!this.isValid()){
      throw new Error('The entity is invalid.');
    }

    this.entity.setDynamicProperty('rail_mo_plus:mileage', mileage);
  }
  addMileage(distance: number): number{
    if(!this.isValid()){
      throw new Error('The entity is invalid.');
    }

    let mileage = this.getMileage();
    mileage += distance;
    this.setMileage(mileage);
    return mileage;
  }
  isValid(): boolean{
    return this.entity.isValid() && !this.isDestroyed;
  }
  destroy(): void{
    this.isDestroyed = true;
    RailMoPlusEntity.instances.delete(this.entity.id);
    if(this.entity.isValid()){
      this.entity.setDynamicProperty('rail_mo_plus:enter_direction', undefined);
      this.entity.setDynamicProperty('rail_mo_plus:speed', undefined);
    }
  }
  private isDestroyed: boolean = false;

  private gameloop(): void{
    if(this.isDestroyed){
      return;
    }
    let last_time = this.lastTickTime;
    let current_time = new Date();
    let tickCycle = current_time.getTime() - last_time.getTime();
    if(this.control){
      try{
        do{
          let entity = this.entity;
          if(!entity.isValid()) break;
    
          let location: Vector3 = entity.location;
    
          // km/h to m/ms
          const speed = this.getSpeed() / 3600;
    
          const distance = Math.abs(speed) * tickCycle;

          this.lastTickTime = current_time;

          //Ignore gravity
          if(speed == 0){
            entity.teleport(location);
            break;
          }
    
          let traceResult = traceRail(location, entity.dimension, distance, this.getEnterDirection());

          entity.teleport(traceResult.location);
          this.setEnterDirection(PRIVARE_SYMBOL, traceResult.enter);
          this.addMileage(distance);
        }while(false);
      }catch(e){
        console.error(e);
      }
    }
    this.onLoop(this, tickCycle);
    system.run(()=>this.gameloop());
  }
}