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
        this.soundGenerator = new AlertSoundGenerator();
        this.hasPermission = false;
        this.init();
    }

    async init() {
        // Solicitar permisos de notificación
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            this.hasPermission = permission === 'granted';
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
     * Reproduce sonido de alerta gracioso
     */
    playAlert() {
        try {
            this.soundGenerator.playRandomFunnySound();
        } catch (e) {
            console.warn('No se pudo reproducir el sonido:', e);
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
// GESTOR DE TEMAS AVANZADO
// ============================

/**
 * Maneja los temas visuales de la aplicación
 */
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.themes = ['dark', 'light', 'gaming', 'matrix', 'ocean', 'sunset'];
        this.loadTheme();
        this.initThemeSelector();
    }

    loadTheme() {
        try {
            const saved = localStorage.getItem('retro-timer-theme');
            if (saved && this.themes.includes(saved)) {
                this.currentTheme = saved;
            }
        } catch (e) {
            console.warn('No se pudo cargar el tema:', e);
        }
        this.applyTheme(this.currentTheme);
    }

    saveTheme() {
        try {
            localStorage.setItem('retro-timer-theme', this.currentTheme);
        } catch (e) {
            console.warn('No se pudo guardar el tema:', e);
        }
    }

    applyTheme(themeName) {
        if (!this.themes.includes(themeName)) return;

        // Remover todos los temas
        document.body.classList.remove(...this.themes.map(t => `${t}-theme`));
        
        // Aplicar nuevo tema
        if (themeName !== 'dark') {
            document.body.classList.add(`${themeName}-theme`);
        }

        this.currentTheme = themeName;
        this.saveTheme();
        this.updateThemeSelector();

        // Regenerar partículas con el nuevo tema
        if (window.particleSystem) {
            window.particleSystem.updateTheme();
        }
    }

    initThemeSelector() {
        const buttons = document.querySelectorAll('.theme-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = btn.classList[1]; // dark, light, gaming, etc.
                this.applyTheme(theme);
            });
        });
    }

    updateThemeSelector() {
        const buttons = document.querySelectorAll('.theme-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.classList.contains(this.currentTheme)) {
                btn.classList.add('active');
            }
        });
    }

    getNextTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        return this.themes[nextIndex];
    }

    cycleTheme() {
        const nextTheme = this.getNextTheme();
        this.applyTheme(nextTheme);
    }
}

// ============================
// SISTEMA DE PARTÍCULAS
// ============================

/**
 * Sistema de partículas de fondo
 */
