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
    constructor() {
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

    update() {
        if (this.walkDirection === PLAYER_WALK_DIRECTION.forward) {
            this.x += Math.cos(this.rotationAngle) * this.moveIncrement;
            this.y += Math.sin(this.rotationAngle) * this.moveIncrement;
        }

        if (this.walkDirection === PLAYER_WALK_DIRECTION.back) {
            this.x -= Math.cos(this.rotationAngle) * this.moveIncrement;
            this.y -= Math.sin(this.rotationAngle) * this.moveIncrement;
        }

        if (this.turnDirection === PLAYER_TURN_DIRECTION.right) {
            this.rotationAngle += this.rotationIncrement;
        }

        if (this.turnDirection === PLAYER_TURN_DIRECTION.left) {
            this.rotationAngle -= this.rotationIncrement;
        }
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
    }
}
