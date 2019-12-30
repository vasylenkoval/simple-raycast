import { CANVAS_DIMS, CANVAS_BACKGROUND_COLOR } from './constants.js';
import Map from '../game/map.js';
import Player from '../game/player.js';

// initializing game objects
const gameMap = new Map();
const player = new Player();

function setup() {
    createCanvas(CANVAS_DIMS.width, CANVAS_DIMS.height);
    background(CANVAS_BACKGROUND_COLOR);
}

function update() {
    player.update();
}

function keyPressed() {
    player.onKeyPress(keyCode);

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
    update();
}
// since we're using es6 modules, we have to expose main p5 functions to global scope
// in order for p5 library to see it
window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;
window.keyReleased = keyReleased;
