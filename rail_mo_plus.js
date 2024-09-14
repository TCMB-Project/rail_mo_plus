const PRIVATE_CONSTRUCTOR_SYMBOL = Symbol('private');
/**
 * controlling entity
 */
let entities = new Map();
export class RailMoPlusEntity {
    constructor(entity) {
        this.entity = entity;
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
//# sourceMappingURL=rail_mo_plus.js.map