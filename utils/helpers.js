import { FULL_CIRCLE } from './constants.js';

// generateMapGrid generates a two dimensional array of grid cells
// based on the provided dimensions and options
export function generateMapGrid(rows, columns, hasOuterWalls = true) {
    let grid = [...new Array(rows).fill(0)].map(() => [...new Array(columns).fill(0)]);

    if (hasOuterWalls) {
        grid = grid.map((row, index, arr) => {
            if (index === 0 || index === arr.length - 1) {
                return [...new Array(columns).fill(7)];
            }
            return row.map((column, index, arr) => {
                if (index === 0 || index === arr.length - 1) {
                    return 1;
                }
                return column;
            });
        });
    }

    return grid;
}

// calcAngleIncrement calculates a new angle value in radians after it's been incremented
export function calcAngleIncrement(angle, increment) {
    const incrementedAngle = angle + increment;

    if (incrementedAngle > 0) {
        return incrementedAngle % FULL_CIRCLE;
    }

    return (FULL_CIRCLE + incrementedAngle) % FULL_CIRCLE;
}

// adjustRayFishBowlEffect calculates the projected ray length by taking the adjacent side length instead of hypotenuses
export function adjustRayDistanceForFishBowlEffect(playerAngle, rayAngle, rayDistance) {
    const angle = calcAngleIncrement(rayAngle, -playerAngle);

    return Math.cos(angle) * rayDistance;
}
