import { MAP_TILE_COLORS } from './constants.js';
import { generateMapGrid } from '../utils/helpers.js';

export default class Map {
    constructor({ gridRows = 20, gridColumns = 20, tileSize = 25 }) {
        this.grid = generateMapGrid(gridRows, gridColumns);
        this.dims = { rows: gridRows, columns: gridColumns };
        this.tileSize = tileSize;
        this.isEditModeActive = false;
    }

    checkCollisions(x, y) {
        const isXEdge = x % this.tileSize === 0;
        const isYEdge = y % this.tileSize === 0;

        const maxRows = this.dims.rows;
        const maxColumns = this.dims.columns;

        let currentColumn = Math.floor(x / this.tileSize);
        let currentRow = Math.floor(y / this.tileSize);

        // Returning early if one of the rows/columns is already out of boundaries
        if (
            currentRow >= maxRows ||
            currentColumn >= maxColumns ||
            currentRow < 0 ||
            currentColumn < 0
        ) {
            return true;
        }

        if (this.grid[currentRow][currentColumn] === 1) {
            return true;
        }

        // If we haven't detected a collision yet, but either x or y coordinate was
        // right on the tile edge, let's check if that edge belongs to a non empty tile.
        // This can happen only if player is looking up, hence only checking one tile above.

        if (isYEdge && currentRow - 1 >= 0 && this.grid[currentRow - 1][currentColumn] === 1) {
            return true;
        }

        if (isXEdge && currentColumn - 1 >= 0 && this.grid[currentRow][currentColumn - 1] === 1) {
            return true;
        }

        return false;
    }

    onKeyPress(keyCode) {
        const onKeyPressActionsMap = {
            [CONTROL]: () => (this.isEditModeActive = !this.isEditModeActive),
        };

        if (onKeyPressActionsMap[keyCode]) {
            onKeyPressActionsMap[keyCode]();
        }
    }

    onMousePress() {
        if (!this.isEditModeActive) {
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
                const upperLeftX = tileNum * this.tileSize;
                const upperLeftY = rowNum * this.tileSize;
                const tileColor = tile ? MAP_TILE_COLORS.tile : MAP_TILE_COLORS.noTile;

                fill(tileColor);
                rect(upperLeftX, upperLeftY, this.tileSize, this.tileSize);
            })
        );
    }
}
