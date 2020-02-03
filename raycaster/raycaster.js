import Ray from './ray.js';
import { calcAngleIncrement, adjustRayDistanceForFishBowlEffect } from '../utils/helpers.js';

const DEFAULT_PIXELS_PER_RAY = 2;
const DEFAULT_FOV = Math.PI / 2; // 90 deg

export default class RayCaster {
    constructor(args = {}) {
        const {
            pixelsPerRay = DEFAULT_PIXELS_PER_RAY,
            fov = DEFAULT_FOV,

            // required args
            gridDims,
            player,
            gameMap,
        } = args;

        this.player = player;
        this.gameMap = gameMap;
        this.gridDims = gridDims;
        this.windowWidth = this.gridDims.columns * gridDims.tileSize;
        this.windowHeight = this.gridDims.rows * gridDims.tileSize;

        this.fov = fov;
        this.pixelsPerRay = pixelsPerRay;
        this.fovAngleIncrement = (this.fov / this.windowWidth) * this.pixelsPerRay;

        this.rays = [];
    }

    castRays = () => {
        const numRays = this.windowWidth / this.pixelsPerRay;
        let rayAngle = calcAngleIncrement(this.player.angle, -(this.fov / 2));

        this.rays = [];

        for (let i = 0; i < numRays; i++) {
            this.rays.push(
                new Ray({
                    x: this.player.x,
                    y: this.player.y,
                    angle: rayAngle,
                    tileSize: this.gridDims.tileSize,
                    maxY: this.windowHeight,
                    maxX: this.windowWidth,
                    onCheckCollisions: this.gameMap.checkCollisions,
                })
            );
            rayAngle = calcAngleIncrement(rayAngle, this.fov / numRays);
        }
    };

    update() {
        this.castRays();
    }

    render() {
        clear();
        this.rays.forEach((ray, index) => {
            const intercept = ray.getClosestIntercept();
            const adjustedDistance = adjustRayDistanceForFishBowlEffect(
                this.player.angle,
                intercept.angle,
                intercept.distance
            );

            const tileMultiplier = this.gameMap.getTileValue(intercept.x, intercept.y);

            const scalar = 10;
            const rawLength = (this.windowHeight / adjustedDistance) * scalar;

            const rayX = this.pixelsPerRay * index;

            const rayYBottom = this.windowHeight - (this.windowHeight - rawLength) / 2;
            const rayYTop = rayYBottom - rawLength * tileMultiplier;

            stroke(`rgba(255, 255, 255, ${rawLength / this.windowHeight})`);
            strokeWeight(this.pixelsPerRay);

            line(rayX, rayYTop, rayX, rayYBottom);

            // temporary 2d rays visualization
            // strokeWeight(1);
            // stroke('red');
            // line(this.player.x, this.player.y, intercept.x, intercept.y);
        });
        strokeWeight(1);
        stroke('black');

        this.update();
    }
}
