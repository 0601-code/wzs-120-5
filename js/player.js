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
        
        this.hasShield = false;
        this.shieldFlashTimer = 0;
        this.bullets = 0;
        this.shootCooldown = 0;
        this.shootCooldownMax = 30;
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
            audioManager.playJump();
        }
    }

    shoot() {
        if (this.bullets > 0 && this.shootCooldown <= 0) {
            this.bullets--;
            this.shootCooldown = this.shootCooldownMax;
            audioManager.playShoot();
            return new Projectile(this.x + this.width, this.y + 20);
        }
        return null;
    }

    activateShield() {
        this.hasShield = true;
    }

    useShield() {
        if (this.hasShield) {
            this.hasShield = false;
            this.shieldFlashTimer = 30;
            audioManager.playShieldBreak();
            return true;
        }
        return false;
    }

    addBullets(count) {
        this.bullets += count;
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
        
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
        
        if (this.shieldFlashTimer > 0) {
            this.shieldFlashTimer--;
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
        
        if (this.shieldFlashTimer > 0) {
            const flashAlpha = this.shieldFlashTimer / 30;
            ctx.fillStyle = `rgba(100, 200, 255, ${flashAlpha * 0.5})`;
            ctx.fillRect(drawX - 5, drawY - 5, this.width + 10, this.height + 10);
        }
        
        if (this.hasShield) {
            const shieldPulse = Math.sin(this.animTimer * 0.2) * 2;
            ctx.strokeStyle = '#00bfff';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#00bfff';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(drawX + 16, drawY + 24, 28 + shieldPulse, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.fillStyle = 'rgba(100, 200, 255, 0.15)';
            ctx.beginPath();
            ctx.arc(drawX + 16, drawY + 24, 28 + shieldPulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

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
