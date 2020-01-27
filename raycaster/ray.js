export default class Ray {
    constructor(x, y, angle, tileSize) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.tileSize = tileSize;
    }

    getDistance(gameMap) {
        const hIntercept = this.findHorizontalIntercept(gameMap);
        this.findVerticalIntercept(gameMap);
        const distanceToIntercept = Math.sqrt(
            Math.pow(this.x - hIntercept.x, 2) + Math.pow(this.y - hIntercept.y, 2)
        );

        return distanceToIntercept;
    }

    findHorizontalIntercept(gameMap) {
        const isFacingUp = this.angle > Math.PI;

        // X and Y of the first horizontal line intercept
        const firstInterceptY = isFacingUp
            ? Math.floor(this.y / this.tileSize) * this.tileSize
            : Math.ceil(this.y / this.tileSize) * this.tileSize;

        const firstInterceptX = isFacingUp
            ? this.x + (firstInterceptY - this.y) / Math.tan(this.angle)
            : this.x - (this.y - firstInterceptY) / Math.tan(this.angle);

        circle(firstInterceptX, firstInterceptY, 5);

        // Checking if we have a hit at the first intercept
        if (gameMap.checkCollisions(firstInterceptX, firstInterceptY)) {
            return { x: firstInterceptX, y: firstInterceptY };
        }

        // Finding constant step values to be able to go through all intercepts
        const stepY = isFacingUp ? -this.tileSize : this.tileSize;
        const stepX = stepY / Math.tan(this.angle);

        const maxY = gameMap.dims.rows * this.tileSize;
        const maxX = gameMap.dims.columns * this.tileSize;

        let incrementX = firstInterceptX + stepX;
        let incrementY = firstInterceptY + stepY;
        circle(incrementX, incrementY, 7);

        while (
            incrementX <= maxX &&
            incrementY <= maxY &&
            incrementX >= 0 &&
            incrementY >= 0 &&
            !gameMap.checkCollisions(incrementX, incrementY)
        ) {
            incrementX += stepX;
            incrementY += stepY;
            circle(incrementX, incrementY, 10);
        }

        return { x: incrementX, y: incrementY };
    }

    findVerticalIntercept(gameMap) {
        // const isFacingRight = this.angle > 1.5 * Math.PI || this.angle < Math.PI / 2;
        // X and Y of the first vertical line intercept
        // const firstInterceptX = isFacingRight
        //     ? Math.ceil(this.x / this.tileSize) * this.tileSize
        //     : Math.floor(this.x / this.tileSize) * this.tileSize;
        // const firstInterceptY = isFacingRight
        //     ? this.y + (firstInterceptX - this.x) * Math.tan(this.angle)
        //     : this.y - (this.x - firstInterceptX) * Math.tan(this.angle);
        // circle(firstInterceptX, firstInterceptY, 5);
        // Checking if we have a hit at the first intercept
        // if (gameMap.checkCollisions(firstInterceptX, firstInterceptY)) {
        //     return { x: firstInterceptX, y: firstInterceptY };
        // }
        // return { x: firstInterceptX, y: firstInterceptY };
        // Finding constant step values to be able to go through all intercepts
        // const stepY = isFacingUp ? -this.tileSize : this.tileSize;
        // const stepX = stepY / Math.tan(this.angle);
        // const maxY = gameMap.dims.rows * this.tileSize;
        // const maxX = gameMap.dims.columns * this.tileSize;
        // let incrementX = firstInterceptX + stepX;
        // let incrementY = firstInterceptY + stepY;
        // circle(incrementX, incrementY, 7);
        // while (
        //     incrementX <= maxX &&
        //     incrementY <= maxY &&
        //     incrementX >= 0 &&
        //     incrementY >= 0 &&
        //     !gameMap.checkCollisions(incrementX, incrementY)
        // ) {
        //     incrementX += stepX;
        //     incrementY += stepY;
        // circle(incrementX, incrementY, 10);
        // }
        // return { x: incrementX, y: incrementY };
    }
}