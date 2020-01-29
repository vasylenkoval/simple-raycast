// generateMapGrid generates a two dimensional array of grid cells
// based on the provided dimensions and options
export function generateMapGrid(rows, columns, hasOuterWalls = true) {
    let grid = [...new Array(rows).fill(0)].map(() => [...new Array(columns).fill(0)]);

    if (hasOuterWalls) {
        grid = grid.map((row, index, arr) => {
            if (index === 0 || index === arr.length - 1) {
                return [...new Array(GRID_SIZE.columns).fill(1)];
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
