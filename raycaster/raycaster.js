import { FOV, DEFAULT_PIXELS_PER_RAY } from './constants.js';
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
        this.rays = [...new Array(Math.floor(this.windowWidth / this.pixelsPerRay))];
    }

    castRays() {
        const ray = new Ray(
            this.player.x,
            this.player.y,
            this.player.rotationAngle,
            this.gameMap.tileSize
        );

        const distance = ray.getDistance(this.gameMap);
        console.log(distance);

        // const initialAngle = this.player.rotationAngle - this.fov / 2;

        // this.rays = this.rays.map((_, index) => {
        //     const ray = new Ray(
        //         this.player.x,
        //         this.player.y,
        //         initialAngle + index * this.fovAngleIncrement,
        //         this.gameMap.tileSize
        //     );

        //     const distance = ray.getDistance(this.gameMap);
        //     console.log(distance);
        // });

        // this.rays = this.rays.map((_, index) => ({
        //     x: this.player.x + Math.cos(initialAngle + index * this.fovAngleIncrement) * 200,
        //     y: this.player.y + Math.sin(initialAngle + index * this.fovAngleIncrement) * 200,
        // }));
    }

    update() {
        this.castRays();
    }

    render() {
        this.update();

        // stroke('rgba(255, 255, 255, 0.5)');
        // this.rays.forEach((ray = {}) => {
        //     line(this.player.x, this.player.y, ray.x, ray.y);
        // });
        // stroke('black');
    }
}
