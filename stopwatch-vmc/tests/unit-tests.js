/**
 * RETRO TIMER - TESTS UNITARIOS
 * Tests completos para todas las clases y funcionalidades
 */

// Framework de testing simple y ligero
class TestFramework {
    constructor() {
        this.tests = [];
        this.results = { passed: 0, failed: 0 };
    }

    describe(description, testFn) {
        console.group(`📋 ${description}`);
        testFn();
        console.groupEnd();
    }

    test(description, testFn) {
        try {
            testFn();
            this.results.passed++;
            console.log(`✅ ${description}`);
        } catch (error) {
            this.results.failed++;
            console.error(`❌ ${description}`);
            console.error(`   Error: ${error.message}`);
        }
    }

    expect(actual) {
        return {
            toBe: (expected) => {
                if (actual !== expected) {
                    throw new Error(`Expected ${expected}, got ${actual}`);
                }
            },
            toEqual: (expected) => {
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
                }
            },
            toBeGreaterThan: (expected) => {
                if (actual <= expected) {
                    throw new Error(`Expected ${actual} to be greater than ${expected}`);
                }
            },
            toBeLessThan: (expected) => {
                if (actual >= expected) {
                    throw new Error(`Expected ${actual} to be less than ${expected}`);
                }
            },
            toContain: (expected) => {
                if (!actual.includes(expected)) {
                    throw new Error(`Expected ${actual} to contain ${expected}`);
                }
            },
            toBeTruthy: () => {
                if (!actual) {
                    throw new Error(`Expected ${actual} to be truthy`);
                }
            },
            toBeFalsy: () => {
                if (actual) {
                    throw new Error(`Expected ${actual} to be falsy`);
                }
            }
        };
    }

    runAll() {
        console.clear();
        console.log('🧪 INICIANDO TESTS UNITARIOS - RETRO TIMER\n');
        
        this.testTimerFormatting();
        this.testStopwatchClass();
        this.testCountdownClass();
        this.testNotificationService();
        this.testExportService();
        this.testThemeManager();
        this.testStatsManager();
        this.testSettingsManager();
        
        this.showResults();
    }

    testTimerFormatting() {
        this.describe('Timer.formatTime()', () => {
            this.test('formatea 0ms correctamente', () => {
                this.expect(Timer.formatTime(0)).toBe('00:00.00');
            });

            this.test('formatea segundos correctamente', () => {
                this.expect(Timer.formatTime(1000)).toBe('00:01.00');
                this.expect(Timer.formatTime(30000)).toBe('00:30.00');
                this.expect(Timer.formatTime(59000)).toBe('00:59.00');
            });

            this.test('formatea minutos correctamente', () => {
                this.expect(Timer.formatTime(60000)).toBe('01:00.00');
                this.expect(Timer.formatTime(150000)).toBe('02:30.00');
                this.expect(Timer.formatTime(3600000)).toBe('60:00.00');
            });

            this.test('formatea milisegundos correctamente', () => {
                this.expect(Timer.formatTime(100)).toBe('00:00.10');
                this.expect(Timer.formatTime(500)).toBe('00:00.50');
                this.expect(Timer.formatTime(990)).toBe('00:00.99');
            });

            this.test('formatea tiempos complejos correctamente', () => {
                this.expect(Timer.formatTime(61500)).toBe('01:01.50');
                this.expect(Timer.formatTime(3661500)).toBe('61:01.50');
            });

            this.test('maneja tiempos negativos', () => {
                this.expect(Timer.formatTime(-1000)).toBe('00:01.00');
            });
        });
    }

    testStopwatchClass() {
        this.describe('Clase Stopwatch', () => {
            this.test('se inicializa correctamente', () => {
                const stopwatch = new Stopwatch(1);
                this.expect(stopwatch.id).toBe(1);
                this.expect(stopwatch.type).toBe('stopwatch');
                this.expect(stopwatch.currentTime).toBe(0);
                this.expect(stopwatch.isRunning).toBeFalsy();
                this.expect(stopwatch.isPaused).toBeFalsy();
            });

            this.test('getState() devuelve información correcta', () => {
                const stopwatch = new Stopwatch(5);
                const state = stopwatch.getState();
                
                this.expect(state.id).toBe(5);
                this.expect(state.type).toBe('stopwatch');
                this.expect(state.currentTime).toBe(0);
                this.expect(state.isRunning).toBeFalsy();
                this.expect(state.isPaused).toBeFalsy();
            });

            this.test('cambios de estado funcionan correctamente', () => {
                const stopwatch = new Stopwatch(1);
                
                // Test start
                stopwatch.start();
                this.expect(stopwatch.isRunning).toBeTruthy();
                this.expect(stopwatch.isPaused).toBeFalsy();
                
                // Test pause
                stopwatch.pause();
                this.expect(stopwatch.isRunning).toBeFalsy();
                this.expect(stopwatch.isPaused).toBeTruthy();
                
                // Test stop
                stopwatch.stop();
                this.expect(stopwatch.isRunning).toBeFalsy();
                this.expect(stopwatch.isPaused).toBeFalsy();
                
                // Test reset
                stopwatch.reset();
                this.expect(stopwatch.currentTime).toBe(0);
            });
        });
    }

    testCountdownClass() {
        this.describe('Clase Countdown', () => {
            this.test('se inicializa correctamente', () => {
                const countdown = new Countdown(2, 60000); // 1 minuto
                this.expect(countdown.id).toBe(2);
                this.expect(countdown.type).toBe('countdown');
                this.expect(countdown.initialTime).toBe(60000);
                this.expect(countdown.currentTime).toBe(60000);
                this.expect(countdown.isRunning).toBeFalsy();
            });

            this.test('isCritical() funciona correctamente', () => {
                const countdown = new Countdown(1, 60000);
                
                countdown.currentTime = 15000; // 15 segundos
                this.expect(countdown.isCritical()).toBeFalsy();
                
                countdown.currentTime = 5000; // 5 segundos
                this.expect(countdown.isCritical()).toBeTruthy();
                
                countdown.currentTime = 0;
                this.expect(countdown.isCritical()).toBeFalsy(); // Ya terminó
            });

            this.test('reset() vuelve al tiempo inicial', () => {
                const countdown = new Countdown(1, 30000);
                countdown.currentTime = 15000;
                countdown.reset();
                this.expect(countdown.currentTime).toBe(30000);
            });
        });
    }

    testNotificationService() {
        this.describe('NotificationService', () => {
            this.test('se inicializa correctamente', () => {
                const service = new NotificationService();
                this.expect(service.soundGenerator).toBeTruthy();
                this.expect(service.hasPermission).toBe(false); // Por defecto
            });

            this.test('playAlert() no genera errores', () => {
                const service = new NotificationService();
                // Solo verificamos que no lance errores
                try {
                    service.playAlert();
                    this.expect(true).toBeTruthy(); // Si llegamos aquí, no hubo error
                } catch (e) {
                    this.expect(false).toBeTruthy(); // No debería fallar
                }
            });
        });
    }

    testExportService() {
        this.describe('ExportService', () => {
            this.test('exportToCSV genera contenido válido', () => {
                // Crear timers mock
                const stopwatch = new Stopwatch(1);
                stopwatch.currentTime = 123000; // 2:03.00
                
                const countdown = new Countdown(2, 60000);
                countdown.currentTime = 30000; // 0:30.00 restante
                
                const timers = [stopwatch, countdown];
                
                // Mock de Blob y elementos DOM para testing
                global.Blob = class MockBlob {
                    constructor(content, options) {
                        this.content = content;
                        this.type = options.type;
                    }
                };
                
                global.document = {
                    createElement: () => ({
                        setAttribute: () => {},
                        style: {},
                        click: () => {},
                        remove: () => {}
                    }),
                    body: {
                        appendChild: () => {},
                        removeChild: () => {}
                    }
                };
                
                global.URL = {
                    createObjectURL: () => 'mock-url'
                };
                
                // Verificar que no lance errores
                try {
                    ExportService.exportToCSV(timers);
                    this.expect(true).toBeTruthy();
                } catch (e) {
                    console.log('Error en export:', e);
                    this.expect(false).toBeTruthy();
                }
            });
        });
    }

    testThemeManager() {
        this.describe('ThemeManager', () => {
            this.test('se inicializa con tema dark por defecto', () => {
                // Mock localStorage
                global.localStorage = {
                    getItem: () => null,
                    setItem: () => {},
                    removeItem: () => {}
                };
                
                // Mock document
                global.document = {
                    body: { classList: { remove: () => {}, add: () => {} } },
                    querySelectorAll: () => []
                };
                
                const themeManager = new ThemeManager();
                this.expect(themeManager.currentTheme).toBe('dark');
                this.expect(themeManager.themes).toContain('dark');
                this.expect(themeManager.themes).toContain('light');
                this.expect(themeManager.themes).toContain('gaming');
            });

            this.test('getNextTheme() cicla correctamente', () => {
                global.localStorage = { getItem: () => null, setItem: () => {} };
                global.document = {
                    body: { classList: { remove: () => {}, add: () => {} } },
                    querySelectorAll: () => []
                };
                
                const themeManager = new ThemeManager();
                themeManager.currentTheme = 'dark';
                
                const nextTheme = themeManager.getNextTheme();
                this.expect(nextTheme).toBe('light');
                
                themeManager.currentTheme = 'sunset'; // último tema
                const cyclesToFirst = themeManager.getNextTheme();
                this.expect(cyclesToFirst).toBe('dark');
            });
        });
    }

    testStatsManager() {
        this.describe('StatsManager', () => {
            this.test('se inicializa con estadísticas vacías', () => {
                global.localStorage = { getItem: () => null, setItem: () => {} };
                
                const statsManager = new StatsManager();
                this.expect(statsManager.stats.totalStopwatches).toBe(0);
                this.expect(statsManager.stats.totalCountdowns).toBe(0);
                this.expect(statsManager.stats.totalTime).toBe(0);
                this.expect(statsManager.stats.longestSession).toBe(0);
                this.expect(Array.isArray(statsManager.stats.sessions)).toBeTruthy();
            });

            this.test('recordTimer() actualiza estadísticas correctamente', () => {
                global.localStorage = { getItem: () => null, setItem: () => {} };
                
                const statsManager = new StatsManager();
                const stopwatch = new Stopwatch(1);
                stopwatch.currentTime = 120000; // 2 minutos
                
                statsManager.recordTimer(stopwatch);
                
                this.expect(statsManager.stats.totalStopwatches).toBe(1);
                this.expect(statsManager.stats.totalTime).toBe(120000);
                this.expect(statsManager.stats.longestSession).toBe(120000);
                this.expect(statsManager.stats.sessions.length).toBe(1);
            });

            this.test('getStats() calcula promedios correctamente', () => {
                global.localStorage = { getItem: () => null, setItem: () => {} };
                
                const statsManager = new StatsManager();
                
                // Agregar dos cronómetros
                const stopwatch1 = new Stopwatch(1);
                stopwatch1.currentTime = 60000; // 1 minuto
                
                const stopwatch2 = new Stopwatch(2);
                stopwatch2.currentTime = 120000; // 2 minutos
                
                statsManager.recordTimer(stopwatch1);
                statsManager.recordTimer(stopwatch2);
                
                const stats = statsManager.getStats();
                this.expect(stats.averageTime).toBe(90000); // 1.5 minutos promedio
                this.expect(stats.totalSessions).toBe(2);
            });
        });
    }

    testSettingsManager() {
        this.describe('SettingsManager', () => {
            this.test('se inicializa con configuraciones por defecto', () => {
                global.localStorage = { getItem: () => null, setItem: () => {} };
                
                const settingsManager = new SettingsManager();
                const settings = settingsManager.getSettings();
                
                this.expect(settings.theme).toBe('dark');
                this.expect(settings.soundEnabled).toBeTruthy();
                this.expect(settings.notificationsEnabled).toBeTruthy();
                this.expect(settings.autoExport).toBeFalsy();
                this.expect(settings.precision).toBe(100);
            });

            this.test('updateSetting() cambia configuraciones', () => {
                global.localStorage = { getItem: () => null, setItem: () => {} };
                global.document = {
                    body: { classList: { toggle: () => {} } }
                };
                
                const settingsManager = new SettingsManager();
                
                settingsManager.updateSetting('soundEnabled', false);
                const settings = settingsManager.getSettings();
                
                this.expect(settings.soundEnabled).toBeFalsy();
            });
        });
    }

    showResults() {
        const total = this.results.passed + this.results.failed;
        const percentage = total > 0 ? Math.round((this.results.passed / total) * 100) : 0;
        
        console.log('\n📊 RESULTADOS DE TESTS UNITARIOS');
        console.log('================================');
        console.log(`✅ Tests pasados: ${this.results.passed}`);
        console.log(`❌ Tests fallidos: ${this.results.failed}`);
        console.log(`📈 Porcentaje éxito: ${percentage}%`);
        console.log(`🎯 Total ejecutados: ${total}`);
        
        if (this.results.failed === 0) {
            console.log('\n🎉 ¡TODOS LOS TESTS PASARON! 🎉');
        } else {
            console.log('\n⚠️ Hay tests fallidos que requieren atención');
        }
    }
}

// Instancia global del framework de testing
const testFramework = new TestFramework();

// Función global para ejecutar todos los tests
window.runUnitTests = () => {
    testFramework.runAll();
};

// Auto-ejecutar si no hay app cargada (testing standalone)
if (typeof window !== 'undefined' && !window.app) {
    // Dar tiempo para que se carguen las clases
    setTimeout(() => {
        if (typeof Timer !== 'undefined') {
            console.log('🚀 Ejecutando tests unitarios automáticamente...\n');
            window.runUnitTests();
        } else {
            console.warn('⚠️ Clases no cargadas. Ejecuta manualmente: runUnitTests()');
        }
    }, 1000);
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestFramework, testFramework };
} 