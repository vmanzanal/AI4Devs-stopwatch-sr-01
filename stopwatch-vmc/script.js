/**
 * RETRO TIMER APPLICATION
 * Cronómetro y Cuenta Regresiva con diseño retro
 * Arquitectura modular con clases ES6
 */

'use strict';

// ============================
// CONSTANTES Y CONFIGURACIÓN
// ============================

const CONFIG = {
    MAX_TIMERS: 3,
    UPDATE_INTERVAL: 100, // 100ms para precisión
    TIME_FORMAT: 'MM:SS.ms',
    AUDIO_VOLUME: 0.7,
    CRITICAL_TIME: 10000, // 10 segundos en ms
    CSV_FILENAME: 'stopwatch-times'
};

// ============================
// CLASE PRINCIPAL - TIMER BASE
// ============================

/**
 * Clase base para todos los tipos de timer
 */
class Timer {
    constructor(id, type) {
        this.id = id;
        this.type = type; // 'stopwatch' | 'countdown'
        this.currentTime = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.startTime = null;
        this.pausedTime = 0;
        this.intervalId = null;
        this.element = null;
        this.createdAt = new Date();
        
        this.onUpdate = null;
        this.onComplete = null;
        this.onStateChange = null;
    }

    /**
     * Formatea el tiempo en formato MM:SS.ms
     * @param {number} timeMs - Tiempo en milisegundos
     * @returns {string} Tiempo formateado
     */
    static formatTime(timeMs) {
        const totalMs = Math.abs(timeMs);
        const minutes = Math.floor(totalMs / 60000);
        const seconds = Math.floor((totalMs % 60000) / 1000);
        const milliseconds = Math.floor((totalMs % 1000) / 10);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }

    /**
     * Inicia o reanuda el timer
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now() - this.pausedTime;
        
        this.intervalId = setInterval(() => {
            this.tick();
        }, CONFIG.UPDATE_INTERVAL);
        
        this.onStateChange?.('running');
    }

    /**
     * Pausa el timer
     */
    pause() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.isPaused = true;
        this.pausedTime = Date.now() - this.startTime;
        
        clearInterval(this.intervalId);
        this.intervalId = null;
        
        this.onStateChange?.('paused');
    }

    /**
     * Resetea el timer
     */
    reset() {
        this.stop();
        this.currentTime = this.type === 'countdown' ? this.initialTime : 0;
        this.pausedTime = 0;
        this.onUpdate?.(this.currentTime);
        this.onStateChange?.('reset');
    }

    /**
     * Detiene completamente el timer
     */
    stop() {
        this.isRunning = false;
        this.isPaused = false;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        this.onStateChange?.('stopped');
    }

    /**
     * Método abstracto para actualizar el timer (debe ser implementado por subclases)
     */
    tick() {
        throw new Error('El método tick() debe ser implementado por la subclase');
    }

    /**
     * Obtiene el estado actual del timer
     */
    getState() {
        return {
            id: this.id,
            type: this.type,
            currentTime: this.currentTime,
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            createdAt: this.createdAt
        };
    }

    /**
     * Limpia recursos del timer
     */
    destroy() {
        this.stop();
        if (this.element) {
            this.element.remove();
        }
    }
}

// ============================
// CLASE CRONÓMETRO
// ============================

/**
 * Cronómetro que cuenta hacia adelante
 */
class Stopwatch extends Timer {
    constructor(id) {
        super(id, 'stopwatch');
        this.currentTime = 0;
    }

    tick() {
        if (!this.isRunning) return;
        
        this.currentTime = Date.now() - this.startTime;
        this.onUpdate?.(this.currentTime);
    }
}

// ============================
// CLASE CUENTA REGRESIVA
// ============================

/**
 * Cuenta regresiva que cuenta hacia atrás
 */
class Countdown extends Timer {
    constructor(id, initialTimeMs) {
        super(id, 'countdown');
        this.initialTime = initialTimeMs;
        this.currentTime = initialTimeMs;
    }

