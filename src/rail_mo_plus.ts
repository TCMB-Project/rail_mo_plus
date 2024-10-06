import { Entity, Block, system, Vector2, Vector3, world } from "@minecraft/server"
import { rail_direction } from "./rail_direction"
import { correctToRail, getNormalizedVector, getLerpVector, toBlockLocation, direction, edge, direction_reverse, nextBlock } from "./functions";

const PRIVARE_SYMBOL = Symbol('rail_mo_plus_private');
const north_south = [0, 4, 5];
const east_west = [1, 2, 3];
const ascending = [2, 3, 4, 5];
const curve = [6, 7, 8, 9];

export class RailMoPlusEntity{
  constructor(entity: Entity/*, rotate: boolean*/){
    this.entity = entity;
    this.isDestroyed = false;
    //this.rotate = rotate;
    if(!entity.getDynamicPropertyIds().includes('rail_mo_plus:speed')){
      entity.setDynamicProperty('rail_mo_plus:speed', 0);
      //virtual rotation
      const location = this.entity.location;
      const current_block: Block | undefined = this.entity.dimension.getBlock({x: Math.floor(location.x), y: Math.floor(location.y), z: Math.floor(location.z)});
      if(typeof current_block == "undefined") return;
      let state = current_block.permutation.getState('rail_direction');
      if(typeof state != 'number') return;

      if(north_south.includes(state)){
        this.setVirtualRotation(PRIVARE_SYMBOL, rail_direction[state].rotate_north);
        this.setEnterDirection(PRIVARE_SYMBOL, "north");
      }else if(east_west.includes(state)){
        this.setVirtualRotation(PRIVARE_SYMBOL, rail_direction[state].rotate_east);
        this.setEnterDirection(PRIVARE_SYMBOL, "west");
      }
      //TODO 曲線レールの上にスポーンしても対応できるようにする
    }
    system.run(()=>this.gameloop());
  }
  entity: Entity;
  /**
   * Set the speed.
   * @param speed Speed (km/h) to be set
   */
  setSpeed(speed: number): void{
    this.entity.setDynamicProperty('rail_mo_plus:speed', speed);
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
  /**
   * Internal use only
   * Sets the virtual rotation of the entity.
   * @param symbol Symbol stored in PRIVATE_SYMBOL
   * @param rotation The x and y virtual rotation of the entity (in degrees).
   */
  setVirtualRotation(symbol: symbol, rotation: Vector2): void{
    if(symbol != PRIVARE_SYMBOL) throw Error('Use from outside the module is not allowed.');
    this.entity.setDynamicProperty('rail_mo_plus:vrotation_x', rotation.x);
    this.entity.setDynamicProperty('rail_mo_plus:vtotation_y', rotation.y);
  }
  getEnterDirection(): string{
    let direction_dp = this.entity.getDynamicProperty('rail_mo_plus:enter_direction');
    if(typeof direction_dp != "string") throw Error('rail_mo_plus:enter_direction is not string');
    return direction_dp;
  }
  setEnterDirection(symbol: symbol, direction: string): void{
    if(symbol != PRIVARE_SYMBOL) throw Error('Use from outside the module is not allowed.');
    this.entity.setDynamicProperty('rail_mo_plus:enter_direction', direction);
  }
  isValid(): boolean{
    return this.entity.isValid() && !this.isDestroyed;
  }
  destroy(): void{
    this.isDestroyed = true;
    this.entity.setDynamicProperty('rail_mo_plus:enter_direction', undefined);
    this.entity.setDynamicProperty('rail_mo_plus:vrotation_x', undefined);
    this.entity.setDynamicProperty('rail_mo_plus:vtotation_y', undefined);
    this.entity.setDynamicProperty('rail_mo_plus:speed', undefined);
  }
  private isDestroyed: boolean

  private gameloop(): void{
    if(!this.isValid()) return;
    do{
      const entity = this.entity;
      let location: Vector3 = entity.location;
      const blockLocation = toBlockLocation(location);
      let rotation: Vector2 = this.getVirtualRotation();
      let current_block: Block | undefined = entity.dimension.getBlock(blockLocation);
      if(typeof current_block == "undefined") break;
      let state = current_block.permutation.getState('rail_direction');
      if(typeof state != 'number') break;
      let enter_direction = this.getEnterDirection();

      let enter_edge: Vector3 = edge[direction_reverse[enter_direction]];
      let start: Vector3 = { x: blockLocation.x + enter_edge.x, y: blockLocation.y + enter_edge.y, z: blockLocation.z + enter_edge.z };
      let end_edge: Vector3 = rail_direction[state][enter_direction];
      let end: Vector3 = { x: blockLocation.x + end_edge.x, y: blockLocation.y + end_edge.y, z: blockLocation.z + end_edge.z };

      location = correctToRail(start, end, location);
      const norm = getNormalizedVector(start, end, location);

      /*  
        km/h to m/tick
        https://github.com/HakoMC/minecart_speed_list/blob/main/minecart_speed.txt
      */
      const speed = this.getSpeed() / 72;
      if(speed == 0) break;

      let after_location: Vector3;

      let target = Math.abs(speed) + norm;
      while(true){
        if(target >= 1){
          rotation = { x: 0, y: rotation.y + rail_direction[state]['rotate_'+enter_direction].y }
          location = end;
          let next_block = nextBlock(entity.dimension, location, rotation);

          current_block = next_block.block;
          if(typeof current_block == "undefined") break;
          state = current_block.permutation.getState('rail_direction');
          if(typeof state != 'number') break;

          enter_edge = edge[direction_reverse[enter_direction]];
          start = { x: blockLocation.x + enter_edge.x, y: blockLocation.y + enter_edge.y, z: blockLocation.z + enter_edge.z };
          end_edge = rail_direction[state][enter_direction];
          end = { x: blockLocation.x + end_edge.x, y: blockLocation.y + end_edge.y, z: blockLocation.z + end_edge.z };

          enter_direction = (speed > 0)?direction[rotation.y.toString()]:direction_reverse[direction[rotation.y.toString()]];

          target--;
        }else{
          location = getLerpVector(start, end, target);
          rotation = getLerpVector({x: 0, y: rotation.y, z: 0}, {x: 0, y: rail_direction[state]['rotate_'+enter_direction].y, z: 0}, target);
          rotation = {x: rotation.x, y: rotation.y};
        }
      }
      entity.teleport(location);
      this.setEnterDirection(PRIVARE_SYMBOL, enter_direction);
      this.setVirtualRotation(PRIVARE_SYMBOL, rotation);
    }while(false);

    system.run(()=>this.gameloop());
  }
}