export default class Ray {
    constructor(args = {}) {
        const { x, y, angle, tileSize, maxX, maxY, onCheckCollisions } = args;

        this.x = x;
        this.y = y;
        this.angle = angle;
        this.tileSize = tileSize;
        this.maxY = maxY;
        this.maxX = maxX;

        this.onCheckCollisions = onCheckCollisions;
    }

    getClosestIntercept() {
        const hIntercept = this.findHorizontalIntercept();
        const vIntercept = this.findVerticalIntercept();

        const hInterceptDistance = Math.sqrt(
            Math.pow(this.x - hIntercept.x, 2) + Math.pow(this.y - hIntercept.y, 2)
        );

        const vInterceptDistance = Math.sqrt(
            Math.pow(this.x - vIntercept.x, 2) + Math.pow(this.y - vIntercept.y, 2)
        );

        return hInterceptDistance < vInterceptDistance
            ? { x: hIntercept.x, y: hIntercept.y, distance: hInterceptDistance }
            : { x: vIntercept.x, y: vIntercept.y, distance: vInterceptDistance };
    }

    findHorizontalIntercept() {
        const isFacingUp = this.angle > Math.PI;

        // X and Y of the first horizontal line intercept
        const firstInterceptY = isFacingUp
            ? Math.floor(this.y / this.tileSize) * this.tileSize
            : Math.ceil(this.y / this.tileSize) * this.tileSize;

        const firstInterceptX = isFacingUp
            ? this.x + (firstInterceptY - this.y) / Math.tan(this.angle)
            : this.x - (this.y - firstInterceptY) / Math.tan(this.angle);

        // Checking if we have a hit at the first intercept
        if (this.onCheckCollisions(firstInterceptX, firstInterceptY)) {
            return { x: firstInterceptX, y: firstInterceptY };
        }

        // Finding constant step values to be able to go through all intercepts
        const stepY = isFacingUp ? -this.tileSize : this.tileSize;
        const stepX = stepY / Math.tan(this.angle);

        let incrementX = firstInterceptX + stepX;
        let incrementY = firstInterceptY + stepY;

        while (
            incrementX <= this.maxX &&
            incrementY <= this.maxY &&
            incrementX >= 0 &&
            incrementY >= 0 &&
            !this.onCheckCollisions(incrementX, incrementY)
        ) {
            incrementX += stepX;
            incrementY += stepY;
        }

        return { x: incrementX, y: incrementY };
    }

    findVerticalIntercept() {
        const isFacingRight = this.angle > 1.5 * Math.PI || this.angle < Math.PI / 2;
        // X and Y of the first vertical line intercept

        const firstInterceptX = isFacingRight
            ? Math.ceil(this.x / this.tileSize) * this.tileSize
            : Math.floor(this.x / this.tileSize) * this.tileSize;

        const firstInterceptY = isFacingRight
            ? this.y + (firstInterceptX - this.x) * Math.tan(this.angle)
            : this.y - (this.x - firstInterceptX) * Math.tan(this.angle);

        // Checking if we have a hit at the first intercept
        if (this.onCheckCollisions(firstInterceptX, firstInterceptY)) {
            return { x: firstInterceptX, y: firstInterceptY };
        }

        // Finding constant step values to be able to go through all intercepts
        const stepX = isFacingRight ? this.tileSize : -this.tileSize;
        const stepY = stepX * Math.tan(this.angle);

        let incrementX = firstInterceptX + stepX;
        let incrementY = firstInterceptY + stepY;

        while (
            incrementX <= this.maxX &&
            incrementY <= this.maxY &&
            incrementX >= 0 &&
            incrementY >= 0 &&
            !this.onCheckCollisions(incrementX, incrementY)
        ) {
            incrementX += stepX;
            incrementY += stepY;
        }
        return { x: incrementX, y: incrementY };
    }
}
