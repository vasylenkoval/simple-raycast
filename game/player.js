import { calcAngleIncrement } from '../utils/helpers.js';
import Bullet from './bullet.js';

const PLAYER_TURN_DIRECTION = {
    still: 0,
    left: -1,
    right: 1,
};
const PLAYER_WALK_DIRECTION = {
    still: 0,
    forward: 1,
    back: -1,
};
const DEFAULT_PLAYER_RADIUS = 15;
const DEFAULT_PLAYER_ROTATION_ANGLE = 1.5 * Math.PI;
const DEFAULT_PLAYER_MOVE_INCREMENT = 3;
const DEFAULT_PLAYER_ROTATION_INCREMENT = 3 * (Math.PI / 180);
const DEFAULT_PLAYER_COLOR = 'red';
const DEFAULT_PLAYER_ALTITUDE = 1;

export default class Player {
    constructor(args = {}) {
        const {
            playerRadius = DEFAULT_PLAYER_RADIUS,
            angle = DEFAULT_PLAYER_ROTATION_ANGLE,
            moveIncrement = DEFAULT_PLAYER_MOVE_INCREMENT,
            rotationIncrement = DEFAULT_PLAYER_ROTATION_INCREMENT,
            initialAltitude = DEFAULT_PLAYER_ALTITUDE,

            // required args
            onCheckCollisions,
            initialX,
            initialY,
        } = args;

        this.x = initialX;
        this.y = initialY;

        this.angle = angle;
        this.rotationIncrement = rotationIncrement;
        this.moveIncrement = moveIncrement;
        this.altitude = initialAltitude;

        this.playerRadius = playerRadius;

        this.turnDirection = PLAYER_TURN_DIRECTION.still;
        this.walkDirection = PLAYER_WALK_DIRECTION.still;

        this.bullets = [];

        this.onCheckCollisions = onCheckCollisions;
    }

    onKeyPress = (keyCode) => {
        const onKeyPressActionsMap = {
            [UP_ARROW]: () => (this.walkDirection = PLAYER_WALK_DIRECTION.forward),
            [DOWN_ARROW]: () => (this.walkDirection = PLAYER_WALK_DIRECTION.back),
            [RIGHT_ARROW]: () => (this.turnDirection = PLAYER_TURN_DIRECTION.right),
            [LEFT_ARROW]: () => (this.turnDirection = PLAYER_TURN_DIRECTION.left),
            // [SHIFT]: () => this.onShoot(),
            [TAB]: () => this.changeAltitude(1),
            [SHIFT]: () => this.changeAltitude(-1),
        };

        if (onKeyPressActionsMap[keyCode]) {
            onKeyPressActionsMap[keyCode]();
        }
    };

    onKeyRelease = (keyCode) => {
        const onKeyReleaseActionsMap = {
            [UP_ARROW]: () => (this.walkDirection = PLAYER_WALK_DIRECTION.still),
            [DOWN_ARROW]: () => (this.walkDirection = PLAYER_WALK_DIRECTION.still),
            [RIGHT_ARROW]: () => (this.turnDirection = PLAYER_TURN_DIRECTION.still),
            [LEFT_ARROW]: () => (this.turnDirection = PLAYER_TURN_DIRECTION.still),
        };

        if (onKeyReleaseActionsMap[keyCode]) {
            onKeyReleaseActionsMap[keyCode]();
        }
    };

    onShoot = () =>
        this.bullets.push(
            new Bullet({
                x: this.x,
                y: this.y,
                angle: this.angle,
                onCheckCollisions: this.onCheckCollisions,
            })
        );

    changeAltitude = (value) => (this.altitude += value);

    update() {
        this.angle = calcAngleIncrement(this.angle, this.rotationIncrement * this.turnDirection);

        const newPlayerX = this.x + Math.cos(this.angle) * this.moveIncrement * this.walkDirection;
        const newPlayerY = this.y + Math.sin(this.angle) * this.moveIncrement * this.walkDirection;

        // Checking if new values will collide with map walls before updating
        if (!this.onCheckCollisions(newPlayerX, newPlayerY)) {
            this.x = newPlayerX;
            this.y = newPlayerY;
            return;
        }

        // If collisions were detected - check if we can increment just one axis
        // to allow for sliding along the map wall
        this.x = this.onCheckCollisions(newPlayerX, this.y) ? this.x : newPlayerX;
        this.y = this.onCheckCollisions(this.x, newPlayerY) ? this.y : newPlayerY;
    }

    render() {
        fill(DEFAULT_PLAYER_COLOR);
        circle(this.x, this.y, this.playerRadius);

        for (const bullet of this.bullets) {
            bullet.render();
        }

        this.update();
    }
}
