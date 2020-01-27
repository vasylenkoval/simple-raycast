import { MAP_INITIAL_GRID, MAP_TILE_SIZE, MAP_TILE_COLORS, MAP_DIMS } from './constants.js';

export default class Map {
    constructor() {
        this.grid = MAP_INITIAL_GRID;
        this.tileSize = MAP_TILE_SIZE;
        this.dims = MAP_DIMS;
        this.editMode = false;
    }

    checkCollisions(x, y) {
        const isXEven = x % this.tileSize === 0;
        const isYEven = y % this.tileSize === 0;
        const maxRows = this.dims.rows;
        const maxColumns = this.dims.columns;

        let currentRow = Math.floor(x / this.tileSize);
        let currentColumn = Math.floor(y / this.tileSize);

        console.log('ROW', currentRow);
        console.log('COL', currentColumn);

        // Returning early if one of the rows/columns is already out of boundaries
        if (
            currentRow >= maxRows ||
            currentColumn >= maxColumns ||
            currentRow < 0 ||
            currentColumn < 0
        ) {
            return true;
        }

        if (this.grid[currentColumn][currentRow] === 1) {
            return true;
        }

        // If we haven't detected a collision yet, but either x or y coordinate was
        // right on the tile edge, let's check if that edge belongs to a non empty tile.
        // This can happen only if player is looking up, hence only checking one tile above.

        if (isYEven && currentColumn - 1 >= 0 && this.grid[currentColumn - 1][currentRow] === 1) {
            return true;
        }

        if (isXEven && currentRow - 1 >= 0 && this.grid[currentColumn][currentRow - 1] === 1) {
            return true;
        }

        return false;
    }

    onKeyPress(keyCode) {
        const onKeyPressActionsMap = {
            [CONTROL]: () => (this.editMode = !this.editMode),
        };

        if (onKeyPressActionsMap[keyCode]) {
            onKeyPressActionsMap[keyCode]();
        }
    }

    onMousePress() {
        if (!this.editMode) {
            return false;
        }

        const selectedRow = Math.floor(mouseX / this.tileSize);
        const selectedColumn = Math.floor(mouseY / this.tileSize);
        const currentValue = this.grid[selectedColumn][selectedRow];

        this.grid[selectedColumn][selectedRow] = currentValue === 0 ? 1 : 0;

        // returning false to prevent browser's default behaviour
        return false;
    }

    render() {
        this.grid.forEach((row = [], rowNum) =>
            row.forEach((tile, tileNum) => {
                const upperLeftX = tileNum * MAP_TILE_SIZE;
                const upperLeftY = rowNum * MAP_TILE_SIZE;
                const tileColor = tile ? MAP_TILE_COLORS.tile : MAP_TILE_COLORS.noTile;

                fill(tileColor);
                rect(upperLeftX, upperLeftY, MAP_TILE_SIZE, MAP_TILE_SIZE);
            })
        );
    }
}