    tick() {
        if (!this.isRunning) return;
        
        const elapsed = Date.now() - this.startTime;
        this.currentTime = Math.max(0, this.initialTime - elapsed);
        
        this.onUpdate?.(this.currentTime);
        
        // Verificar si se completó
        if (this.currentTime <= 0) {
            this.currentTime = 0;
            this.stop();
            this.onComplete?.();
        }
    }

    /**
     * Verifica si está en tiempo crítico (últimos 10 segundos)
     */
    isCritical() {
        return this.currentTime <= CONFIG.CRITICAL_TIME && this.currentTime > 0;
    }
}

// ============================
// SERVICIO DE NOTIFICACIONES
// ============================

/**
 * Maneja notificaciones del navegador y sonidos
 */
class NotificationService {
    constructor() {
        this.audioElement = document.getElementById('alert-sound');
        this.hasPermission = false;
        this.init();
    }

    async init() {
        // Solicitar permisos de notificación
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            this.hasPermission = permission === 'granted';
        }
        
        // Configurar audio
        if (this.audioElement) {
            this.audioElement.volume = CONFIG.AUDIO_VOLUME;
        }
    }

    /**
     * Muestra una notificación del navegador
     */
    showNotification(title, body, icon = '⏰') {
        if (!this.hasPermission) return;
        
        new Notification(title, {
            body,
            icon: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${icon}</text></svg>`,
            tag: 'timer-alert'
        });
    }

    /**
     * Reproduce sonido de alerta
     */
    playAlert() {
        if (this.audioElement) {
            this.audioElement.currentTime = 0;
            this.audioElement.play().catch(e => {
                console.warn('No se pudo reproducir el sonido:', e);
            });
        }
    }

    /**
     * Alerta completa con sonido y notificación
     */
    alert(title, message) {
        this.playAlert();
        this.showNotification(title, message);
    }
}

// ============================
// SERVICIO DE EXPORTACIÓN
// ============================

/**
 * Maneja la exportación de datos a CSV
 */
class ExportService {
    /**
     * Exporta los tiempos de los timers a CSV
     */
    static exportToCSV(timers) {
        const csvHeader = 'Tipo,Tiempo_Inicial,Tiempo_Final,Duracion,Fecha,Hora\n';
        
        const csvRows = timers.map(timer => {
            const state = timer.getState();
            const date = state.createdAt.toLocaleDateString('es-ES');
            const time = state.createdAt.toLocaleTimeString('es-ES');
            
            let initialTime, finalTime, duration;
            
            if (timer.type === 'stopwatch') {
                initialTime = '00:00.00';
                finalTime = Timer.formatTime(state.currentTime);
                duration = Timer.formatTime(state.currentTime);
            } else {
                initialTime = Timer.formatTime(timer.initialTime);
                finalTime = Timer.formatTime(state.currentTime);
                duration = Timer.formatTime(timer.initialTime - state.currentTime);
            }
            
            return `${timer.type === 'stopwatch' ? 'Cronómetro' : 'Cuenta_Regresiva'},${initialTime},${finalTime},${duration},${date},${time}`;
        }).join('\n');
        
        const csvContent = csvHeader + csvRows;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // Crear enlace de descarga
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${CONFIG.CSV_FILENAME}-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// ============================
// GESTOR PRINCIPAL DE TIMERS
// ============================

/**
 * Administra todos los timers de la aplicación
 */
class TimerManager {
    constructor() {
        this.timers = new Map();
        this.nextId = 1;
        this.notificationService = new NotificationService();
        
        // Referencias DOM
        this.timersContainer = document.getElementById('timers-container');
        this.emptyState = document.getElementById('empty-state');
        this.timerCount = document.getElementById('timer-count');
        this.addStopwatchBtn = document.getElementById('add-stopwatch');
        this.addCountdownBtn = document.getElementById('add-countdown');
        this.exportBtn = document.getElementById('export-times');
        this.countdownModal = document.getElementById('countdown-modal');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        // Botones principales
        this.addStopwatchBtn?.addEventListener('click', () => this.createStopwatch());
        this.addCountdownBtn?.addEventListener('click', () => this.showCountdownModal());
        this.exportBtn?.addEventListener('click', () => this.exportTimes());
        
        // Modal de cuenta regresiva
        document.getElementById('close-modal')?.addEventListener('click', () => this.hideCountdownModal());
        document.getElementById('cancel-countdown')?.addEventListener('click', () => this.hideCountdownModal());
        document.getElementById('create-countdown')?.addEventListener('click', () => this.createCountdownFromModal());
        
        // Cerrar modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideCountdownModal();
            }
        });
    }

    /**
     * Crea un nuevo cronómetro
     */
    createStopwatch() {
        if (this.timers.size >= CONFIG.MAX_TIMERS) return;
        
        const id = this.nextId++;
        const stopwatch = new Stopwatch(id);
        
        this.setupTimer(stopwatch);
        this.timers.set(id, stopwatch);
        this.renderTimer(stopwatch);
        this.updateUI();
    }

    /**
     * Muestra el modal para configurar cuenta regresiva
     */
    showCountdownModal() {
        if (this.timers.size >= CONFIG.MAX_TIMERS) return;
        
        this.countdownModal?.classList.remove('hidden');
        document.getElementById('countdown-minutes')?.focus();
    }

    /**
     * Oculta el modal de cuenta regresiva
     */
    hideCountdownModal() {
        this.countdownModal?.classList.add('hidden');
    }

    /**
     * Crea cuenta regresiva desde el modal
     */
    createCountdownFromModal() {
        const minutes = parseInt(document.getElementById('countdown-minutes')?.value || '0');
        const seconds = parseInt(document.getElementById('countdown-seconds')?.value || '0');
        
        if (minutes === 0 && seconds === 0) {
            alert('Por favor, ingresa un tiempo válido');
            return;
        }
        
        const totalMs = (minutes * 60 + seconds) * 1000;
        this.createCountdown(totalMs);
        this.hideCountdownModal();
    }

    /**
     * Crea una nueva cuenta regresiva
     */
    createCountdown(initialTimeMs) {
        if (this.timers.size >= CONFIG.MAX_TIMERS) return;
        
        const id = this.nextId++;
        const countdown = new Countdown(id, initialTimeMs);
        
        this.setupTimer(countdown);
        this.timers.set(id, countdown);
        this.renderTimer(countdown);
        this.updateUI();
    }

    /**
     * Configura eventos y callbacks del timer
     */
    setupTimer(timer) {
        timer.onUpdate = (time) => {
            this.updateTimerDisplay(timer, time);
        };
        
        timer.onComplete = () => {
            this.handleTimerComplete(timer);
        };
        
        timer.onStateChange = (state) => {
            this.updateTimerState(timer, state);
        };
    }

    /**
     * Renderiza un timer en el DOM
     */
    renderTimer(timer) {
        const timerElement = this.createTimerElement(timer);
        timer.element = timerElement;
        this.timersContainer?.appendChild(timerElement);
    }

    /**
     * Crea el elemento DOM para un timer
     */
    createTimerElement(timer) {
        const div = document.createElement('div');
        div.className = 'timer-card';
        div.dataset.timerId = timer.id;
        
        const title = timer.type === 'stopwatch' ? 'Cronómetro' : 'Cuenta Regresiva';
        const displayClass = timer.type === 'countdown' ? 'countdown' : '';
        const titleClass = timer.type === 'countdown' ? 'countdown' : '';
        
        div.innerHTML = `
            <div class="timer-header">
                <h3 class="timer-title ${titleClass}">${title} ${timer.id}</h3>
                <button class="timer-close" onclick="app.removeTimer(${timer.id})">✖</button>
            </div>
            <div class="timer-display ${displayClass}" id="display-${timer.id}">
                ${Timer.formatTime(timer.currentTime)}
            </div>
            <div class="timer-controls">
                <button class="timer-btn start" onclick="app.startTimer(${timer.id})">Start</button>
                <button class="timer-btn pause" onclick="app.pauseTimer(${timer.id})" disabled>Pause</button>
                <button class="timer-btn reset" onclick="app.resetTimer(${timer.id})">Reset</button>
            </div>
        `;
        
        return div;
    }

    // Métodos públicos para controlar timers (continuará en la siguiente parte...)
    
    startTimer(id) {
        const timer = this.timers.get(id);
        if (timer) {
            timer.start();
        }
    }

    pauseTimer(id) {
        const timer = this.timers.get(id);
        if (timer) {
            timer.pause();
        }
    }

    resetTimer(id) {
        const timer = this.timers.get(id);
        if (timer) {
            timer.reset();
        }
    }

    removeTimer(id) {
        const timer = this.timers.get(id);
        if (timer) {
            timer.destroy();
            this.timers.delete(id);
            this.updateUI();
        }
    }

    /**
     * Actualiza la visualización del tiempo en un timer
     */
    updateTimerDisplay(timer, time) {
        const display = document.getElementById(`display-${timer.id}`);
        if (display) {
            display.textContent = Timer.formatTime(time);
            
            // Efectos visuales para cuenta regresiva
            if (timer.type === 'countdown') {
                display.classList.toggle('warning', timer.isCritical());
            }
        }
    }

    /**
     * Maneja la finalización de un timer
     */
    handleTimerComplete(timer) {
        const display = document.getElementById(`display-${timer.id}`);
        if (display) {
            display.classList.add('completed');
        }
        
        this.notificationService.alert(
            '⏰ Tiempo Completado!',
            `La cuenta regresiva ${timer.id} ha terminado`
        );
        
        this.updateTimerState(timer, 'completed');
    }

    /**
     * Actualiza el estado visual de un timer
     */
    updateTimerState(timer, state) {
        const timerElement = timer.element;
        if (!timerElement) return;
        
        const startBtn = timerElement.querySelector('.timer-btn.start');
        const pauseBtn = timerElement.querySelector('.timer-btn.pause');
        const resetBtn = timerElement.querySelector('.timer-btn.reset');
        
        // Resetear estados
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = false;
        
        startBtn.textContent = 'Start';
        
        switch (state) {
            case 'running':
                startBtn.disabled = true;
                pauseBtn.disabled = false;
                break;
                
            case 'paused':
                startBtn.textContent = 'Resume';
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                break;
                
            case 'completed':
                startBtn.disabled = true;
                pauseBtn.disabled = true;
                break;
        }
    }

    /**
     * Exporta tiempos a CSV
     */
    exportTimes() {
        if (this.timers.size === 0) {
            alert('No hay timers para exportar');
            return;
        }
        
        const timersArray = Array.from(this.timers.values());
        ExportService.exportToCSV(timersArray);
    }

    /**
     * Actualiza la UI general de la aplicación
     */
    updateUI() {
        const timerCount = this.timers.size;
        const maxReached = timerCount >= CONFIG.MAX_TIMERS;
        
        // Actualizar contador
        if (this.timerCount) {
            this.timerCount.textContent = timerCount;
        }
        
        // Habilitar/deshabilitar botones
        if (this.addStopwatchBtn) {
            this.addStopwatchBtn.disabled = maxReached;
        }
        if (this.addCountdownBtn) {
            this.addCountdownBtn.disabled = maxReached;
        }
        if (this.exportBtn) {
            this.exportBtn.disabled = timerCount === 0;
        }
        
        // Mostrar/ocultar estado vacío
        if (this.emptyState) {
            this.emptyState.classList.toggle('hidden', timerCount > 0);
        }
    }
}

// ============================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================

/**
 * Instancia global de la aplicación
 */
let app;

/**
 * Inicializa la aplicación cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {
    app = new TimerManager();
    
    // Habilitar botones inicialmente
    document.getElementById('add-stopwatch').disabled = false;
    document.getElementById('add-countdown').disabled = false;
    document.getElementById('export-times').disabled = true;
    
    console.log('🕰️ Retro Timer Application initialized');
});

// ============================
// UTILIDADES GLOBALES
// ============================

/**
 * Función de utilidad para debug en consola
 */
window.debugTimers = () => {
    if (app) {
        console.table(Array.from(app.timers.values()).map(t => t.getState()));
    }
};

/**
 * Manejo de errores globales
 */
window.addEventListener('error', (e) => {
    console.error('Error en la aplicación:', e.error);
});

/**
 * Cleanup al cerrar la página
 */
window.addEventListener('beforeunload', () => {
    if (app) {
        app.timers.forEach(timer => timer.destroy());
    }
});
