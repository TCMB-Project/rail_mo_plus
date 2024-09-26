import { Entity, Block, system, Vector2, Vector3, world } from "@minecraft/server"
import { rail_direction } from "./rail_direction"

const PRIVARE_SYMBOL = Symbol('rail_mo_plus_private');
const north_south = [1, 4, 5];
const east_west = [1, 2, 3];
const ascending = [2, 3, 4, 5];
const curve = [6, 7, 8, 9];
const direction = {
  "-180": "north",
  "0": "south",
  "90": "west",
  "-90": "east"
}
const edge = {
  "north": <Vector3>{x: 0.5, y: 0, z: 0},
  "south": <Vector3>{x: 0.5, y: 0, z: 1},
  "west": <Vector3>{x: -1, y: 0, z: 0.5},
  "east": <Vector3>{x: 0, y: 0, z: 0.5}
}

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
      const location = this.entity.location;
      const current_block: Block | undefined = this.entity.dimension.getBlock({x: Math.floor(location.x), y: Math.floor(location.y), z: Math.floor(location.z)});
      if(typeof current_block == "undefined") return;
      let state = current_block.permutation.getState('rail_direction');
      if(typeof state != 'number') return;

      if(north_south.includes(state)){
        this.setVirtualRotation(PRIVARE_SYMBOL, rail_direction[state].rotate_north);
      }else if(east_west.includes(state)){
        this.setVirtualRotation(PRIVARE_SYMBOL, rail_direction[state].rotate_east);
      }
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
  isValid(): boolean{
    return entities.has(this.entity.id) && this.entity.isValid();
  }
  destroy(): void{
    entities.delete(this.entity.id);
  }
}

/**
 * Function to return a normalized value
 * @param {Vector3} start - Starting coordinates
 * @param {Vector3} end - Ending coordinates
 * @param {Vector3} location - Current location
 * @returns {number} - Normalized value
 */
function getNormalizedVector(start: Vector3, end: Vector3, location: Vector3): number {
    // Calculate the difference vector
    const vectorDiff = {
        x: end.x - start.x,
        y: end.y - start.y,
        z: end.z - start.z
    };

    // Calculate the difference from the start to the current location
    const locationDiff = {
        x: location.x - start.x,
        y: location.y - start.y,
        z: location.z - start.z
    };

    // Calculate the length of the vectors
    const vectorLength = Math.sqrt(vectorDiff.x ** 2 + vectorDiff.y ** 2 + vectorDiff.z ** 2);
    const locationLength = Math.sqrt(locationDiff.x ** 2 + locationDiff.y ** 2 + locationDiff.z ** 2);

    // Calculate the normalized value
    const normalizedValue = locationLength / vectorLength;

    return normalizedValue;
}

/**
 * Function to correct the position to the nearest point on the line segment (start, end)
 * Uses getNormalizeVector to calculate the normalized value t
 * @param start - The starting point of the line
 * @param end - The ending point of the line
 * @param location - The current position
 * @returns The corrected position (the closest point on the line segment)
 */
function correctToRail(start: Vector3, end: Vector3, location: Vector3): Vector3 {
    // Use the getNormalizeVector function to calculate the normalized value t
    const t = getNormalizedVector(start, end, location);

    // Clamp the value of t to ensure it is within the range 0 <= t <= 1, keeping the point within the line segment
    const clampedT = Math.max(0, Math.min(1, t));

    // Calculate the projected (corrected) position
    const correctedPosition = {
        x: start.x + clampedT * (end.x - start.x),
        y: start.y + clampedT * (end.y - start.y),
        z: start.z + clampedT * (end.z - start.z)
    };

    return correctedPosition;
}

function toBlockLocation(location: Vector3){
  return {x: Math.floor(location.x), y: Math.floor(location.y), z: Math.floor(location.z)};
}

function gameloop(){
  for(const [_, car] of entities){
    const entity = car.entity;
    const location: Vector3 = entity.location;
    const blockLocation = toBlockLocation(location);
    const rotation: Vector2 = car.getVirtualRotation();
    const current_block: Block | undefined = entity.dimension.getBlock(blockLocation);
    if(typeof current_block == "undefined") continue;
    let state = current_block.permutation.getState('rail_direction');
    if(typeof state != 'number') continue;

    let after_location: Vector3;

  }
  system.run(gameloop);
}
system.run(gameloop);