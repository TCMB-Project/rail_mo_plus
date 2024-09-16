import { system } from "@minecraft/server";
const rail_direction = [
    //rail_direction=0 north_south
    {
        north: { x: 0, y: 0, z: -1 },
        south: { x: 0, y: 0, z: 1 },
        east: { x: 0, y: 0, z: 1 },
        west: { x: 0, y: 0, z: 1 },
        rotate_north: { x: 0, y: 0 },
        rotate_south: { x: 0, y: 0 },
        rotate_east: { x: 0, y: 90 },
        rotate_west: { x: 0, y: -90 }
    },
    //rail_direction=1 east_west
    {
        north: { x: 1, y: 0, z: 0 },
        south: { x: 1, y: 0, z: 0 },
        east: { x: 1, y: 0, z: 1 },
        west: { x: -1, y: 0, z: 1 },
        rotate_north: { x: 0, y: -90 },
        rotate_south: { x: 0, y: 90 },
        rotate_east: { x: 0, y: 0 },
        rotate_west: { x: 0, y: 0 }
    },
    //rail_direction=2 ascending_east
    {
        north: { x: -1, y: 0, z: 0 },
        south: { x: -1, y: 0, z: 0 },
        east: { x: 1, y: 1, z: 0 },
        west: { x: -1, y: -1, z: 0 },
        rotate_north: { x: 0, y: -90 },
        rotate_south: { x: 0, y: 90 },
        rotate_east: { x: 0, y: 0 },
        rotate_west: { x: 0, y: 0 }
    },
    //rail_direction=3 ascending_west
    {
        north: { x: -1, y: 0, z: 0 },
        south: { x: -1, y: 0, z: 0 },
        east: { x: -1, y: -1, z: 0 },
        west: { x: 1, y: 1, z: 0 },
        rotate_north: { x: 0, y: -90 },
        rotate_south: { x: 0, y: 90 },
        rotate_east: { x: 0, y: -90 },
        rotate_west: { x: 0, y: 90 }
    },
    //rail_direction=4 ascending_north
    {
        north: { x: 0, y: 1, z: -1 },
        south: { x: 0, y: -1, z: 1 },
        east: { x: 0, y: 0, z: 1 },
        west: { x: 0, y: 0, z: 1 },
        rotate_north: { x: 0, y: 0 },
        rotate_south: { x: 0, y: 0 },
        rotate_east: { x: 0, y: 90 },
        rotate_west: { x: 0, y: -90 }
    },
    //rail_direction=5 ascending_south
    {
        north: { x: 0, y: -1, z: -1 },
        south: { x: 0, y: 1, z: 1 },
        east: { x: 0, y: 0, z: -1 },
        west: { x: 0, y: 0, z: -1 },
        rotate_north: { x: 0, y: 0 },
        rotate_south: { x: 0, y: 0 },
        rotate_east: { x: 0, y: -90 },
        rotate_west: { x: 0, y: 90 }
    },
    //rail_direction=6 south_east
    {
        north: { x: 0.5, y: 0, z: -0.5 },
        south: { x: 0, y: 0, z: 1 },
        east: { x: 1, y: 0, z: 0 },
        west: { x: -0.5, y: 0, z: 0.5 }
    },
    //rail_direction=7 south_west
    {
        north: { x: -0.5, y: 0, z: 0.5 },
        south: { x: 0, y: 0, z: 1 },
        east: { x: 0.5, y: 0, z: 0.5 },
        west: { x: -1, y: 0, z: 0 }
    },
    //rail_direction=8 north_west
    {
        north: { x: 0, y: 0, z: -1 },
        south: { x: -0.5, y: 0, z: 0.5 },
        east: { x: 0.5, y: 0, z: -0.5 },
        west: { x: -1, y: 0, z: 0 }
    },
    //rail_direction=9 north_east
    {
        north: { x: 0, y: 0, z: -1 },
        south: { x: 0.5, y: 0, z: 0.5 },
        east: { x: 1, y: 0, z: 0 },
        west: { x: -0.5, y: 0, z: -0.5 }
    }
];
/**
 * controlling entity
 */
let entities = new Map();
export class RailMoPlusEntity {
    constructor(entity /*, rotate: boolean*/) {
        this.entity = entity;
        //this.rotate = rotate;
        this.speed = 0;
        if (entity.getDynamicPropertyIds().includes('rail_mo_plus:speed')) {
            let speedDP = entity.getDynamicProperty('rail_mo_plus:speed');
            this.speed = typeof speedDP == 'number' ? speedDP : 0;
        }
        entities.set(entity.id, this);
    }
    setSpeed(speed) {
        this.speed = speed;
        this.entity.setDynamicProperty('rail_mo_plus:speed', this.speed);
        entities.set(this.entity.id, this);
    }
    getSpeed() {
        let speedDP = this.entity.getDynamicProperty('rail_mo_plus:speed');
        return typeof speedDP == 'number' ? speedDP : 0;
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
        const location = car.entity.location;
    }
    system.run(gameloop);
}
system.run(gameloop);
//# sourceMappingURL=rail_mo_plus.js.map