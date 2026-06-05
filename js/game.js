class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        this.CANVAS_WIDTH = 800;
        this.CANVAS_HEIGHT = 400;
        this.GROUND_Y = 320;
        this.INITIAL_SPEED = 5;
        this.MAX_SPEED = 12;
        this.SPEED_INCREMENT = 0.002;
        this.OBSTACLE_INTERVAL = 120;
        this.COIN_INTERVAL = 90;
        
        this.gameSpeed = this.INITIAL_SPEED;
        this.score = 0;
        this.isRunning = false;
        this.isGameOver = false;
        this.canRestart = true;
        this.obstacleTimer = 0;
        this.coinTimer = 0;
        this.backgroundOffset = 0;
        this.animationFrameId = null;
        this.gameoverTimeout = null;
        
        this.player = null;
        this.obstacles = [];
        this.coins = [];
        this.stars = [];
        
        this.initStars();
        this.bindEvents();
    }

    initStars() {
        for (let i = 0; i < 50; i++) {
            this.stars.push({
                x: Utils.randomInt(0, this.width),
                y: Utils.randomInt(0, this.GROUND_Y - 50),
                size: Utils.randomInt(1, 3),
                twinkle: Utils.randomFloat(0, Math.PI * 2)
            });
        }
    }

    bindEvents() {
        document.getElementById('start-btn').addEventListener('click', () => this.start());
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.isRunning && !this.isGameOver) {
                    this.player.jump();
                } else if (!this.isRunning && !this.isGameOver && this.canRestart) {
                    this.start();
                }
            }
        });
    }

    init() {
        this.player = new Player(100, this.GROUND_Y - 48);
        this.obstacles = [];
        this.coins = [];
        this.gameSpeed = this.INITIAL_SPEED;
        this.score = 0;
        this.isGameOver = false;
        this.obstacleTimer = 0;
        this.coinTimer = 0;
        this.updateScoreDisplay();
    }

    start() {
        audioManager.init();
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        if (this.gameoverTimeout) {
            clearTimeout(this.gameoverTimeout);
            this.gameoverTimeout = null;
        }
        
        this.init();
        this.isRunning = true;
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('gameover-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        
        audioManager.playBGM();
        this.gameLoop();
    }

    restart() {
        this.start();
    }

    gameLoop() {
        if (!this.isRunning) {
            this.animationFrameId = null;
            return;
        }
        
        if (!this.isGameOver) {
            this.update();
        }
        this.render();
        
        this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.gameSpeed = Math.min(this.gameSpeed + this.SPEED_INCREMENT, this.MAX_SPEED);
        
        this.player.update();
        
        this.score += 1;
        this.updateScoreDisplay();
        
        this.obstacleTimer++;
        if (this.obstacleTimer >= this.OBSTACLE_INTERVAL / (this.gameSpeed / this.INITIAL_SPEED)) {
            this.spawnObstacle();
            this.obstacleTimer = 0;
        }
        
        this.coinTimer++;
        if (this.coinTimer >= this.COIN_INTERVAL) {
            this.spawnCoin();
            this.coinTimer = 0;
        }
        
        this.obstacles = this.obstacles.filter(obs => {
            obs.update(this.gameSpeed);
            return !obs.isOffScreen();
        });
        
        this.coins = this.coins.filter(coin => {
            coin.update(this.gameSpeed);
            return !coin.isOffScreen() && !coin.collected;
        });
        
        this.backgroundOffset = (this.backgroundOffset + this.gameSpeed * 0.5) % 40;
        
        this.stars.forEach(star => {
            star.twinkle += 0.05;
        });
        
        this.checkCollisions();
    }

    spawnObstacle() {
        const types = ['cactus', 'rock', 'tall'];
        const type = types[Utils.randomInt(0, 2)];
        const obstacle = new Obstacle(this.width + 50, this.GROUND_Y - 48, type);
        this.obstacles.push(obstacle);
    }

    spawnCoin() {
        const x = this.width + 50;
        const y = Utils.randomInt(this.GROUND_Y - 150, this.GROUND_Y - 70);
        const coin = new Coin(x, y);
        this.coins.push(coin);
    }

    checkCollisions() {
        const playerBounds = this.player.getBounds();
        
        for (const obstacle of this.obstacles) {
            if (Utils.checkCollision(playerBounds, obstacle.getBounds())) {
                this.gameOver();
                return;
            }
        }
        
        for (const coin of this.coins) {
            if (!coin.collected && Utils.checkCollision(playerBounds, coin.getBounds())) {
                const points = coin.collect();
                this.score += points;
                this.updateScoreDisplay();
            }
        }
    }

    gameOver() {
        this.isGameOver = true;
        this.isRunning = false;
        this.canRestart = false;
        audioManager.playGameOver();
        
        const highScore = Utils.getHighScore();
        if (this.score > highScore) {
            Utils.setHighScore(this.score);
        }
        
        this.gameoverTimeout = setTimeout(() => {
            document.getElementById('game-screen').classList.add('hidden');
            document.getElementById('gameover-screen').classList.remove('hidden');
            document.getElementById('final-score').textContent = this.score;
            document.getElementById('high-score').textContent = Math.max(this.score, highScore);
            this.isGameOver = false;
            this.canRestart = true;
            this.gameoverTimeout = null;
        }, 500);
    }

    updateScoreDisplay() {
        document.getElementById('score').textContent = this.score;
    }

    render() {
        this.ctx.fillStyle = '#0f0f23';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.renderStars();
        this.renderBackground();
        this.renderGround();
        
        this.coins.forEach(coin => coin.render(this.ctx));
        this.obstacles.forEach(obs => obs.render(this.ctx));
        
        if (this.player) {
            this.player.render(this.ctx);
        }
        
        if (this.isGameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    }

    renderStars() {
        this.stars.forEach(star => {
            const alpha = 0.5 + Math.sin(star.twinkle) * 0.5;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
    }

    renderBackground() {
        this.ctx.fillStyle = '#1a1a3e';
        for (let i = 0; i < 5; i++) {
            const x = (i * 200 - this.backgroundOffset * 0.3) % (this.width + 200) - 100;
            this.drawMountain(x, this.GROUND_Y - 80, 150, 100);
        }
        
        this.ctx.fillStyle = '#252550';
        for (let i = 0; i < 7; i++) {
            const x = (i * 150 - this.backgroundOffset * 0.5) % (this.width + 150) - 75;
            this.drawMountain(x, this.GROUND_Y - 40, 100, 60);
        }
    }

    drawMountain(x, baseY, width, height) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, baseY);
        this.ctx.lineTo(x + width / 2, baseY - height);
        this.ctx.lineTo(x + width, baseY);
        this.ctx.closePath();
        this.ctx.fill();
    }

    renderGround() {
        this.ctx.fillStyle = '#3d3d5c';
        this.ctx.fillRect(0, this.GROUND_Y, this.width, this.height - this.GROUND_Y);
        
        this.ctx.fillStyle = '#4a4a6a';
        this.ctx.fillRect(0, this.GROUND_Y, this.width, 4);
        
        this.ctx.fillStyle = '#2a2a4a';
        for (let i = 0; i < this.width / 40 + 1; i++) {
            const x = i * 40 - this.backgroundOffset;
            this.ctx.fillRect(x, this.GROUND_Y + 10, 20, 2);
            this.ctx.fillRect(x + 10, this.GROUND_Y + 25, 15, 2);
        }
    }
}

window.addEventListener('load', () => {
    const game = new Game();
});
