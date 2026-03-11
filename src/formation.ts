import { AccelerationUnit } from "./define";
import { RailMoPlusEntity, SpeedUnit } from "./rail_mo_plus";

export class Formation{
  entities: RailMoPlusEntity[];
  constructor(entities: RailMoPlusEntity[]){
    if(entities.length < 1)
      throw new Error('Formation must have at least one entity.');
    this.entities = entities;
  }
  /**
   * Set the speed of the entities.
   * @param speed Speed (km/h) to be set
   * @param unit The unit of the speed value (default is KM_PER_HOUR)
   */
  setSpeed(speed: number, unit: SpeedUnit = SpeedUnit.KM_PER_HOUR){
    this.entities.forEach((entity)=>{
      entity.setSpeed(speed, unit);
    });
  }
  /**
   *  Get the current speed of the entities.
   * @param speed The unit of the returned speed value (default is KM_PER_HOUR) 
   * @returns The speed in the specified unit.
   */
  getSpeed(unit: SpeedUnit = SpeedUnit.KM_PER_HOUR): number{
    return this.entities[0].getSpeed(unit);
  }
  /**
   * Set the acceleration of the entities.
   * @param acceleration 
   * @param unit 
   */
  setAcceleration(acceleration: number, unit: AccelerationUnit = AccelerationUnit.KM_PER_HOUR_PER_SECOND){
    this.entities.forEach((entity)=>{
      entity.setAcceleration(acceleration, unit);
    });
  }
  /**
   * Get the current acceleration of the entities.
   * @param SpeedUnit The unit of the returned speed value (default is KM_PER_HOUR) 
   * @returns The speed in the specified unit.
   */
  getAcceleration(unit: AccelerationUnit = AccelerationUnit.KM_PER_HOUR_PER_SECOND){
    return this.entities[0].getAcceleration(unit);
  }
  /** 
   * Connect entities to the formation.
   * @param Entities The entities to connect, either as an array of `RailMoPlusEntity` or as another `Formation`.
   * @throws {Error} If any of the entities to connect are already connected, invalid, or using the old connection method (`RailMoPlus.connect()`).
   * @remarks This method will add the specified entities to the formation. It checks for duplicate connections, validity of entities, and ensures that none of the entities are using the old connection method before connecting them.
   * If any of these conditions are violated, an error will be thrown with a descriptive message.
   */
  connect(formation: Formation | RailMoPlusEntity[]){
    let entities: RailMoPlusEntity[] = [];
    if(formation instanceof Formation){
      entities = formation.entities;
    }else{
      entities = formation;
    }

    entities.forEach((entity)=>{
      //すでに連結されているエンティティはないか
      if(this.entities.includes(entity))
        throw new Error('The entity to connect is already connected.');

      //無効なエンティティはないか
      if(!entity.isValid())
        throw new Error('The entity to connect is invalid.');

      //旧連結機能を使用しているエンティティはないか
      if(entity.connected.length > 0)
        throw new Error('The entity to connect is using an old connection method (`RailMoPlus.connect()`).');
    });

    this.entities.push.apply(entities);
  }
  /**
   * Uncouple entities from the formation starting from the specified offset.
   * @param offset The position (1-based index) from which to start uncoupling entities. Must be between 1 and the number of entities in the formation.
   * @returns A new `Formation` containing the uncoupled entities.
   * @throws {Error} If the offset is invalid (less than 1 or greater than the number of entities in the formation).
   * @remarks This method will remove entities from the formation starting from the specified offset and return them as a new `Formation`. The original formation will be modified to exclude the uncoupled entities. If the offset is out of range, an error will be thrown with a descriptive message.
   */
  uncouple(offset: number): Formation{
    if (offset <= 0 || offset > this.entities.length)
      throw new Error(`Invalid offset: ${offset}. Must be between 1 and ${this.entities.length}.`);

    const uncoupled = this.entities.splice(offset - 1);

    return new Formation(uncoupled);
  }
}