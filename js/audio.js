class AudioManager {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
        this.bgmOscillators = [];
        this.bgmGain = null;
        this.isPlayingBGM = false;
        this.bgmTimeout = null;
    }

    init() {
        if (this.initialized) return;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    playTone(frequency, duration, type = 'square', volume = 0.3) {
        if (!this.initialized || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playJump() {
        this.playTone(400, 0.1, 'square', 0.2);
        setTimeout(() => this.playTone(600, 0.1, 'square', 0.15), 50);
    }

    playCoin() {
        this.playTone(800, 0.1, 'square', 0.2);
        setTimeout(() => this.playTone(1000, 0.1, 'square', 0.15), 80);
        setTimeout(() => this.playTone(1200, 0.15, 'square', 0.1), 160);
    }

    playGameOver() {
        this.stopBGM();
        this.playTone(400, 0.2, 'square', 0.3);
        setTimeout(() => this.playTone(300, 0.2, 'square', 0.25), 200);
        setTimeout(() => this.playTone(200, 0.4, 'square', 0.2), 400);
    }

    playBGM() {
        if (!this.initialized || !this.audioContext) return;
        
        this.stopBGM();
        
        this.isPlayingBGM = true;
        this.bgmGain = this.audioContext.createGain();
        this.bgmGain.gain.setValueAtTime(0.08, this.audioContext.currentTime);
        this.bgmGain.connect(this.audioContext.destination);
        
        const notes = [262, 330, 392, 330, 262, 330, 392, 523];
        let noteIndex = 0;
        
        const playNote = () => {
            if (!this.isPlayingBGM) return;
            
            const osc = this.audioContext.createOscillator();
            osc.type = 'square';
            osc.frequency.setValueAtTime(notes[noteIndex], this.audioContext.currentTime);
            osc.connect(this.bgmGain);
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.15);
            
            noteIndex = (noteIndex + 1) % notes.length;
            this.bgmTimeout = setTimeout(playNote, 200);
        };
        
        playNote();
    }

    stopBGM() {
        this.isPlayingBGM = false;
        if (this.bgmTimeout) {
            clearTimeout(this.bgmTimeout);
            this.bgmTimeout = null;
        }
        if (this.bgmGain) {
            try {
                this.bgmGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            } catch (e) {}
            this.bgmGain = null;
        }
    }
}

const audioManager = new AudioManager();