class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particles-container');
        this.particles = [];
        this.maxParticles = 50;
        this.animationId = null;
        this.init();
    }

    init() {
        if (!this.container) return;
        
        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posición aleatoria
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';
        
        // Tamaño aleatorio
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        this.container.appendChild(particle);
        this.particles.push(particle);

        // Remover cuando termine la animación
        particle.addEventListener('animationend', () => {
            if (particle.parentNode) {
                particle.remove();
                const index = this.particles.indexOf(particle);
                if (index > -1) {
                    this.particles.splice(index, 1);
                }
                // Crear nueva partícula
                this.createParticle();
            }
        });
    }

    updateTheme() {
        // Las partículas ya usan variables CSS que se actualizan automáticamente
        this.particles.forEach(particle => {
            particle.style.background = 'var(--theme-primary)';
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.particles.forEach(particle => particle.remove());
        this.particles = [];
    }

    animate() {
        // El sistema se auto-mantiene con CSS animations
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// ============================
// GESTOR DE ANIMACIONES
// ============================

/**
 * Maneja animaciones y efectos visuales avanzados
 */
class AnimationManager {
    constructor() {
        this.setupRippleEffects();
        this.setupCountingAnimations();
    }

    setupRippleEffects() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('ripple-effect')) {
                this.createRipple(e);
            }
        });
    }

    createRipple(e) {
        const button = e.target;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        button.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }

    setupCountingAnimations() {
        // Observador para detectar cambios en displays de tiempo
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const display = mutation.target.closest('.timer-display');
                    if (display && !display.classList.contains('counting-animation')) {
                        display.classList.add('counting-animation');
                        setTimeout(() => {
                            display.classList.remove('counting-animation');
                        }, 100);
                    }
                }
            });
        });

        // Observar todos los displays existentes y futuros
        const observeDisplays = () => {
            document.querySelectorAll('.timer-display').forEach(display => {
                observer.observe(display, {
                    childList: true,
                    characterData: true,
                    subtree: true
                });
            });
        };

        observeDisplays();
        
        // Re-observar cuando se añaden nuevos timers
        const timerObserver = new MutationObserver(observeDisplays);
        const container = document.getElementById('timers-container');
        if (container) {
            timerObserver.observe(container, { childList: true });
        }
    }

    animateSuccess(element) {
        element.classList.add('success-animation');
        setTimeout(() => {
            element.classList.remove('success-animation');
        }, 600);
    }

    animateLoading(element, duration = 1500) {
        element.classList.add('loading-animation');
        setTimeout(() => {
            element.classList.remove('loading-animation');
        }, duration);
    }

    animateSoftBlink(element, duration = 3000) {
        element.classList.add('soft-blink');
        setTimeout(() => {
            element.classList.remove('soft-blink');
        }, duration);
    }

    createFloatingNumber(value, startElement) {
        const floating = document.createElement('div');
        floating.textContent = value;
        floating.style.cssText = `
            position: absolute;
            font-family: var(--font-display);
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--theme-primary);
            pointer-events: none;
            z-index: 1000;
            text-shadow: 0 0 10px currentColor;
            animation: floatUp 2s ease-out forwards;
        `;

        const rect = startElement.getBoundingClientRect();
        floating.style.left = (rect.left + rect.width / 2) + 'px';
        floating.style.top = rect.top + 'px';

        document.body.appendChild(floating);

        // CSS para la animación
        if (!document.getElementById('float-animation-style')) {
            const style = document.createElement('style');
            style.id = 'float-animation-style';
            style.textContent = `
                @keyframes floatUp {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100px) scale(0.5);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => floating.remove(), 2000);
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
        this.keyboardManager = new KeyboardManager(this);
        this.statsManager = new StatsManager();
        this.settingsManager = new SettingsManager();
        this.themeManager = new ThemeManager();
        this.animationManager = new AnimationManager();
        
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
        this.settingsManager.applySettings();
        this.setupHelpSystem();
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
                this.hideStatsPanel();
            }
        });

        // Panel de estadísticas
        document.getElementById('help-button')?.addEventListener('click', () => this.showStatsPanel());
        document.getElementById('close-stats')?.addEventListener('click', () => this.hideStatsPanel());
        document.getElementById('clear-stats')?.addEventListener('click', () => this.clearStats());
        document.getElementById('export-stats')?.addEventListener('click', () => this.exportStats());

        // Mostrar/ocultar atajos de teclado
        let keyboardHintsTimeout;
        document.addEventListener('keydown', () => {
            const hints = document.getElementById('keyboard-hints');
            if (hints && !hints.classList.contains('visible')) {
                hints.classList.add('visible');
                clearTimeout(keyboardHintsTimeout);
                keyboardHintsTimeout = setTimeout(() => {
                    hints.classList.remove('visible');
                }, 3000);
            }
        });
    }

    /**
     * Configura el sistema de ayuda
     */
    setupHelpSystem() {
        // Mostrar ayuda inicial después de 3 segundos
        setTimeout(() => {
            if (this.timers.size === 0) {
                this.showToast('Presiona ? para ver ayuda y estadísticas', 'info');
            }
        }, 3000);
    }

    /**
     * Crea un nuevo cronómetro
     */
    createStopwatch() {
        if (this.timers.size >= CONFIG.MAX_TIMERS) {
            this.showToast('Máximo de timers alcanzado', 'error');
            return;
        }
        
        const id = this.nextId++;
        const stopwatch = new Stopwatch(id);
        
        this.setupTimer(stopwatch);
        this.timers.set(id, stopwatch);
        this.renderTimer(stopwatch);
        this.updateUI();

        // Animación de éxito
        this.animationManager.animateSuccess(this.addStopwatchBtn);
        this.showToast(`Cronómetro ${id} creado`, 'success');
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
        if (this.timers.size >= CONFIG.MAX_TIMERS) {
            this.showToast('Máximo de timers alcanzado', 'error');
            return;
        }
        
        const id = this.nextId++;
        const countdown = new Countdown(id, initialTimeMs);
        
        this.setupTimer(countdown);
        this.timers.set(id, countdown);
        this.renderTimer(countdown);
        this.updateUI();

        // Animación de éxito
        this.animationManager.animateSuccess(this.addCountdownBtn);
        this.showToast(`Cuenta regresiva ${id} creada`, 'success');
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
                <div class="timer-status" id="status-${timer.id}"></div>
                <button class="timer-close" onclick="app.removeTimer(${timer.id})">✖</button>
            </div>
            <div class="timer-display ${displayClass}" id="display-${timer.id}" ondblclick="app.toggleFullscreen(${timer.id})">
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
            // Registrar estadísticas antes de eliminar
            this.statsManager.recordTimer(timer);
            
            timer.destroy();
            this.timers.delete(id);
            this.updateUI();
            
            // Mostrar mensaje de confirmación
            this.showToast(`Timer ${id} eliminado`);
        }
    }

    /**
     * Muestra un mensaje toast temporal
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            background: type === 'success' ? '#00ff00' : 
                       type === 'error' ? '#ff0040' : '#ffa500',
            color: '#000',
            borderRadius: '8px',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease',
            fontFamily: 'var(--font-controls)',
            fontWeight: '600'
        });
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
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
        const statusIndicator = document.getElementById(`status-${timer.id}`);
        
        // Actualizar indicador de estado
        if (statusIndicator) {
            statusIndicator.className = `timer-status ${state}`;
        }
        
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
     * Alterna modo pantalla completa para un timer
     */
    toggleFullscreen(id) {
        const timer = this.timers.get(id);
        if (!timer || !timer.element) return;

        const existing = document.querySelector('.timer-fullscreen');
        if (existing) {
            existing.remove();
            return;
        }

        const fullscreenDiv = document.createElement('div');
        fullscreenDiv.className = 'timer-fullscreen';
        fullscreenDiv.innerHTML = `
            <h2>${timer.type === 'stopwatch' ? 'Cronómetro' : 'Cuenta Regresiva'} ${timer.id}</h2>
            <div class="timer-display ${timer.type === 'countdown' ? 'countdown' : ''}" id="fullscreen-display-${timer.id}">
                ${Timer.formatTime(timer.currentTime)}
            </div>
            <div class="timer-controls">
                <button class="timer-btn start" onclick="app.startTimer(${timer.id}); app.updateFullscreenControls(${timer.id})">Start</button>
                <button class="timer-btn pause" onclick="app.pauseTimer(${timer.id}); app.updateFullscreenControls(${timer.id})" disabled>Pause</button>
                <button class="timer-btn reset" onclick="app.resetTimer(${timer.id}); app.updateFullscreenControls(${timer.id})">Reset</button>
                <button class="timer-btn" onclick="document.querySelector('.timer-fullscreen').remove()" style="border-color: var(--neon-red); color: var(--neon-red);">Salir</button>
            </div>
        `;

        document.body.appendChild(fullscreenDiv);
        this.updateFullscreenControls(id);

        // Actualizar display en tiempo real
        timer.onUpdate = (time) => {
            this.updateTimerDisplay(timer, time);
            const fullscreenDisplay = document.getElementById(`fullscreen-display-${timer.id}`);
            if (fullscreenDisplay) {
                fullscreenDisplay.textContent = Timer.formatTime(time);
                if (timer.type === 'countdown') {
                    fullscreenDisplay.classList.toggle('warning', timer.isCritical());
                }
            }
        };
    }

    /**
     * Actualiza controles en modo pantalla completa
     */
    updateFullscreenControls(id) {
        const timer = this.timers.get(id);
        const fullscreen = document.querySelector('.timer-fullscreen');
        if (!timer || !fullscreen) return;

        const startBtn = fullscreen.querySelector('.timer-btn.start');
        const pauseBtn = fullscreen.querySelector('.timer-btn.pause');

        if (timer.isRunning) {
            startBtn.disabled = true;
            pauseBtn.disabled = false;
        } else {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            startBtn.textContent = timer.isPaused ? 'Resume' : 'Start';
        }
    }

    /**
     * Exporta tiempos a CSV
     */
    exportTimes() {
        if (this.timers.size === 0) {
            this.showToast('No hay timers para exportar', 'error');
            return;
        }
        
        // Animación de loading
        this.animationManager.animateLoading(this.exportBtn, 1000);
        
        setTimeout(() => {
            const timersArray = Array.from(this.timers.values());
            ExportService.exportToCSV(timersArray);
            this.showToast(`${timersArray.length} timers exportados`, 'success');
        }, 500);
    }

    /**
     * Actualiza la UI general de la aplicación
     */
    updateUI() {
        const timerCount = this.timers.size;
        const maxReached = timerCount >= CONFIG.MAX_TIMERS;
        
        // Actualizar contador con animación
        if (this.timerCount) {
            const oldCount = this.timerCount.textContent;
            this.timerCount.textContent = timerCount;
            
            if (oldCount !== timerCount.toString()) {
                this.animationManager.createFloatingNumber(
                    timerCount > oldCount ? '+1' : '-1',
                    this.timerCount
                );
            }
        }
        
        // Habilitar/deshabilitar botones con feedback visual
        if (this.addStopwatchBtn) {
            const wasDisabled = this.addStopwatchBtn.disabled;
            this.addStopwatchBtn.disabled = maxReached;
            
            if (maxReached && !wasDisabled) {
                this.animationManager.animateSoftBlink(this.addStopwatchBtn, 1000);
            }
        }
        
        if (this.addCountdownBtn) {
            const wasDisabled = this.addCountdownBtn.disabled;
            this.addCountdownBtn.disabled = maxReached;
            
            if (maxReached && !wasDisabled) {
                this.animationManager.animateSoftBlink(this.addCountdownBtn, 1000);
            }
        }
        
        if (this.exportBtn) {
            this.exportBtn.disabled = timerCount === 0;
        }
        
        // Mostrar/ocultar estado vacío con animación
        if (this.emptyState) {
            this.emptyState.classList.toggle('hidden', timerCount > 0);
        }
    }

    /**
     * Muestra el panel de estadísticas
     */
    showStatsPanel() {
        const panel = document.getElementById('stats-panel');
        if (!panel) return;

        const stats = this.statsManager.getStats();
        
        document.getElementById('total-stopwatches').textContent = stats.totalStopwatches;
        document.getElementById('total-countdowns').textContent = stats.totalCountdowns;
        document.getElementById('total-time').textContent = Timer.formatTime(stats.totalTime);
        document.getElementById('longest-session').textContent = Timer.formatTime(stats.longestSession);

        panel.classList.remove('hidden');
    }

    /**
     * Oculta el panel de estadísticas
     */
    hideStatsPanel() {
        const panel = document.getElementById('stats-panel');
        if (panel) {
            panel.classList.add('hidden');
        }
    }

    /**
     * Limpia las estadísticas
     */
    clearStats() {
        if (confirm('¿Estás seguro de que quieres limpiar todas las estadísticas?')) {
            this.statsManager.clearStats();
            this.showStatsPanel(); // Refrescar vista
            this.showToast('Estadísticas limpiadas', 'success');
        }
    }

    /**
     * Exporta las estadísticas
     */
    exportStats() {
        const stats = this.statsManager.getStats();
        const csvContent = `Estadística,Valor
Cronómetros Totales,${stats.totalStopwatches}
Cuentas Regresivas Totales,${stats.totalCountdowns}
Tiempo Total,${Timer.formatTime(stats.totalTime)}
Sesión Más Larga,${Timer.formatTime(stats.longestSession)}
Tiempo Promedio,${Timer.formatTime(stats.averageTime)}
Total de Sesiones,${stats.totalSessions}`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `retro-timer-stats-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('Estadísticas exportadas', 'success');
    }

    /**
     * Cambia el tema de la aplicación
     */
    changeTheme(themeName) {
        this.themeManager.applyTheme(themeName);
        this.showToast(`Tema ${themeName} aplicado`, 'success');
    }
}

