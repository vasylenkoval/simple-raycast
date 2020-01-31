import Map from '../game/map.js';
import Player from '../game/player.js';
import RayCaster from '../raycaster/raycaster.js';

// Canvas
const CANVAS_BACKGROUND_COLOR = 220;

// Map
const MAP_GRID_ROWS = 20;
const MAP_GRID_COLUMNS = 20;
const MAP_TILE_SIZE = 25;

// Initializing game objects
const gameMap = new Map({
    gridRows: MAP_GRID_ROWS,
    gridColumns: MAP_GRID_COLUMNS,
    tileSize: MAP_TILE_SIZE,
});
const { windowHeight, windowWidth } = gameMap.getWindowSize();

const player = new Player({
    onCheckCollisions: gameMap.checkCollisions,
    initialX: 45,
    initialY: 45,
});

const rayCaster = new RayCaster({
    gridDims: gameMap.dims,
    player,
    gameMap,
});

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(CANVAS_BACKGROUND_COLOR);
}

function mousePressed() {
    gameMap.onMousePress();
}

function keyPressed() {
    player.onKeyPress(keyCode);
    gameMap.onKeyPress(keyCode);

    // prevents browser's default behaviour
    return false;
}

function keyReleased() {
    player.onKeyRelease(keyCode);

    // prevents browser's default behaviour
    return false;
}

function draw() {
    gameMap.render();
    player.render();
    rayCaster.render();
}

// Since we're using es6 modules, we have to expose main p5 functions to global scope
// in order for p5 library to see it
window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;
window.keyReleased = keyReleased;
window.mousePressed = mousePressed;
