import {
    PLAYER_INITIAL_POSITION,
    PLAYER_DEFAULT_RADIUS,
    PLAYER_TURN_DIRECTION,
    PLAYER_WALK_DIRECTION,
    PLAYER_DEFAULT_ROTATION_ANGLE,
    PLAYER_DEFAULT_MOVE_INCREMENT,
    PLAYER_DEFAULT_ROTATION_INCREMENT,
    PLAYER_LINE_LENGTH,
    PLAYER_COLOR,
    DEFAULT_STROKE_COLOR,
} from './constants.js';

export default class Player {
    constructor(gameMap) {
        this.gameMap = gameMap;
        this.x = PLAYER_INITIAL_POSITION.x;
        this.y = PLAYER_INITIAL_POSITION.y;
        this.turnDirection = PLAYER_TURN_DIRECTION.still;
        this.walkDirection = PLAYER_WALK_DIRECTION.still;
        this.radius = PLAYER_DEFAULT_RADIUS;
        this.rotationAngle = PLAYER_DEFAULT_ROTATION_ANGLE;
        this.moveIncrement = PLAYER_DEFAULT_MOVE_INCREMENT;
        this.rotationIncrement = PLAYER_DEFAULT_ROTATION_INCREMENT;
    }

    onKeyPress(keyCode) {
        const onKeyPressActionsMap = {
            [UP_ARROW]: () => (this.walkDirection = PLAYER_WALK_DIRECTION.forward),
            [DOWN_ARROW]: () => (this.walkDirection = PLAYER_WALK_DIRECTION.back),
            [RIGHT_ARROW]: () => (this.turnDirection = PLAYER_TURN_DIRECTION.right),
            [LEFT_ARROW]: () => (this.turnDirection = PLAYER_TURN_DIRECTION.left),
        };

        if (onKeyPressActionsMap[keyCode]) {
            onKeyPressActionsMap[keyCode]();
        }
    }

    onKeyRelease(keyCode) {
        const onKeyReleaseActionsMap = {
            [UP_ARROW]: () => (this.walkDirection = PLAYER_WALK_DIRECTION.still),
            [DOWN_ARROW]: () => (this.walkDirection = PLAYER_WALK_DIRECTION.still),
            [RIGHT_ARROW]: () => (this.turnDirection = PLAYER_TURN_DIRECTION.still),
            [LEFT_ARROW]: () => (this.turnDirection = PLAYER_TURN_DIRECTION.still),
        };

        if (onKeyReleaseActionsMap[keyCode]) {
            onKeyReleaseActionsMap[keyCode]();
        }
    }

    checkCollisions(x, y) {
        const currentRow = Math.floor(x / this.gameMap.tileSize);
        const currentColumn = Math.floor(y / this.gameMap.tileSize);
        return !!this.gameMap.grid[currentColumn][currentRow];
    }

    update() {
        // updating rotation angle
        this.rotationAngle += this.rotationIncrement * this.turnDirection;

        // calculating future coordinates
        const newX =
            this.x + Math.cos(this.rotationAngle) * this.moveIncrement * this.walkDirection;
        const newY =
            this.y + Math.sin(this.rotationAngle) * this.moveIncrement * this.walkDirection;

        // checking if new values will collide with map walls before updating
        if (!this.checkCollisions(newX, newY)) {
            this.x = newX;
            this.y = newY;
            return;
        }

        // if collisions were detected check if we can increment just one axis
        // to allow sliding along the map wall
        this.x = this.checkCollisions(newX, this.y) ? this.x : newX;
        this.y = this.checkCollisions(this.x, newY) ? this.y : newY;
    }

    render() {
        // player
        fill(PLAYER_COLOR);
        circle(this.x, this.y, this.radius);

        // adding a line to be able to see player's rotation
        stroke(PLAYER_COLOR);
        line(
            this.x,
            this.y,
            this.x + Math.cos(this.rotationAngle) * PLAYER_LINE_LENGTH,
            this.y + Math.sin(this.rotationAngle) * PLAYER_LINE_LENGTH
        );
        stroke(DEFAULT_STROKE_COLOR);

        this.update();
    }
}
