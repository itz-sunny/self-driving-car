class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 3;
        this.rayLength = 100;
        this.raySpread = Math.PI / 4;

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders) {
        this.#castRays();
        this.readings = [];
        
        for (const ray of this.rays) {
            this.readings.push(this.#getReading(ray, roadBorders));
        }
    }

    #getReading(ray, roadBorders) {
        const touches = [];

        for (const roadBorder of roadBorders) {
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorder[0],
                roadBorder[1]
            );

            if (touch) {
                touches.push(touch);
            }

            if (touches.length === 0) {
                return null;
            } else {
                const minOffset = Math.min(...touches.map(e => e.offset));
                return touches.find(e => e.offset === minOffset);
            }
        }
    }

    #castRays() {
        this.rays = [];
        for (let ray = 0; ray < this.rayCount; ray++) {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : ray / (this.rayCount - 1)
            ) + this.car.angle;

            const start = {
                x: this.car.x,
                y: this.car.y
            };

            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            };

            this.rays.push([start, end]);
        }
    }

    draw(ctx) {
        for (let rayIndex = 0; rayIndex < this.rayCount; rayIndex++) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            
            let end = this.rays[rayIndex][1];
            if (this.readings[rayIndex]) {
                end = this.readings[rayIndex];
            }

            ctx.moveTo(this.rays[rayIndex][0].x, this.rays[rayIndex][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.strokeStyle = "black";

            ctx.beginPath();
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(this.rays[rayIndex][1].x, this.rays[rayIndex][1].y);
            ctx.stroke();
        }
    }
}