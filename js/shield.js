class Shield {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 28;
        this.collected = false;
        this.animFrame = 0;
        this.animTimer = 0;
        this.animSpeed = 10;
        this.floatOffset = 0;
        this.floatSpeed = 0.1;
    }

    update(gameSpeed) {
        this.x -= gameSpeed;
        
        this.animTimer++;
        if (this.animTimer >= this.animSpeed) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 4;
        }
        
        this.floatOffset = Math.sin(this.animTimer * this.floatSpeed) * 3;
    }

    render(ctx) {
        if (this.collected) return;
        
        const drawX = Math.floor(this.x);
        const drawY = Math.floor(this.y + this.floatOffset);
        
        const glowIntensity = 0.3 + Math.sin(this.animTimer * 0.15) * 0.2;
        ctx.shadowColor = '#00bfff';
        ctx.shadowBlur = 15 * glowIntensity;
        
        ctx.fillStyle = '#1e90ff';
        ctx.beginPath();
        ctx.moveTo(drawX + 14, drawY);
        ctx.lineTo(drawX + 28, drawY + 8);
        ctx.lineTo(drawX + 28, drawY + 18);
        ctx.lineTo(drawX + 14, drawY + 28);
        ctx.lineTo(drawX, drawY + 18);
        ctx.lineTo(drawX, drawY + 8);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#87ceeb';
        ctx.beginPath();
        ctx.moveTo(drawX + 14, drawY + 4);
        ctx.lineTo(drawX + 22, drawY + 10);
        ctx.lineTo(drawX + 22, drawY + 16);
        ctx.lineTo(drawX + 14, drawY + 22);
        ctx.lineTo(drawX + 6, drawY + 16);
        ctx.lineTo(drawX + 6, drawY + 10);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(drawX + 14, drawY + 8);
        ctx.lineTo(drawX + 18, drawY + 11);
        ctx.lineTo(drawX + 18, drawY + 14);
        ctx.lineTo(drawX + 14, drawY + 17);
        ctx.lineTo(drawX + 10, drawY + 14);
        ctx.lineTo(drawX + 10, drawY + 11);
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }

    collect() {
        if (!this.collected) {
            this.collected = true;
            audioManager.playShield();
            return true;
        }
        return false;
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
