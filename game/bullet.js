const DEFAULT_BULLET_COLOR = 'blue';
const DEFAULT_BULLET_RADIUS = 7;
const DEFAULT_BULLET_MOVE_INCREMENT = 3;

export default class Bullet {
    constructor(args = {}) {
        const {
            x,
            y,
            angle,
            radius = DEFAULT_BULLET_RADIUS,
            moveIncrement = DEFAULT_BULLET_MOVE_INCREMENT,

            // required args
            checkCollisions,
        } = args;

        this.x = x;
        this.y = y;
        this.angle = angle;
        this.radius = radius;
        this.moveIncrement = moveIncrement;
        this.checkCollisions = checkCollisions;
    }

    update() {
        const newBulletX = this.x + Math.cos(this.angle) * this.moveIncrement;
        const newBulletY = this.y + Math.sin(this.angle) * this.moveIncrement;

        if (!this.checkCollisions(newBulletX, newBulletY)) {
            this.x = newBulletX;
            this.y = newBulletY;
            return;
        }

        if (!this.checkCollisions(newBulletX, this.y)) {
            this.angle = Math.atan2(Math.sin(this.angle) * -1, Math.cos(this.angle));
        } else {
            this.angle = Math.atan2(Math.sin(this.angle), Math.cos(this.angle) * -1);
        }
    }

    render() {
        fill(DEFAULT_BULLET_COLOR);
        circle(this.x, this.y, this.radius);

        this.update();
    }
}
