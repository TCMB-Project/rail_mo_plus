import { Direction } from "@minecraft/server";
import { correctToRail, direction_reverse, edge, getLerpVector, getNormalizedVector, nextBlock, toBlockLocation, VectorAdd } from "./functions";
import { rail_direction } from "./rail_direction";
export function traceRail(location, dimension, distance, enter) {
    //get block location
    let block_location = toBlockLocation(location);
    let current_block = dimension.getBlock(block_location);
    if (typeof current_block == "undefined")
        return { location: location, enter: enter };
    let state = current_block.permutation.getState('rail_direction');
    if (typeof state != "number")
        return { location: location, enter: enter };
    //get start and end location
    let start = VectorAdd(block_location, edge[enter]);
    let end = VectorAdd(block_location, edge[rail_direction[state][enter].direction]);
    if (rail_direction[state][enter].ascending == Direction.Up)
        end = VectorAdd(end, { x: 0, y: 1, z: 0 });
    if (rail_direction[state][enter].ascending == Direction.Down)
        start = VectorAdd(start, { x: 0, y: 1, z: 0 });
    location = correctToRail(start, end, location);
    let norm = getNormalizedVector(start, end, location);
    let target = distance + norm;
    //trace rail
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
            return { location: location, enter: enter };
        }
    }
}
//# sourceMappingURL=traceRail.js.map