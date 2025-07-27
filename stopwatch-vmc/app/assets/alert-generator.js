/**
 * GENERADOR DE SONIDO DE ALERTA GRACIOSO
 * Crea sonidos sintéticos usando Web Audio API
 */

class AlertSoundGenerator {
    constructor() {
        this.audioContext = null;
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API no soportado:', e);
        }
    }

    /**
     * Genera un sonido gracioso tipo "Ta-da!"
     */
    playTadaSound() {
        if (!this.audioContext) return;

        const duration = 1.5; // 1.5 segundos
        const gainNode = this.audioContext.createGain();
        gainNode.connect(this.audioContext.destination);

        // Primera nota (Ta)
        this.playNote(440, 0, 0.3, gainNode, 0.8); // A4
        this.playNote(554.37, 0.1, 0.3, gainNode, 0.8); // C#5

        // Segunda nota (da)
        this.playNote(659.25, 0.4, 0.6, gainNode, 1.0); // E5
        this.playNote(880, 0.5, 0.6, gainNode, 0.6); // A5

        // Efecto de reverb
        this.addReverb(gainNode, duration);
    }

    /**
     * Genera un sonido tipo videojuego retro
     */
    playRetroGameSound() {
        if (!this.audioContext) return;

        const gainNode = this.audioContext.createGain();
        gainNode.connect(this.audioContext.destination);

        // Secuencia ascendente
        const frequencies = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        frequencies.forEach((freq, index) => {
            this.playNote(freq, index * 0.1, 0.15, gainNode, 0.7);
        });

        // Nota final larga
        this.playNote(659.25, 0.5, 0.8, gainNode, 0.9); // E5
    }

    /**
     * Genera un sonido cómico tipo "boing"
     */
    playBoingSound() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Configurar frecuencia descendente
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.5);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.8);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 1.2);

        // Envelope de volumen
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.8, this.audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.2);

        oscillator.type = 'sine';
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 1.2);
    }

    /**
     * Toca una nota individual
     */
    playNote(frequency, startTime, duration, destination, volume = 0.5) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        // Envelope ADSR simple
        const now = this.audioContext.currentTime + startTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.05); // Attack
        gainNode.gain.linearRampToValueAtTime(volume * 0.8, now + 0.1); // Decay
        gainNode.gain.setValueAtTime(volume * 0.8, now + duration - 0.1); // Sustain
        gainNode.gain.linearRampToValueAtTime(0, now + duration); // Release

        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    /**
     * Añade efecto de reverb simple
     */
    addReverb(gainNode, duration) {
        // Delay simple para simular reverb
        const delay = this.audioContext.createDelay();
        const feedback = this.audioContext.createGain();
        const delayGain = this.audioContext.createGain();

        delay.delayTime.value = 0.1;
        feedback.gain.value = 0.3;
        delayGain.gain.value = 0.2;

        gainNode.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(this.audioContext.destination);
    }

    /**
     * Sonido aleatorio gracioso
     */
    playRandomFunnySound() {
        const sounds = [
            () => this.playTadaSound(),
            () => this.playRetroGameSound(),
            () => this.playBoingSound()
        ];

        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        randomSound();
    }
}

// Exportar para uso global
window.AlertSoundGenerator = AlertSoundGenerator; 