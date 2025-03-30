import { system } from "@minecraft/server";
import { rail_direction } from "./rail_direction";
import { toBlockLocation, direction_reverse } from "./functions";
import { traceRail } from "./traceRail";
const PRIVARE_SYMBOL = Symbol('rail_mo_plus_private');
export class RailMoPlusEntity {
    /**
     * Create an instance for control and start control by RailMoPlus.
     * @param entity controlling entity
     * @param initRotate Rotate the entity. (Equivalent to setting runtime_identifier to minecraft:minecart)
     */
    constructor(entity, initRotate = false /*, rotate: boolean*/) {
        this.connected = [];
        this.control = true;
        this.onLoop = function (_) { };
        this.isDestroyed = false;
        if (RailMoPlusEntity.instances.has(entity.id)) {
            return RailMoPlusEntity.instances.get(entity.id);
        }
        this.entity = entity;
        //this.rotate = rotate;
        if (!entity.getDynamicPropertyIds().includes('rail_mo_plus:speed')) {
            entity.setDynamicProperty('rail_mo_plus:speed', 0);
            this.setMileage(0);
            this.entity.setDynamicProperty('rail_mo_plus:reverse', false);
        }
        if (initRotate) {
            entity.setRotation({ x: 0, y: 0 });
        }
        let current_time = new Date();
        this.lastTickTime = current_time;
        RailMoPlusEntity.instances.set(entity.id, this);
        system.run(() => this.gameloop());
    }
    connect(entity) {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        this.connected.concat(entity);
    }
    uncouple(offset) {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        let uncoupled = this.connected.splice(offset - 1);
        let uncoupled_front = uncoupled.shift();
        uncoupled_front.connect.apply(uncoupled);
        return uncoupled_front;
    }
    /**
     * Set the speed.
     * @param speed Speed (km/h) to be set
     */
    setSpeed(speed) {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        this.entity.setDynamicProperty('rail_mo_plus:speed', speed);
        let reverse = this.entity.getDynamicProperty('rail_mo_plus:reverse');
        if (reverse != speed < 0)
            this.setEnterDirection(PRIVARE_SYMBOL, direction_reverse[this.getEnterDirection()]);
        this.entity.setDynamicProperty('rail_mo_plus:reverse', speed < 0);
        for (let entity of this.connected) {
            entity.setSpeed(speed);
        }
    }
    getSpeed() {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        let speedDP = this.entity.getDynamicProperty('rail_mo_plus:speed');
        return typeof speedDP == 'number' ? speedDP : 0;
    }
    getEnterDirection() {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        let direction_dp = this.entity.getDynamicProperty('rail_mo_plus:enter_direction');
        if (typeof direction_dp != "string") {
            let block_location = toBlockLocation(this.entity.location);
            let current_block = this.entity.dimension.getBlock(block_location);
            let state = current_block.permutation.getState('rail_direction');
            if (typeof state != "number")
                throw new Error("Unable to resolve Enter direction.");
            direction_dp = rail_direction[state].default_enter;
            this.entity.setDynamicProperty('rail_mo_plus:enter_direction', direction_dp);
        }
        return direction_dp;
    }
    setEnterDirection(symbol, direction) {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        if (symbol != PRIVARE_SYMBOL)
            throw Error('Use from outside the module is not allowed.');
        this.entity.setDynamicProperty('rail_mo_plus:enter_direction', direction);
    }
    getMileage() {
        if (!this.isValid()) {
            throw new Error('The entity is invalid.');
        }
        let mileage_dp = this.entity.getDynamicProperty('rail_mo_plus:mileage');
        if (typeof mileage_dp != "number")
            throw new Error('rail_mo_plus:mileage is not a number.');
        return mileage_dp;
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
        mileage += distance;
        this.setMileage(mileage);
        return mileage;
    }
    isValid() {
        return this.entity.isValid() && !this.isDestroyed;
    }
    destroy() {
        this.isDestroyed = true;
        RailMoPlusEntity.instances.delete(this.entity.id);
        if (this.entity.isValid()) {
            this.entity.setDynamicProperty('rail_mo_plus:enter_direction', undefined);
            this.entity.setDynamicProperty('rail_mo_plus:vrotation_x', undefined);
            this.entity.setDynamicProperty('rail_mo_plus:vtotation_y', undefined);
            this.entity.setDynamicProperty('rail_mo_plus:speed', undefined);
        }
    }
    gameloop() {
        if (this.isDestroyed) {
            return;
        }
        let last_time = this.lastTickTime;
        let current_time = new Date();
        let tickCycle = current_time.getTime() - last_time.getTime();
        let afterLocation = this.entity.location;
        if (this.control) {
            do {
                let entity = this.entity;
                if (!entity.isValid())
                    break;
                let location = entity.location;
                // km/h to m/ms
                const speed = this.getSpeed() / 3600;
                const distance = Math.abs(speed) * tickCycle;
                this.lastTickTime = current_time;
                //Ignore gravity
                if (speed == 0) {
                    entity.teleport(location);
                    break;
                }
                let traceResult = traceRail(location, entity.dimension, distance, this.getEnterDirection());
                entity.teleport(traceResult.location);
                this.setEnterDirection(PRIVARE_SYMBOL, traceResult.enter);
                this.addMileage(distance);
                afterLocation = traceResult.location;
            } while (false);
        }
        this.onLoop(this, tickCycle, afterLocation);
        system.run(() => this.gameloop());
    }
}
RailMoPlusEntity.instances = new Map();
//# sourceMappingURL=rail_mo_plus.js.map