// ============================
// GESTOR DE ATAJOS DE TECLADO
// ============================

/**
 * Maneja atajos de teclado para la aplicación
 */
class KeyboardManager {
    constructor(timerManager) {
        this.timerManager = timerManager;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            // Solo procesar atajos si no estamos escribiendo en un input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            switch (e.key.toLowerCase()) {
                case 's':
                    e.preventDefault();
                    this.timerManager.createStopwatch();
                    break;
                case 'c':
                    e.preventDefault();
                    this.timerManager.showCountdownModal();
                    break;
                case 'e':
                    e.preventDefault();
                    this.timerManager.exportTimes();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleLastTimer();
                    break;
                case 'r':
                    e.preventDefault();
                    this.resetAllTimers();
                    break;
                case 'delete':
                case 'backspace':
                    e.preventDefault();
                    this.removeLastTimer();
                    break;
            }
        });
    }

    toggleLastTimer() {
        const timers = Array.from(this.timerManager.timers.values());
        if (timers.length === 0) return;
        
        const lastTimer = timers[timers.length - 1];
        if (lastTimer.isRunning) {
            this.timerManager.pauseTimer(lastTimer.id);
        } else {
            this.timerManager.startTimer(lastTimer.id);
        }
    }

    resetAllTimers() {
        this.timerManager.timers.forEach(timer => {
            this.timerManager.resetTimer(timer.id);
        });
    }

    removeLastTimer() {
        const timers = Array.from(this.timerManager.timers.values());
        if (timers.length === 0) return;
        
        const lastTimer = timers[timers.length - 1];
        this.timerManager.removeTimer(lastTimer.id);
    }
}

