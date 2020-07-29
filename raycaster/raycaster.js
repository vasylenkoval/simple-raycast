import Ray from './ray.js';
import { calcAngleIncrement, adjustRayDistanceForFishBowlEffect } from '../utils/helpers.js';

const DEFAULT_PIXELS_PER_RAY = 1;
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
            windowWidth,
            windowHeight,
        } = args;

        this.player = player;
        this.gameMap = gameMap;
        this.gridDims = gridDims;

        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;

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
                    maxY: this.gridDims.rows * this.gridDims.tileSize,
                    maxX: this.gridDims.columns * this.gridDims.tileSize,
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

        this.rays.forEach((ray, rayIdx) => {
            let prevIntercept = {};

            ray.getIntercepts().forEach((intercept = {}, interceptIdx) => {
                const distance = adjustRayDistanceForFishBowlEffect(
                    this.player.angle,
                    intercept.angle,
                    intercept.distance
                );

                // Getting the height value of the tile
                const heightMultiplier = this.gameMap.getTileHeight(intercept.x, intercept.y);
                const horizon = this.windowHeight / 2;

                // Calculating raw length of the stroke, 10 is a random scaling multiplier
                const rawLength = (this.windowHeight / distance) * heightMultiplier * 10;

                const aboveHorizonLength =
                    (rawLength / heightMultiplier) * (heightMultiplier - this.player.z);

                // Coordinate system in p5 starts with 0,0 at the top left corner
                const rayX = this.pixelsPerRay * rayIdx;
                const rayYTop = horizon - aboveHorizonLength;
                const rayYBottom = rayYTop + rawLength;

                stroke(`rgba(255, 255, 255, 0.5)`);
                strokeWeight(this.pixelsPerRay);

                line(rayX, rayYTop, rayX, rayYBottom);

                // drawing a connection line between each pair of intercepts
                // if (interceptIdx % 2 == 0) {
                //     prevIntercept = { rayX, rayYTop, rayX, rayYBottom };
                // } else {
                //     line(rayX, rayYTop, prevIntercept.rayX, prevIntercept.rayYTop);
                // }
            });
        });

        // temporary 2d rays visualization
        // strokeWeight(1);
        // stroke('red');
        // line(this.player.x, this.player.y, intercept.x, intercept.y);
        strokeWeight(1);
        stroke('black');

        line(0, 180, 720, 180); // horizon

        this.update();
    }
}
