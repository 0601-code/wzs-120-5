class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.collected = false;
        this.animFrame = 0;
        this.animTimer = 0;
        this.animSpeed = 8;
        this.value = 10;
    }

    update(gameSpeed) {
        this.x -= gameSpeed;
        
        this.animTimer++;
        if (this.animTimer >= this.animSpeed) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 4;
        }
    }

    render(ctx) {
        if (this.collected) return;
        
        const drawX = Math.floor(this.x);
        const drawY = Math.floor(this.y);
        
        const scale = 1 - Math.abs(this.animFrame - 1.5) * 0.15;
        const scaledWidth = this.width * scale;
        const offsetX = (this.width - scaledWidth) / 2;
        
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(drawX + 10, drawY + 10, 10 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffec8b';
        ctx.beginPath();
        ctx.arc(drawX + 8, drawY + 8, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#b8860b';
        ctx.beginPath();
        ctx.arc(drawX + 10, drawY + 10, 10 * scale, -Math.PI * 0.3, Math.PI * 0.7);
        ctx.lineTo(drawX + 10, drawY + 10);
        ctx.fill();
        
        ctx.fillStyle = '#b8860b';
        ctx.font = `${12 * scale}px "Press Start 2P"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', drawX + 10, drawY + 11);
    }

    collect() {
        if (!this.collected) {
            this.collected = true;
            audioManager.playCoin();
            return this.value;
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
