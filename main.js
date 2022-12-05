const canvas = document.getElementById("carCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "blue");
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50)
];

animate();

function animate() {
    canvas.height = window.innerHeight;
    car.update(road.borders);
    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);
    road.draw(ctx);
    car.draw(ctx);
    requestAnimationFrame(animate);
}