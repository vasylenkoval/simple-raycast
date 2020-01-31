import { generateMapGrid } from '../utils/helpers.js';

const DEFAULT_MAP_GRID_ROWS = 20;
const DEFAULT_MAP_GRID_COLUMNS = 20;
const DEFAULT_MAP_TILE_SIZE = 25;
export const DEFAULT_MAP_TILE_COLORS = {
    tile: '#fff',
    noTile: '#222',
};

export default class Map {
    constructor(args = {}) {
        const {
            gridRows = DEFAULT_MAP_GRID_ROWS,
            gridColumns = DEFAULT_MAP_GRID_COLUMNS,
            tileSize = DEFAULT_MAP_TILE_SIZE,
            tileColors = DEFAULT_MAP_TILE_COLORS,
        } = args;

        this.grid = generateMapGrid(gridRows, gridColumns);
        this.dims = { rows: gridRows, columns: gridColumns, tileSize: tileSize };
        this.tileColors = tileColors;

        this.isEditModeActive = false;
    }

    checkCollisions = (x, y) => {
        const isXEdge = x % this.dims.tileSize === 0;
        const isYEdge = y % this.dims.tileSize === 0;

        const maxRows = this.dims.rows;
        const maxColumns = this.dims.columns;

        let currentColumn = Math.floor(x / this.dims.tileSize);
        let currentRow = Math.floor(y / this.dims.tileSize);

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
    };

    onKeyPress = keyCode => {
        const onKeyPressActionsMap = {
            [CONTROL]: () => (this.isEditModeActive = !this.isEditModeActive),
        };

        if (onKeyPressActionsMap[keyCode]) {
            onKeyPressActionsMap[keyCode]();
        }
    };

    onMousePress = () => {
        if (!this.isEditModeActive) {
            return false;
        }

        const selectedRow = Math.floor(mouseX / this.dims.tileSize);
        const selectedColumn = Math.floor(mouseY / this.dims.tileSize);
        const currentValue = this.grid[selectedColumn][selectedRow];

        this.grid[selectedColumn][selectedRow] = currentValue === 0 ? 1 : 0;

        // returning false to prevent browser's default behaviour
        return false;
    };

    getWindowSize = () => ({
        windowWidth: this.dims.columns * this.dims.tileSize,
        windowHeight: this.dims.rows * this.dims.tileSize,
    });

    render() {
        this.grid.forEach((row = [], rowNum) =>
            row.forEach((tile, tileNum) => {
                const upperLeftX = tileNum * this.dims.tileSize;
                const upperLeftY = rowNum * this.dims.tileSize;

                const tileColor = tile ? this.tileColors.tile : this.tileColors.noTile;

                fill(tileColor);
                rect(upperLeftX, upperLeftY, this.dims.tileSize, this.dims.tileSize);
            })
        );
    }
}
