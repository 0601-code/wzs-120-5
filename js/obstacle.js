class Obstacle {
    constructor(x, groundY, type = 'cactus') {
        this.x = x;
        this.groundY = groundY;
        this.type = type;
        this.speed = 5;
        
        if (type === 'cactus') {
            this.width = 24;
            this.height = 40;
            this.y = groundY + 8;
        } else if (type === 'rock') {
            this.width = 32;
            this.height = 28;
            this.y = groundY + 20;
        } else if (type === 'tall') {
            this.width = 20;
            this.height = 56;
            this.y = groundY - 8;
        }
    }

    update(gameSpeed) {
        this.x -= gameSpeed;
    }

    render(ctx) {
        const drawX = Math.floor(this.x);
        const drawY = Math.floor(this.y);

        if (this.type === 'cactus') {
            this.drawCactus(ctx, drawX, drawY);
        } else if (this.type === 'rock') {
            this.drawRock(ctx, drawX, drawY);
        } else if (this.type === 'tall') {
            this.drawTallCactus(ctx, drawX, drawY);
        }
    }

    drawCactus(ctx, x, y) {
        ctx.fillStyle = '#228b22';
        ctx.fillRect(x + 8, y, 8, 40);
        ctx.fillRect(x, y + 8, 8, 16);
        ctx.fillRect(x + 16, y + 16, 8, 12);
        
        ctx.fillStyle = '#32cd32';
        ctx.fillRect(x + 10, y + 2, 4, 36);
        
        ctx.fillStyle = '#006400';
        ctx.fillRect(x + 6, y + 10, 2, 2);
        ctx.fillRect(x + 16, y + 18, 2, 2);
    }

    drawRock(ctx, x, y) {
        ctx.fillStyle = '#696969';
        ctx.fillRect(x + 4, y + 4, 24, 20);
        ctx.fillRect(x, y + 12, 32, 12);
        
        ctx.fillStyle = '#808080';
        ctx.fillRect(x + 6, y + 6, 8, 8);
        
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(x + 18, y + 16, 10, 6);
    }

    drawTallCactus(ctx, x, y) {
        ctx.fillStyle = '#228b22';
        ctx.fillRect(x + 6, y, 8, 56);
        ctx.fillRect(x, y + 12, 6, 20);
        ctx.fillRect(x + 14, y + 24, 6, 16);
        
        ctx.fillStyle = '#32cd32';
        ctx.fillRect(x + 8, y + 2, 4, 52);
    }

    isOffScreen() {
        return this.x + this.width < 0;
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