// ============================
// GESTOR DE ESTADÍSTICAS
// ============================

/**
 * Calcula y muestra estadísticas de uso
 */
class StatsManager {
    constructor() {
        this.stats = {
            totalStopwatches: 0,
            totalCountdowns: 0,
            totalTime: 0,
            longestSession: 0,
            sessions: []
        };
        this.loadStats();
    }

    loadStats() {
        try {
            const saved = localStorage.getItem('retro-timer-stats');
            if (saved) {
                this.stats = { ...this.stats, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('No se pudieron cargar las estadísticas:', e);
        }
    }

    saveStats() {
        try {
            localStorage.setItem('retro-timer-stats', JSON.stringify(this.stats));
        } catch (e) {
            console.warn('No se pudieron guardar las estadísticas:', e);
        }
    }

    recordTimer(timer) {
        const session = {
            type: timer.type,
            duration: timer.currentTime,
            date: new Date().toISOString()
        };

        this.stats.sessions.push(session);
        
        if (timer.type === 'stopwatch') {
            this.stats.totalStopwatches++;
            this.stats.totalTime += timer.currentTime;
            if (timer.currentTime > this.stats.longestSession) {
                this.stats.longestSession = timer.currentTime;
            }
        } else {
            this.stats.totalCountdowns++;
        }

        this.saveStats();
    }

    getStats() {
        return {
            ...this.stats,
            averageTime: this.stats.totalStopwatches > 0 ? 
                this.stats.totalTime / this.stats.totalStopwatches : 0,
            totalSessions: this.stats.sessions.length
        };
    }

    clearStats() {
        this.stats = {
            totalStopwatches: 0,
            totalCountdowns: 0,
            totalTime: 0,
            longestSession: 0,
            sessions: []
        };
        this.saveStats();
    }
}

// ============================
// GESTOR DE CONFIGURACIÓN
// ============================

/**
 * Maneja la configuración de la aplicación
 */
class SettingsManager {
    constructor() {
        this.settings = {
            theme: 'dark',
            soundEnabled: true,
            notificationsEnabled: true,
            autoExport: false,
            precision: 100 // ms
        };
        this.loadSettings();
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('retro-timer-settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('No se pudieron cargar las configuraciones:', e);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('retro-timer-settings', JSON.stringify(this.settings));
        } catch (e) {
            console.warn('No se pudieron guardar las configuraciones:', e);
        }
    }

    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        this.applySettings();
    }

    applySettings() {
        // Aplicar tema
        document.body.classList.toggle('light-theme', this.settings.theme === 'light');
        
        // Actualizar configuración global
        CONFIG.UPDATE_INTERVAL = this.settings.precision;
    }

    getSettings() {
        return { ...this.settings };
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
    
    // Inicializar sistema de partículas
    window.particleSystem = new ParticleSystem();
    
    // Habilitar botones inicialmente
    document.getElementById('add-stopwatch').disabled = false;
    document.getElementById('add-countdown').disabled = false;
    document.getElementById('export-times').disabled = true;
    
    // Añadir atajo de teclado para cambiar tema
    document.addEventListener('keydown', (e) => {
        if (e.key === 't' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            app.themeManager.cycleTheme();
        }
    });
    
    console.log('🎨 Retro Timer Application initialized with advanced UI');
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
