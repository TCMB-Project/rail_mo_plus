import { system } from "@minecraft/server";
import { railDirection } from "./railDirection";
import { toBlockLocation, directionReverse } from "./functions";
import { traceRail } from "./traceRail";
export { updateSpeedDP } from "./functions";
export class RailMoPlusEntity {
    /**
     * Create an instance for control and start control by RailMoPlus.
     * @param entity controlling entity
     * @param initRotate Rotate the entity on initialisation. (Equivalent to setting runtime_identifier to minecraft:minecart)
     */
    constructor(entity, initRotate = false /*, rotate: boolean*/) {
        this.connected = [];
        /**
         * Determines whether the entity is controlled by RailMoPlus.
         * If set to `true`, RailMoPlus will manage the entity's behavior.
         */
        this.control = true;
        /**
         * Callback invoked on every game loop tick for this entity.
         *
         * @param entity - The RailMoPlusEntity instance.
         * @param tickCycle - The elapsed time in milliseconds since the last tick (1/TPS).
         */
        this.onLoop = function (_) { };
        /**
         * Callback invoked when an entity moves across a block.
         *
         * @param location - The current location of the entity within the dimension.
         * @param enter - The direction from which the entity entered the block.
         * @param residueDistance - 説明が難しい助けて ソースコード見ればわかるはず
         */
        this.onMoved = function (_) { };
        this.isDestroyed = false;
        if (RailMoPlusEntity.instances.has(entity.id)) {
            return RailMoPlusEntity.instances.get(entity.id);
        }
        this.entity = entity;
        //this.rotate = rotate;
        if (!entity.getDynamicPropertyIds().includes('rail_mo_plus:speed')) {
            entity.setDynamicProperty('rail_mo_plus:speed', 0);
            entity.setDynamicProperty('rail_mo_plus:acceleration', 0);
            this.setMileage(0);
            this.entity.setDynamicProperty('rail_mo_plus:reverse', false);
        }
        if (initRotate) {
            entity.setRotation({ x: 0, y: 0 });
        }
        this.lastTickTime = new Date();
        RailMoPlusEntity.instances.set(entity.id, this);
        system.run(() => this.gameloop());
    }
    /**
     * @deprecated Please use the `Formation` class.
     *
     * Connects an array of RailMoPlusEntity instances to this entity.
     *
     * This method appends the given entities to the `connected` array of the current instance.
     * Before connecting, it checks if the entity is valid. If the entity is invalid, an error is thrown.
     *
     * @param entity - Array of RailMoPlusEntity instances to connect.
     * @throws {Error} If the entity is invalid.
     */
    connect(entities) {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        //自分自身を連結しようとしてないか
        if (entities.includes(this))
            throw new Error('Cannot connect entity to itself.');
        let formationTemp;
        entities.forEach((entity) => {
            //すでに連結されてるエンティティはないか
            if (this.connected.includes(entity))
                throw new Error('This entity is already connected.');
            //無効なエンティティはないか
            if (!entity.isValid()) {
                throw new Error('The entity to connect is invalid.');
            }
            //編成の再構成
            if (entity.connected.length > 0) {
                formationTemp.push.apply(entity.getFormationArray());
                entity.uncouple(1);
            }
        });
        this.connected.push.apply(formationTemp);
    }
    /**
     * @deprecated Please use the `Formation` class.
     *
     * Uncouples the connected entities starting from the specified offset.
     *
     * This method removes entities from the `connected` array beginning at the given offset,
     * and returns the first uncoupled entity after reconnecting the remaining uncoupled entities.
     *
     * @param offset - The position in the `connected` array from which to start uncoupling (1-based index).
     * @returns The first entity that was uncoupled.
     * @throws {Error} If the entity is invalid.
     */
    uncouple(offset) {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        if (offset <= 0 || offset > this.connected.length) {
            throw new Error(`Invalid offset: ${offset}. Must be between 1 and ${this.connected.length}.`);
        }
        const uncoupled = this.connected.splice(offset - 1);
        const uncoupledFront = uncoupled.shift(); // We know it's not undefined due to the check above
        uncoupledFront.connect(uncoupled);
        return uncoupledFront;
    }
    /**
     * @deprecated Please use the `Formation` class.
     *
     * Returns an array containing this entity and all connected entities.
     *
     * @returns {RailMoPlusEntity[]} An array of `RailMoPlusEntity` objects representing the formation.
     */
    getFormationArray() {
        let formation = [this];
        formation.push.apply(this.connected);
        return formation;
    }
    /**
     * Set the speed of the entity.
     * @param speed Speed (km/h) to be set
     * @param unit The unit of the speed value (default is KM_PER_HOUR)
     */
    setSpeed(speed, unit = 0 /* SpeedUnit.KM_PER_HOUR */) {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        let converted = speed;
        //m/msに変換
        switch (unit) {
            case 0 /* SpeedUnit.KM_PER_HOUR */:
                converted /= 3600;
                break;
            case 1 /* SpeedUnit.M_PER_SECOND */:
                converted /= 1000;
                break;
            case 2 /* SpeedUnit.M_PER_MILLISECOND */:
                break;
        }
        this.entity.setDynamicProperty('rail_mo_plus:speed', converted);
        let reverse = this.entity.getDynamicProperty('rail_mo_plus:reverse');
        if (reverse != converted < 0)
            this.setEnterDirection(directionReverse[this.getEnterDirection()]);
        this.entity.setDynamicProperty('rail_mo_plus:reverse', converted < 0);
        this.norm = undefined;
        for (let entity of this.connected) {
            entity.setSpeed(converted, 2 /* SpeedUnit.M_PER_MILLISECOND */);
        }
    }
    /**
     * Get the current speed of the entity.
     * @param SpeedUnit The unit of the returned speed value (default is KM_PER_HOUR)
     * @returns The speed in the specified unit.
     */
    getSpeed(unit = 0 /* SpeedUnit.KM_PER_HOUR */) {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        let speed = this.entity.getDynamicProperty('rail_mo_plus:speed');
        //m/msからの変換
        switch (unit) {
            case 0 /* SpeedUnit.KM_PER_HOUR */:
                speed *= 3600;
                break;
            case 1 /* SpeedUnit.M_PER_SECOND */:
                speed *= 1000;
                break;
            case 2 /* SpeedUnit.M_PER_MILLISECOND */:
                break;
        }
        return speed;
    }
    /**
     * Set the acceleration of the entity.
     * @param acceleration
     * @param unit
     */
    setAcceleration(acceleration, unit = 0 /* AccelerationUnit.KM_PER_HOUR_PER_SECOND */) {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        let converted = acceleration;
        //m/ms^2に変換
        switch (unit) {
            case 0 /* AccelerationUnit.KM_PER_HOUR_PER_SECOND */:
                converted *= 5 / 18;
                break;
            case 1 /* AccelerationUnit.M_PER_SECOND_PER_SECOND */:
                converted /= 1000000;
                break;
            case 2 /* AccelerationUnit.M_PER_MILLISECOND_PER_MILLISECOND */:
                break;
        }
        this.entity.setDynamicProperty('rail_mo_plus:acceleration', converted);
        this.norm = undefined;
        for (let entity of this.connected) {
            entity.setAcceleration(converted, 2 /* AccelerationUnit.M_PER_MILLISECOND_PER_MILLISECOND */);
        }
    }
    /**
     * Get the current acceleration of the entity.
     * @param SpeedUnit The unit of the returned speed value (default is KM_PER_HOUR)
     * @returns The speed in the specified unit.
     */
    getAcceleration(unit = 0 /* AccelerationUnit.KM_PER_HOUR_PER_SECOND */) {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        let acceleration = this.entity.getDynamicProperty('rail_mo_plus:acceleration');
        //m/ms^2からの変換
        switch (unit) {
            case 0 /* AccelerationUnit.KM_PER_HOUR_PER_SECOND */:
                acceleration *= 18 / 5;
                break;
            case 1 /* AccelerationUnit.M_PER_SECOND_PER_SECOND */:
                acceleration *= 1000000;
                break;
            case 2 /* AccelerationUnit.M_PER_MILLISECOND_PER_MILLISECOND */:
                break;
        }
        return acceleration;
    }
    getEnterDirection() {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        let directionDP = this.entity.getDynamicProperty('rail_mo_plus:enter_direction');
        if (typeof directionDP != "string") {
            let blockLocation = toBlockLocation(this.entity.location);
            let currentBlock = this.entity.dimension.getBlock(blockLocation);
            let state = currentBlock.permutation.getState('rail_direction');
            if (typeof state != "number")
                throw new Error("Unable to resolve Enter direction.");
            directionDP = railDirection[state].default_enter;
            this.entity.setDynamicProperty('rail_mo_plus:enter_direction', directionDP);
        }
        return directionDP;
    }
    /**
     * Internal use only
     */
    setEnterDirection(direction) {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        this.entity.setDynamicProperty('rail_mo_plus:enter_direction', direction);
    }
    getMileage() {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        let mileageDP = this.entity.getDynamicProperty('rail_mo_plus:mileage');
        if (typeof mileageDP != "number")
            throw new Error('rail_mo_plus:mileage is not a number.');
        return mileageDP;
    }
    setMileage(mileage) {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        this.entity.setDynamicProperty('rail_mo_plus:mileage', mileage);
    }
    addMileage(distance) {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        let mileage = this.getMileage();
        mileage += Math.abs(distance);
        this.setMileage(mileage);
        return mileage;
    }
    isValid() {
        return this.entity.isValid && !this.isDestroyed;
    }
    destroy() {
        this.isDestroyed = true;
        RailMoPlusEntity.instances.delete(this.entity.id);
        if (this.entity.isValid) {
            this.entity.setDynamicProperty('rail_mo_plus:enter_direction', undefined);
            this.entity.setDynamicProperty('rail_mo_plus:speed', undefined);
        }
    }
    gameloop() {
        if (this.isDestroyed) {
            return;
        }
        let lastTime = this.lastTickTime;
        let currentTime = new Date();
        let tickCycle = currentTime.getTime() - lastTime.getTime();
        this.lastTickTime = currentTime;
        let speed = this.getSpeed(2 /* SpeedUnit.M_PER_MILLISECOND */);
        const acceleration = this.getAcceleration(2 /* AccelerationUnit.M_PER_MILLISECOND_PER_MILLISECOND */);
        // calculate how far we'll move this tick
        // normally: s = v*t + 0.5*a*t^2
        let distance = speed * tickCycle + 0.5 * acceleration * tickCycle * tickCycle;
        // integrate speed over the tick and clamp at zero if the sign reverses
        const newSpeed = speed + acceleration * tickCycle;
        if (speed !== 0 && newSpeed !== 0 && Math.sign(speed) !== Math.sign(newSpeed)) {
            // we've crossed through zero during this interval; stop at 0
            // adjust distance so we only travel until we stop (assuming constant acceleration)
            // Δv = -speed, so t_stop = -speed / acceleration
            const tStop = -speed / acceleration;
            distance = speed * tStop + 0.5 * acceleration * tStop * tStop;
            speed = 0;
        }
        else {
            speed = newSpeed;
        }
        this.setSpeed(speed, 2 /* SpeedUnit.M_PER_MILLISECOND */);
        if (this.control) {
            try {
                do {
                    let entity = this.entity;
                    if (!entity.isValid)
                        break;
                    let location = entity.location;
                    //Ignore gravity
                    if (speed == 0) {
                        entity.teleport(location);
                        break;
                    }
                    const dimensionLocation = {
                        dimension: entity.dimension,
                        x: location.x,
                        y: location.y,
                        z: location.z
                    };
                    let traceResult = traceRail(dimensionLocation, distance, this.getEnterDirection(), {
                        norm: this.norm,
                        onMoved: this.onMoved
                    });
                    entity.teleport(traceResult.location);
                    this.setEnterDirection(traceResult.enter);
                    this.addMileage(distance);
                    this.norm = traceResult.norm || undefined;
                } while (false);
            }
            catch (e) {
                console.error(e);
            }
        }
        this.onLoop(this, tickCycle);
        system.run(() => this.gameloop());
    }
}
RailMoPlusEntity.instances = new Map();
//# sourceMappingURL=rail_mo_plus.js.map