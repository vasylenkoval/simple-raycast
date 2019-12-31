// map
export const MAP_INITIAL_GRID = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const MAP_TILE_SIZE = 32;

export const MAP_DIMS = { rows: MAP_INITIAL_GRID.length, columns: MAP_INITIAL_GRID[0].length };

export const MAP_TILE_COLORS = {
    tile: '#fff',
    noTile: '#222',
};

// player
export const PLAYER_INITIAL_POSITION = {
    x: (MAP_DIMS.columns * MAP_TILE_SIZE) / 2,
    y: (MAP_DIMS.rows * MAP_TILE_SIZE) / 2,
};

export const PLAYER_DEFAULT_RADIUS = 15;

export const PLAYER_TURN_DIRECTION = {
    still: 0,
    left: -1,
    right: 1,
};

export const PLAYER_WALK_DIRECTION = {
    still: 0,
    forward: 1,
    back: -1,
};

export const PLAYER_DEFAULT_ROTATION_ANGLE = 1.5 * Math.PI;

export const PLAYER_DEFAULT_MOVE_INCREMENT = 3;

export const PLAYER_DEFAULT_ROTATION_INCREMENT = 1 * (Math.PI / 180);

export const PLAYER_LINE_LENGTH = 80;

export const PLAYER_COLOR = 'red';

export const DEFAULT_STROKE_COLOR = 'black';
