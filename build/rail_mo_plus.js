import { system } from "@minecraft/server";
const north_south = [1, 4, 5];
const east_west = [1, 2, 3];
const ascending = [2, 3, 4, 5];
/**
 * controlling entity
 */
let entities = new Map();
export class RailMoPlusEntity {
    constructor(entity /*, rotate: boolean*/) {
        this.entity = entity;
        //this.rotate = rotate;
        if (!entity.getDynamicPropertyIds().includes('rail_mo_plus:speed')) {
            entity.setDynamicProperty('rail_mo_plus:speed', 0);
            //virtual rotation
            entity.setDynamicProperty('rail_mo_plus:vrotation_x', entity.getRotation().x);
            entity.setDynamicProperty('rail_mo_plus:vrotation_y', entity.getRotation().y);
        }
        entities.set(entity.id, this);
    }
    setSpeed(speed) {
        this.entity.setDynamicProperty('rail_mo_plus:speed', speed);
        entities.set(this.entity.id, this);
    }
    getSpeed() {
        let speedDP = this.entity.getDynamicProperty('rail_mo_plus:speed');
        return typeof speedDP == 'number' ? speedDP : 0;
    }
    getVirtualRotation() {
        let vrotation_x_dp = this.entity.getDynamicProperty('rail_mo_plus:vrotation_x');
        let vrotation_y_dp = this.entity.getDynamicProperty('rail_mo_plus:vrotation_y');
        let vrotation_x = typeof vrotation_x_dp == "number" ? vrotation_x_dp : 0;
        let vrotation_y = typeof vrotation_y_dp == "number" ? vrotation_y_dp : 0;
        return { x: vrotation_x, y: vrotation_y };
    }
    isValid() {
        return entities.has(this.entity.id) && this.entity.isValid();
    }
    destroy() {
        entities.delete(this.entity.id);
    }
}
function gameloop() {
    for (const [_, car] of entities) {
        const entity = car.entity;
        const location = car.entity.location;
        const current_block = car.entity.dimension.getBlock({ x: Math.floor(location.x), y: Math.floor(location.y), z: Math.floor(location.z) });
        let state = current_block.permutation.getState('rail_direction');
        state = typeof state == 'number' ? state : 0;
        let after_location = { x: 0, y: 0, z: 0 };
        //Position correction
        if (north_south.includes(state)) {
            after_location.x = Math.floor(location.x) + 0.5;
        }
        if (east_west.includes(state)) {
            after_location.y = Math.floor(location.z) + 0.5;
        }
        if (ascending.includes(state)) {
            switch (state) {
                case 2:
                    {
                    }
                    break;
                case 3:
                    {
                    }
                    break;
                case 4:
                    {
                    }
                    break;
                case 5:
                    {
                    }
                    break;
            }
        }
    }
    system.run(gameloop);
}
system.run(gameloop);
//# sourceMappingURL=rail_mo_plus.js.map