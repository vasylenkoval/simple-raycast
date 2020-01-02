import { MAP_INITIAL_GRID, MAP_TILE_SIZE, MAP_TILE_COLORS, MAP_DIMS } from './constants.js';

export default class Map {
    constructor() {
        this.grid = MAP_INITIAL_GRID;
        this.tileSize = MAP_TILE_SIZE;
        this.dims = MAP_DIMS;
        this.editMode = false;
    }

    checkCollisions(x, y) {
        const currentRow = Math.floor(x / this.tileSize);
        const currentColumn = Math.floor(y / this.tileSize);
        return this.grid[currentColumn][currentRow] !== 0;
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
