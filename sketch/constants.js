import { MAP_TILE_SIZE, MAP_DIMS } from '../game/constants.js';

export const CANVAS_DIMS = {
    height: MAP_DIMS.rows * MAP_TILE_SIZE,
    width: MAP_DIMS.columns * MAP_TILE_SIZE,
};

export const CANVAS_BACKGROUND_COLOR = 220;
