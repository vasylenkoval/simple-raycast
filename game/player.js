import { calcAngleIncrement } from '../utils/helpers.js';
import Bullet from './bullet.js';

const SPACE = 32;

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
const DEFAULT_JUMP_ALTITUDE_INCREMENT = 0.2;
const DEFAULT_GRAVITY = 0.1;

export default class Player {
    constructor(args = {}) {
        const {
            playerRadius = DEFAULT_PLAYER_RADIUS,
            angle = DEFAULT_PLAYER_ROTATION_ANGLE,
            moveIncrement = DEFAULT_PLAYER_MOVE_INCREMENT,
            rotationIncrement = DEFAULT_PLAYER_ROTATION_INCREMENT,
            jumpAltitudeIncrement = DEFAULT_JUMP_ALTITUDE_INCREMENT,
            gravityPull = DEFAULT_GRAVITY,
            initialZ = DEFAULT_PLAYER_ALTITUDE,

            // required args
            checkCollisions,
            initialX,
            initialY,
        } = args;

        this.x = initialX;
        this.y = initialY;
        this.z = initialZ;

        this.angle = angle;
        this.rotationIncrement = rotationIncrement;
        this.moveIncrement = moveIncrement;

        this.playerRadius = playerRadius;

        this.turnDirection = PLAYER_TURN_DIRECTION.still;
        this.walkDirection = PLAYER_WALK_DIRECTION.still;

        this.jumpAltitudeIncrement = jumpAltitudeIncrement;
        this.gravityPull = gravityPull;

        this.bullets = [];

        this.checkCollisions = checkCollisions;
    }

    onKeyPress = (keyCode) => {
        const onKeyPressActionsMap = {
            [UP_ARROW]: () => (this.walkDirection = PLAYER_WALK_DIRECTION.forward),
            [DOWN_ARROW]: () => (this.walkDirection = PLAYER_WALK_DIRECTION.back),
            [RIGHT_ARROW]: () => (this.turnDirection = PLAYER_TURN_DIRECTION.right),
            [LEFT_ARROW]: () => (this.turnDirection = PLAYER_TURN_DIRECTION.left),
            [SPACE]: this.onJump,
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
                checkCollisions: this.checkCollisions,
            })
        );

    onJump = () => {
        if (this.isJumping) {
            return;
        }

        this.isJumping = true;

        setTimeout(() => {
            this.isJumping = false;
        }, 500);
    };

    update() {
        this.angle = calcAngleIncrement(this.angle, this.rotationIncrement * this.turnDirection);

        const newPlayerX = this.x + Math.cos(this.angle) * this.moveIncrement * this.walkDirection;
        const newPlayerY = this.y + Math.sin(this.angle) * this.moveIncrement * this.walkDirection;

        let newPlayerZ = this.z;

        if (this.isJumping) {
            newPlayerZ = newPlayerZ + this.jumpAltitudeIncrement;
        }

        if (newPlayerZ > 1) {
            newPlayerZ -= this.gravityPull;
        }

        // Checking if new values will collide with map walls before updating
        if (!this.checkCollisions(newPlayerX, newPlayerY, newPlayerZ)) {
            this.x = newPlayerX;
            this.y = newPlayerY;
            this.z = newPlayerZ;
            return;
        }

        // If collisions were detected - check if we can increment just one axis
        // to allow for sliding along the map wall
        this.x = this.checkCollisions(newPlayerX, this.y, this.z) ? this.x : newPlayerX;
        this.y = this.checkCollisions(this.x, newPlayerY, this.z) ? this.y : newPlayerY;
        this.z = this.checkCollisions(this.x, this.y, newPlayerZ) ? this.z : newPlayerZ;
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
