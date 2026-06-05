class Player {
    constructor(x, groundY) {
        this.x = x;
        this.y = groundY;
        this.groundY = groundY;
        this.width = 32;
        this.height = 48;
        this.velocityY = 0;
        this.isJumping = false;
        this.gravity = 0.8;
        this.jumpForce = -15;
        this.animFrame = 0;
        this.animTimer = 0;
        this.animSpeed = 5;
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
            audioManager.playJump();
        }
    }

    update() {
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.velocityY = 0;
            this.isJumping = false;
        }

        this.animTimer++;
        if (this.animTimer >= this.animSpeed) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 4;
        }
    }

    render(ctx) {
        const pixelSize = 4;
        const colors = {
            skin: '#ffcc99',
            hair: '#8b4513',
            shirt: '#4169e1',
            pants: '#2f4f4f',
            shoes: '#333333'
        };

        const drawX = Math.floor(this.x);
        const drawY = Math.floor(this.y);

        ctx.fillStyle = colors.shirt;
        ctx.fillRect(drawX + 8, drawY + 16, 16, 20);

        ctx.fillStyle = colors.skin;
        ctx.fillRect(drawX + 8, drawY, 16, 16);

        ctx.fillStyle = colors.hair;
        ctx.fillRect(drawX + 8, drawY, 16, 6);

        ctx.fillStyle = '#000';
        ctx.fillRect(drawX + 12, drawY + 8, 3, 3);
        ctx.fillRect(drawX + 18, drawY + 8, 3, 3);

        ctx.fillStyle = colors.pants;
        ctx.fillRect(drawX + 8, drawY + 36, 6, 12);
        ctx.fillRect(drawX + 18, drawY + 36, 6, 12);

        if (!this.isJumping) {
            const legOffset = Math.sin(this.animFrame * Math.PI / 2) * 4;
            ctx.fillStyle = colors.pants;
            ctx.fillRect(drawX + 8, drawY + 36 + legOffset, 6, 12);
            ctx.fillRect(drawX + 18, drawY + 36 - legOffset, 6, 12);
        }

        ctx.fillStyle = colors.shoes;
        ctx.fillRect(drawX + 6, drawY + 44, 8, 4);
        ctx.fillRect(drawX + 18, drawY + 44, 8, 4);
    }

    getBounds() {
        return {
            x: this.x + 8,
            y: this.y,
            width: 16,
            height: 48
        };
    }
}
