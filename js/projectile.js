class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 8;
        this.speed = 12;
        this.active = true;
        this.trail = [];
        this.maxTrailLength = 5;
    }

    update() {
        this.x += this.speed;
        
        this.trail.unshift({ x: this.x, y: this.y + 4 });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.pop();
        }
        
        if (this.x > 900) {
            this.active = false;
        }
    }

    render(ctx) {
        if (!this.active) return;
        
        this.trail.forEach((point, index) => {
            const alpha = 1 - (index / this.maxTrailLength);
            const size = 4 - (index * 0.6);
            ctx.fillStyle = `rgba(255, 200, 100, ${alpha * 0.6})`;
            ctx.fillRect(point.x - index * 3, point.y - size / 2, size, size);
        });
        
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 10;
        
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(this.x, this.y, 12, 8);
        
        ctx.fillStyle = '#ff8c00';
        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y);
        ctx.lineTo(this.x + 18, this.y + 4);
        ctx.lineTo(this.x + 12, this.y + 8);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.x + 2, this.y + 2, 6, 4);
        
        ctx.shadowBlur = 0;
    }

    hit() {
        this.active = false;
    }

    isOffScreen() {
        return this.x > 900;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
