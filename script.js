const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const floatParticles = [];
const burstParticles = [];
const BLUE_SHADES = ["#3b82f6", "#60a5fa", "#93c5fd", "#2563eb", "#bfdbfe", "#1d4ed8"];

function getHeartPoint(t) {
    const scale = Math.min(width, height) / 30;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    return { x: x * scale + width / 2, y: y * scale + height / 2 };
}

class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = BLUE_SHADES[Math.floor(Math.random() * BLUE_SHADES.length)];
        this.size = Math.random() * 2 + 1;
        this.maxLife = Math.random() * 60 + 40;
        this.life = type === "float" ? Math.random() * this.maxLife : this.maxLife;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
    }

    update() {
        if (this.type === "float") {
            this.life -= 0.5;
            if (this.life <= 0) {
                const t = Math.random() * Math.PI * 2;
                const pt = getHeartPoint(t);
                this.x = pt.x;
                this.y = pt.y;
                this.life = this.maxLife;
            }
        } else {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const FLOAT_COUNT = 140;
for (let i = 0; i < FLOAT_COUNT; i++) {
    const t = (i / FLOAT_COUNT) * Math.PI * 2;
    const pt = getHeartPoint(t);
    floatParticles.push(new Particle(pt.x, pt.y, "float"));
}

function spawnHeartBurst(x, y) {
    const count = 140;
    for (let i = 0; i < count; i++) {
        burstParticles.push(new Particle(x, y, "burst"));
    }
}

window.addEventListener('click', (e) => {
    spawnHeartBurst(e.clientX, e.clientY);
});

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 0;
    ctx.fillRect(0, 0, width, height);

    floatParticles.forEach(p => { p.update(); p.draw(); });

    for (let i = burstParticles.length - 1; i >= 0; i--) {
        const p = burstParticles[i];
        p.update();
        p.draw();
        if (p.life <= 0) burstParticles.splice(i, 1);
    }

    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

animate();
