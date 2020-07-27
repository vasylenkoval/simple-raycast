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

        this.rays.forEach((ray, index) =>
            ray.getIntercepts().forEach((intercept = {}) => {
                const distance = adjustRayDistanceForFishBowlEffect(
                    this.player.angle,
                    intercept.angle,
                    intercept.distance
                );

                // Getting the height value of the tile (some tiles are higher than default ones)
                const heightMultiplier = this.gameMap.getTileHeight(intercept.x, intercept.y);

                // Faking the height difference by deriving different multipliers
                // for everything below and above the horizon
                const horizon = this.windowHeight / 2;

                // Since player altitude start with 0, we have to offset
                const bottomHeightMultiplier = this.player.altitude + 1;
                const topHeightMultiplier = heightMultiplier - this.player.altitude + 1;

                // Calculating raw length of the stroke, 20 is a random scaling multiplier
                // const rawLength = (this.windowHeight / distance) * 20;
                const rawLength = (this.windowHeight / distance) * 10;

                // Coordinate system in p5 starts with 0,0 at the top left corner
                const rayX = this.pixelsPerRay * index;

                const rayYBottom = horizon + (rawLength / 2) * bottomHeightMultiplier;
                const rayYTop = rayYBottom - rawLength * topHeightMultiplier;

                stroke(`rgba(255, 255, 255, 0.5)`);
                strokeWeight(this.pixelsPerRay);

                line(rayX, rayYTop, rayX, rayYBottom);
            })
        );

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
