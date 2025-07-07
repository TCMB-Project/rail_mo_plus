export class VirtualEntity {
    constructor(location, rotation, dimension) {
        this.dynamicProperties = new Map();
        this.location = location;
        this.rotation = rotation;
        this.dimension = dimension;
        this.id = genId();
    }
    getRotation() {
        return this.rotation;
    }
    setRotation(rotation) {
        this.rotation = rotation;
    }
    getDynamicProperty(property) {
        return this.dynamicProperties.get(property);
    }
    getDynamicPropertyIds() {
        return Array.from(this.dynamicProperties.keys());
    }
    setDynamicProperty(property, value) {
        if (value === undefined) {
            this.dynamicProperties.delete(property);
        }
        else {
            this.dynamicProperties.set(property, value);
        }
    }
    teleport(location) {
        this.location = location;
    }
    isValid() {
        return true;
    }
}
function genId() {
    let id = "RailMoPlusVirtual_";
    for (let i = 0; i < 10; i++) {
        id += randomInt(0, 9);
    }
    return id;
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//# sourceMappingURL=util.js.map