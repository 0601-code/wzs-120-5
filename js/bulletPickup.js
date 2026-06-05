class BulletPickup {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.collected = false;
        this.animFrame = 0;
        this.animTimer = 0;
        this.animSpeed = 8;
        this.floatOffset = 0;
        this.bulletCount = 3;
    }

    update(gameSpeed) {
        this.x -= gameSpeed;
        
        this.animTimer++;
        if (this.animTimer >= this.animSpeed) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 4;
        }
        
        this.floatOffset = Math.sin(this.animTimer * 0.12) * 2;
    }

    render(ctx) {
        if (this.collected) return;
        
        const drawX = Math.floor(this.x);
        const drawY = Math.floor(this.y + this.floatOffset);
        
        const glowIntensity = 0.3 + Math.sin(this.animTimer * 0.15) * 0.2;
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 12 * glowIntensity;
        
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(drawX + 2, drawY + 6, 20, 12);
        
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(drawX + 16, drawY + 4, 6, 16);
        
        ctx.fillStyle = '#ff8c00';
        ctx.beginPath();
        ctx.moveTo(drawX + 22, drawY + 4);
        ctx.lineTo(drawX + 28, drawY + 12);
        ctx.lineTo(drawX + 22, drawY + 20);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#cd853f';
        ctx.fillRect(drawX + 4, drawY + 8, 10, 8);
        
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('x3', drawX + 12, drawY - 5);
    }

    collect() {
        if (!this.collected) {
            this.collected = true;
            audioManager.playBulletPickup();
            return this.bulletCount;
        }
        return 0;
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
