import { system, Direction } from "@minecraft/server";
import { rail_direction } from "./rail_direction";
import { correctToRail, getNormalizedVector, getLerpVector, toBlockLocation, edge, direction_reverse, nextBlock, VectorAdd } from "./functions";
const PRIVARE_SYMBOL = Symbol('rail_mo_plus_private');
export class RailMoPlusEntity {
    /**
     * Create an instance for control and start control by RailMoPlus.
     * @param entity controlling entity
     * @param initRotate Entity rotation. (Equivalent to setting minecraft:minecart to runtime_identifier)
     */
    constructor(entity, initRotate = false /*, rotate: boolean*/) {
        this.isDestroyed = false;
        this.entity = entity;
        //this.rotate = rotate;
        if (!entity.getDynamicPropertyIds().includes('rail_mo_plus:speed')) {
            entity.setDynamicProperty('rail_mo_plus:speed', 0);
        }
        this.entity.setDynamicProperty('rail_mo_plus:reverse', false);
        if (initRotate) {
            entity.setRotation({ x: 0, y: 0 });
        }
        let current_time = new Date();
        this.setLastTickTime(PRIVARE_SYMBOL, current_time);
        system.run(() => this.gameloop());
    }
    /**
     * Set the speed.
     * @param speed Speed (km/h) to be set
     */
    setSpeed(speed) {
        this.entity.setDynamicProperty('rail_mo_plus:speed', speed);
        let reverse = this.entity.getDynamicProperty('rail_mo_plus:reverse');
        if (reverse != speed < 0)
            this.setEnterDirection(PRIVARE_SYMBOL, direction_reverse[this.getEnterDirection()]);
        this.entity.setDynamicProperty('rail_mo_plus:reverse', speed < 0);
    }
    getSpeed() {
        let speedDP = this.entity.getDynamicProperty('rail_mo_plus:speed');
        return typeof speedDP == 'number' ? speedDP : 0;
    }
    getEnterDirection() {
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
        if (symbol != PRIVARE_SYMBOL)
            throw Error('Use from outside the module is not allowed.');
        this.entity.setDynamicProperty('rail_mo_plus:enter_direction', direction);
    }
    getLastTickTime() {
        let dp = this.entity.getDynamicProperty('rail_mo_plus:last_tick_time');
        if (typeof dp != 'number')
            throw new Error('rail_mo_plus:last_tick_time is not a number.');
        return new Date(dp);
    }
    setLastTickTime(symbol, time) {
        if (symbol != PRIVARE_SYMBOL)
            throw Error('Use from outside the module is not allowed.');
        this.entity.setDynamicProperty('rail_mo_plus:last_tick_time', time.getTime());
    }
    getMileage() {
        let mileage_dp = this.entity.getDynamicProperty('rail_mo_plus:mileage');
        if (typeof mileage_dp != "number")
            throw new Error('rail_mo_plus:mileage is not a number.');
        return mileage_dp;
    }
    setMileage(mileage) {
        this.entity.setDynamicProperty('rail_mo_plus:mileage', mileage);
    }
    addMileage(distance) {
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
        this.entity.setDynamicProperty('rail_mo_plus:enter_direction', undefined);
        this.entity.setDynamicProperty('rail_mo_plus:vrotation_x', undefined);
        this.entity.setDynamicProperty('rail_mo_plus:vtotation_y', undefined);
        this.entity.setDynamicProperty('rail_mo_plus:speed', undefined);
    }
    gameloop() {
        if (!this.isValid())
            return;
        do {
            let entity = this.entity;
            let location = entity.location;
            let block_location = toBlockLocation(location);
            let current_block = entity.dimension.getBlock(block_location);
            if (typeof current_block == "undefined")
                break;
            let state = current_block.permutation.getState('rail_direction');
            if (typeof state != "number")
                break;
            let enter = this.getEnterDirection();
            let start = VectorAdd(block_location, edge[enter]);
            let end = VectorAdd(block_location, edge[rail_direction[state][enter].direction]);
            if (rail_direction[state][enter].ascending == Direction.Up)
                end = VectorAdd(end, { x: 0, y: 1, z: 0 });
            if (rail_direction[state][enter].ascending == Direction.Down)
                start = VectorAdd(start, { x: 0, y: 1, z: 0 });
            location = correctToRail(start, end, location);
            // km/h to m/ms
            const speed = this.getSpeed() / 3600;
            let last_time = this.getLastTickTime();
            let current_time = new Date();
            let time = current_time.getTime() - last_time.getTime();
            const distance = Math.abs(speed) * time;
            this.setLastTickTime(PRIVARE_SYMBOL, current_time);
            //Ignore gravity
            if (speed == 0) {
                entity.teleport(location);
                break;
            }
            let norm = getNormalizedVector(start, end, location);
            let target = distance + norm;
            while (true) {
                if (target >= 1) {
                    current_block = nextBlock(current_block, rail_direction[state][enter].direction, rail_direction[state][enter].ascending);
                    if (typeof current_block == "undefined")
                        break;
                    enter = direction_reverse[rail_direction[state][enter].direction];
                    block_location = current_block.location;
                    state = current_block.permutation.getState('rail_direction');
                    if (typeof state != "number")
                        break;
                    start = VectorAdd(block_location, edge[enter]);
                    end = VectorAdd(block_location, edge[rail_direction[state][enter].direction]);
                    target--;
                }
                else {
                    location = getLerpVector(start, end, target);
                    break;
                }
            }
            entity.teleport(location);
            this.setEnterDirection(PRIVARE_SYMBOL, enter);
            this.addMileage(distance);
        } while (false);
        system.run(() => this.gameloop());
    }
}
//# sourceMappingURL=rail_mo_plus.js.map