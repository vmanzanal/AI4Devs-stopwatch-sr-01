# 🕰️ Retro Timer - Cronómetro y Cuenta Regresiva

> **Aplicación web premium** de cronómetros y cuentas regresivas con diseño retro futurista y funcionalidades avanzadas.

![Retro Timer](../res/stopwatch.png)

## 🚀 Quick Start

### 📱 **Usar la Aplicación**
```bash
# Abrir aplicación principal
open app/index.html

# Ver demostración interactiva  
open app/demo.html

# Ejecutar tests funcionales
open app/test-functionality.html
```

### 🧪 **Ejecutar Tests Automatizados**
```bash
# Suite completa de tests (visual)
open docs/tests-automatizados.html
```

### 📚 **Documentación**
- **[📖 Manual de Usuario](docs/manual-usuario.md)** - Guía completa de uso
- **[🔧 Documentación Técnica](docs/README-tecnico.md)** - Arquitectura y API
- **[📋 Plan de Implementación](docs/plan-de-implementacion.md)** - Roadmap y fases

## ✨ Características Principales

### 🎯 **Funcionalidades Core**
- ⏱️ **Cronómetro preciso** con formato MM:SS.ms
- ⏳ **Cuenta regresiva** con notificaciones y alertas sonoras
- 🎮 **Hasta 3 timers simultáneos** completamente independientes
- 📊 **Exportación a CSV** de tiempos y estadísticas

### 🎨 **UX/UI Avanzada**
- 🌈 **6 temas visuales únicos** (Dark, Light, Gaming, Matrix, Ocean, Sunset)
- ✨ **Animaciones avanzadas** (partículas, ripples, efectos neón)
- ⌨️ **9 atajos de teclado** para control completo sin mouse
- 📱 **Responsive design** perfecto (desktop/tablet/móvil)
- 🔔 **Sistema de notificaciones** toast y browser

### 🔧 **Características Técnicas**
- 🎵 **Sonidos generativos** usando Web Audio API (3 tipos + aleatorio)
- 📈 **Panel de estadísticas** con persistencia localStorage
- 🖥️ **Modo pantalla completa** para timers individuales
- ♿ **Accesibilidad completa** (WCAG AA, keyboard navigation)
- 🧪 **55 tests automatizados** (unitarios + integración)

## 📁 Estructura del Proyecto

```
stopwatch-vmc/
├── 📱 app/                    # Aplicación principal
│   ├── index.html            # Interfaz principal  
│   ├── styles.css            # 6 temas + animaciones
│   ├── script.js             # Lógica modular (ES6+)
│   ├── demo.html             # Demostración interactiva
│   ├── test-functionality.html # Tests funcionales
│   └── assets/               # Recursos (generador audio)
├── 📚 docs/                   # Documentación completa
├── 🧪 tests/                  # Suite de testing automatizado
├── 📋 prompts.md             # Historial de prompts
└── 🤖 chatbot-claude.md      # Análisis del proceso IA
```

## 🎮 Atajos de Teclado

| Tecla | Función |
|-------|---------|
| `S` | Crear cronómetro |
| `C` | Crear cuenta regresiva |
| `Space` | Play/Pause timer activo |
| `R` | Reset timer activo |
| `E` | Exportar a CSV |
| `T` | Cambiar tema |
| `Del` | Eliminar timer activo |
| `F` | Pantalla completa |
| `?` | Mostrar ayuda |

## 🌈 Temas Disponibles

- 🌙 **Dark** - Clásico oscuro con neón verde
- ☀️ **Light** - Elegante claro con acentos azules  
- 🎮 **Gaming** - Retro gaming con gradientes vibrantes
- 🔰 **Matrix** - Verde matrix con efectos cyber
- 🌊 **Ocean** - Azul oceánico tranquilo
- 🌅 **Sunset** - Rosa/naranja cálido

## 🔊 Sistema de Audio

3 tipos de sonidos generativos graciosos:
- 🎺 **Ta-da!** - Celebración clásica
- 🕹️ **Retro Game** - Estilo videojuego arcade  
- 🎪 **Boing** - Divertido y juguetón
- 🎲 **Aleatorio** - Selección automática

## 📊 Estadísticas y Datos

### 📈 **Métricas Rastreadas**
- Total de cronómetros/cuentas regresivas creados
- Tiempo total acumulado de todas las sesiones
- Sesión más larga registrada
- Historial completo de sesiones

### 💾 **Exportación CSV**
- **Timers individuales**: Tipo, tiempo inicial/final, duración, fecha
- **Estadísticas globales**: Resumen completo de uso y métricas

## 🧪 Testing

### 📋 **Cobertura de Tests**
- **37 tests unitarios** - Clases y funciones individuales
- **18 tests de integración** - Flujos completos de usuario  
- **Tests funcionales manuales** - Verificación de características específicas
- **Suite visual interactiva** - Ejecución y resultados en tiempo real

### ✅ **Calidad del Código**
- Arquitectura modular ES6+ con separación de responsabilidades
- Documentación JSDoc completa en todas las clases
- Manejo robusto de errores y edge cases
- Performance optimizado (requestAnimationFrame, throttling)

## 🛠️ Stack Tecnológico

- **Frontend**: Vanilla HTML5, CSS3, JavaScript ES6+
- **Audio**: Web Audio API (sonidos generativos)
- **Persistencia**: localStorage (configuraciones + estadísticas)
- **Testing**: Framework personalizado liviano
- **Responsive**: CSS Grid + Flexbox híbrido
- **Accesibilidad**: ARIA, keyboard navigation, high contrast

## 🎯 Compatibilidad

- ✅ **Chrome 70+** (recomendado)
- ✅ **Firefox 65+** 
- ✅ **Safari 13+**
- ✅ **Edge 79+**
- 📱 **Móviles**: iOS Safari, Chrome Android

## 📄 Licencia

Desarrollado como proyecto educativo para **AI4Devs**. Código disponible bajo términos educativos.

---

## 🚀 Desarrollo

### 🔄 **Proceso de Desarrollo**
Este proyecto fue desarrollado usando **Claude Sonnet 4** en **Cursor IDE** siguiendo una metodología iterativa de 5 fases:

1. **Fase 1**: Estructura base y layout HTML/CSS
2. **Fase 2**: Funcionalidad core (cronómetro + cuenta regresiva) 
3. **Fase 3**: Funcionalidades avanzadas (multi-timer, export, shortcuts)
4. **Fase 4**: UX/UI refinado (temas, animaciones, responsive)
5. **Fase 5**: Testing y documentación completa

### 📈 **Métricas del Proyecto**
- **45KB** JavaScript modular (1,479 líneas)
- **29KB** CSS con 6 temas (1,323 líneas) 
- **17KB** tests automatizados (55 tests)
- **25KB** documentación completa
- **30+ funcionalidades** implementadas
- **100% requisitos** cumplidos + extras

---

**Retro Timer v4.0** - *Cronómetro premium con diseño retro futurista* ⚡

*Proyecto completado exitosamente en todas las fases* 🎯 