import { FOV, DEFAULT_PIXELS_PER_RAY, FULL_CIRCLE } from './constants.js';
import Ray from './ray.js';

export default class RayCaster {
    constructor({ player, gameMap, windowWidth = 320, windowHeight = 200 } = {}) {
        this.player = player;
        this.gameMap = gameMap;
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
        this.fov = FOV;
        this.pixelsPerRay = DEFAULT_PIXELS_PER_RAY;
        this.fovAngleIncrement = (this.fov / this.windowWidth) * this.pixelsPerRay;
        this.rays = [];
    }

    castRays() {
        // Setting ray angle to the value of the first ray
        const adjustedFOVRayAngle = this.player.rotationAngle - this.fov / 2;
        let rayAngle =
            adjustedFOVRayAngle > 0
                ? adjustedFOVRayAngle % FULL_CIRCLE
                : (FULL_CIRCLE + adjustedFOVRayAngle) % FULL_CIRCLE;

        const numRays = this.windowWidth / this.pixelsPerRay;
        const rayAngleIncrement = this.fov / numRays;

        this.rays = [];

        for (let i = 0; i < numRays; i++) {
            this.rays.push(new Ray(this.player.x, this.player.y, rayAngle, this.gameMap.tileSize));

            rayAngle = (rayAngle + rayAngleIncrement) % FULL_CIRCLE;
        }
    }

    update() {
        this.castRays();
    }

    render() {
        this.update();

        this.rays.forEach((ray, index) => {
            const intercept = ray.getClosestIntercept(this.gameMap);
            const rayLength = (this.windowHeight / intercept.distance) * 10;
            const rayX = this.pixelsPerRay * index;
            const rayY = (this.windowHeight - rayLength) / 2;

            stroke(`rgba(255, 255, 255, ${rayLength / this.windowHeight})`);
            strokeWeight(this.pixelsPerRay);
            line(rayX, rayY, rayX, rayY + rayLength);

            // temporary 2d rays visualization
            strokeWeight(1);
            stroke('red');
            line(this.player.x, this.player.y, intercept.x, intercept.y);
        });
        strokeWeight(1);
        stroke('black');
    }
}
