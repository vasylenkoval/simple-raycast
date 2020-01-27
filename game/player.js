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
    BULLET_DEFAULT_MOVE_INCREMENT,
    BULLET_COLOR,
    BULLET_RADIUS,
    FULL_CIRCLE,
} from './constants.js';

export default class Player {
    constructor(gameMap) {
        // player
        this.gameMap = gameMap;
        this.x = PLAYER_INITIAL_POSITION.x;
        this.y = PLAYER_INITIAL_POSITION.y;
        this.turnDirection = PLAYER_TURN_DIRECTION.still;
        this.walkDirection = PLAYER_WALK_DIRECTION.still;
        this.playerRadius = PLAYER_DEFAULT_RADIUS;
        this.rotationAngle = PLAYER_DEFAULT_ROTATION_ANGLE;
        this.moveIncrement = PLAYER_DEFAULT_MOVE_INCREMENT;
        this.rotationIncrement = PLAYER_DEFAULT_ROTATION_INCREMENT;

        // bullets
        this.bullets = [];
        this.bulletRadius = BULLET_RADIUS;
        this.bulletMoveIncrement = BULLET_DEFAULT_MOVE_INCREMENT;
    }

    onKeyPress(keyCode) {
        const onKeyPressActionsMap = {
            [UP_ARROW]: () => (this.walkDirection = PLAYER_WALK_DIRECTION.forward),
            [DOWN_ARROW]: () => (this.walkDirection = PLAYER_WALK_DIRECTION.back),
            [RIGHT_ARROW]: () => (this.turnDirection = PLAYER_TURN_DIRECTION.right),
            [LEFT_ARROW]: () => (this.turnDirection = PLAYER_TURN_DIRECTION.left),
            [SHIFT]: () => this.onShoot(),
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

    onShoot() {
        this.bullets.push({ x: this.x, y: this.y, rotationAngle: this.rotationAngle });
    }

    update() {
        // updating player's rotation angle
        const incrementedAngle = this.rotationAngle + this.rotationIncrement * this.turnDirection;

        this.rotationAngle =
            incrementedAngle > 0
                ? incrementedAngle % FULL_CIRCLE
                : (FULL_CIRCLE + incrementedAngle) % FULL_CIRCLE;

        // updating all bullets
        this.bullets = this.bullets.map((bullet = {}) => {
            const newBulletX = bullet.x + Math.cos(bullet.rotationAngle) * this.bulletMoveIncrement;
            const newBulletY = bullet.y + Math.sin(bullet.rotationAngle) * this.bulletMoveIncrement;

            if (!this.gameMap.checkCollisions(newBulletX, newBulletY)) {
                return { x: newBulletX, y: newBulletY, rotationAngle: bullet.rotationAngle };
            }

            let rotationAngle;
            if (!this.gameMap.checkCollisions(newBulletX, bullet.y)) {
                rotationAngle = Math.atan2(
                    Math.sin(bullet.rotationAngle) * -1,
                    Math.cos(bullet.rotationAngle)
                );
            } else {
                rotationAngle = Math.atan2(
                    Math.sin(bullet.rotationAngle),
                    Math.cos(bullet.rotationAngle) * -1
                );
            }

            return {
                x: bullet.x,
                y: bullet.y,
                rotationAngle,
            };
        });

        // calculating player future coordinates
        const newPlayerX =
            this.x + Math.cos(this.rotationAngle) * this.moveIncrement * this.walkDirection;
        const newPlayerY =
            this.y + Math.sin(this.rotationAngle) * this.moveIncrement * this.walkDirection;

        // checking if new values will collide with map walls before updating
        if (!this.gameMap.checkCollisions(newPlayerX, newPlayerY)) {
            this.x = newPlayerX;
            this.y = newPlayerY;
            return;
        }

        // if collisions were detected check if we can increment just one axis
        // to allow sliding along the map wall
        this.x = this.gameMap.checkCollisions(newPlayerX, this.y) ? this.x : newPlayerX;
        this.y = this.gameMap.checkCollisions(this.x, newPlayerY) ? this.y : newPlayerY;
    }

    render() {
        // player
        fill(PLAYER_COLOR);
        circle(this.x, this.y, this.playerRadius);

        // adding a line to be able to see player's rotation
        stroke(PLAYER_COLOR);
        line(
            this.x,
            this.y,
            this.x + Math.cos(this.rotationAngle) * PLAYER_LINE_LENGTH,
            this.y + Math.sin(this.rotationAngle) * PLAYER_LINE_LENGTH
        );
        stroke(DEFAULT_STROKE_COLOR);

        // rendering bullets
        this.bullets.forEach((bullet = {}) => {
            fill(BULLET_COLOR);
            circle(bullet.x, bullet.y, this.bulletRadius);
        });
        this.update();
    }
}
