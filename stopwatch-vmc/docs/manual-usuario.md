# 📖 Manual de Usuario - Retro Timer

> Guía completa para usar el cronómetro y cuenta regresiva retro

## 🚀 Comenzando

¡Bienvenido a **Retro Timer**! Esta aplicación te permite gestionar hasta 3 cronómetros y cuentas regresivas simultáneamente con un diseño retro futurista.

### 🌐 Acceso a la Aplicación

- **Aplicación Principal**: `index.html`
- **Página de Demostración**: `demo.html`
- **Tests de Funcionalidad**: `test-functionality.html`

## 🎮 Controles Básicos

### 🖱️ **Con el Mouse**

1. **Agregar Cronómetro**: Clic en "➕ Agregar Cronómetro"
2. **Agregar Cuenta Regresiva**: Clic en "⏰ Agregar Cuenta Regresiva"
3. **Controlar Timer**: Usa los botones Start/Pause/Reset en cada timer
4. **Exportar Datos**: Clic en "📊 Exportar CSV"
5. **Ver Estadísticas**: Clic en el botón "?" (ayuda)
6. **Modo Pantalla Completa**: Doble clic en cualquier display de tiempo

### ⌨️ **Con el Teclado** (¡Recomendado!)

| Tecla | Acción | Descripción |
|-------|--------|-------------|
| `S` | Cronómetro | Crea un nuevo cronómetro |
| `C` | Cuenta Regresiva | Abre modal para configurar cuenta regresiva |
| `SPACE` | Play/Pause | Controla el último timer creado |
| `R` | Reset | Resetea TODOS los timers activos |
| `E` | Exportar | Exporta todos los tiempos a CSV |
| `T` | Cambiar Tema | Cicla entre los 6 temas disponibles |
| `DEL` | Eliminar | Elimina el último timer creado |
| `ESC` | Cerrar | Cierra modales abiertos |
| `?` | Ayuda | Muestra panel de estadísticas |

## ⏱️ Usando Cronómetros

### ✅ **Crear un Cronómetro**

1. **Con teclado**: Presiona `S`
2. **Con mouse**: Clic en "➕ Agregar Cronómetro"

### 🎯 **Controlar un Cronómetro**

- **Start**: Inicia el conteo desde 00:00.00
- **Pause**: Pausa el cronómetro (se puede reanudar)
- **Reset**: Vuelve a 00:00.00

### 📊 **Formato de Tiempo**

Los cronómetros muestran el tiempo en formato **MM:SS.ms**:
- **MM**: Minutos (00-99)
- **SS**: Segundos (00-59)
- **ms**: Milisegundos (00-99)

**Ejemplo**: `05:23.45` = 5 minutos, 23 segundos, 45 centésimas

## ⏰ Usando Cuentas Regresivas

### ✅ **Crear una Cuenta Regresiva**

1. **Con teclado**: Presiona `C`
2. **Con mouse**: Clic en "⏰ Agregar Cuenta Regresiva"
3. **Configurar tiempo**:
   - Ingresa minutos (0-99)
   - Ingresa segundos (0-59)
   - Clic en "Crear"

### 🎯 **Controlar una Cuenta Regresiva**

- **Start**: Inicia el conteo regresivo
- **Pause**: Pausa la cuenta regresiva
- **Reset**: Vuelve al tiempo inicial configurado

### 🔔 **Alertas al Completarse**

Cuando una cuenta regresiva llega a `00:00.00`:

1. **🎵 Sonido gracioso** automático (aleatorio entre 3 tipos)
2. **🔔 Notificación del navegador** (si están habilitadas)
3. **⚠️ Efecto visual** en el display (parpadeo púrpura)
4. **⏹️ Auto-parada** del timer

### ⚠️ **Tiempo Crítico**

Cuando quedan menos de 10 segundos:
- El display se vuelve **rojo**
- Comienza un **parpadeo de advertencia**
- **Pulsación visual** del texto

## 🎨 Temas Visuales

La aplicación incluye **6 temas únicos**:

### 🌑 **Dark** (Por defecto)
- **Colores**: Verde neón sobre fondo negro
- **Estilo**: Clásico retro futurista
- **Ideal para**: Uso nocturno, máximo contraste

### ☀️ **Light**
- **Colores**: Grises elegantes sobre fondo claro
- **Estilo**: Minimalista y profesional
- **Ideal para**: Oficina, uso diurno

### 🎮 **Gaming**
- **Colores**: Púrpura y cyan sobre fondo oscuro
- **Estilo**: Retro gaming años 80
- **Ideal para**: Gamers, estética cyberpunk

### 💚 **Matrix**
- **Colores**: Verde matrix sobre fondo negro
- **Estilo**: Estética hacker
- **Ideal para**: Programadores, fans de Matrix

### 🌊 **Ocean**
- **Colores**: Azules oceánicos tranquilos
- **Estilo**: Sereno y relajante
- **Ideal para**: Meditación, trabajo concentrado

### 🌅 **Sunset**
- **Colores**: Rosas y naranjas cálidos
- **Estilo**: Romántico y acogedor
- **Ideal para**: Ambientes cálidos, creatividad

### 🔄 **Cambiar Tema**

- **Con teclado**: Presiona `T` para ciclar entre temas
- **Con mouse**: Clic en los botones circulares del selector de temas (esquina superior izquierda)
- **Persistencia**: Tu tema favorito se guarda automáticamente

## 🎭 Efectos Visuales

### ✨ **Animaciones Incluidas**

- **🌟 Partículas de fondo**: Pequeñas luces que flotan según el tema
- **💫 Efectos ripple**: Ondas al hacer clic en botones
- **🔢 Animación de conteo**: Micro-pulsaciones al cambiar el tiempo
- **📈 Números flotantes**: Indicadores +1/-1 al cambiar contador
- **⚡ Neón pulsante**: Efecto de respiración en el título
- **🎪 Animaciones de feedback**: Confirmaciones visuales de acciones

### 🎮 **Microinteracciones**

- **Hover effects**: Los elementos responden al pasar el mouse
- **Click feedback**: Transformaciones de escala al hacer clic
- **Estado visual**: Indicadores de color para running/paused/completed
- **Transiciones suaves**: Todo se mueve de forma fluida

### 📱 **Optimizaciones**

- **Móviles**: Partículas deshabilitadas para mejor rendimiento
- **Accesibilidad**: Animaciones reducidas si está configurado en el sistema
- **Performance**: 60fps garantizados en dispositivos modernos

## 🖥️ Modo Pantalla Completa

### 🚀 **Activar Modo Pantalla Completa**

1. **Doble clic** en cualquier display de tiempo
2. El timer se expande a **pantalla completa**
3. Display gigante **optimizado para presentaciones**

### 🎮 **Controles en Pantalla Completa**

- **Botones grandes**: Start, Pause, Reset optimizados
- **Botón "Salir"**: Regresa a vista normal
- **Mismo funcionalidad**: Todos los controles disponibles
- **Ideal para**: Presentaciones, eventos, gimnasios

## 📊 Estadísticas y Exportación

### 📈 **Panel de Estadísticas**

Accede presionando `?` o el botón de ayuda:

- **📊 Cronómetros Totales**: Cuántos cronómetros has usado
- **⏰ Cuentas Regresivas**: Cuántas cuentas regresivas has creado
- **⏱️ Tiempo Total**: Suma de todos los cronómetros
- **🏆 Sesión Más Larga**: Tu récord personal

### 💾 **Exportar Datos**

#### **Exportar Tiempos de Timers Activos**
1. Presiona `E` o clic en "📊 Exportar CSV"
2. Se descarga archivo: `stopwatch-times-YYYY-MM-DD.csv`
3. **Incluye**: Tipo, tiempo inicial, final, duración, fecha y hora

#### **Exportar Estadísticas Completas**
1. Abre panel de estadísticas (`?`)
2. Clic en "Exportar" dentro del panel
3. Se descarga: `retro-timer-stats-YYYY-MM-DD.csv`
4. **Incluye**: Todas las métricas históricas

### 📋 **Formato CSV**

```csv
Tipo,Tiempo_Inicial,Tiempo_Final,Duracion,Fecha,Hora
Cronómetro,00:00.00,05:32.45,05:32.45,2024-01-15,14:30:22
Cuenta_Regresiva,10:00.00,00:00.00,10:00.00,2024-01-15,14:35:18
```

## 🎵 Sistema de Sonidos

### 🔊 **Tipos de Sonidos**

La aplicación genera **3 tipos de sonidos graciosos**:

1. **🎼 Ta-da!**: Melodía musical alegre
2. **🎮 Retro Game**: Sonido estilo videojuego clásico
3. **🔊 Boing**: Efecto cómico de rebote

### 🎲 **Selección Aleatoria**

- Cada vez que se completa una cuenta regresiva, se reproduce **un sonido aleatorio**
- **Web Audio API**: Sonidos generados programáticamente (no archivos)
- **Sin dependencias**: Todo creado internamente

### 🔧 **Configuración de Audio**

- **Volumen**: Predeterminado 70%
- **Duración**: 1-3 segundos aproximadamente
- **Compatible**: Todos los navegadores modernos

## 📱 Responsive Design

### 💻 **Desktop** (1024px+)
- **Layout completo**: Todas las funcionalidades visibles
- **Grid de timers**: Hasta 3 columnas
- **Partículas activas**: Efectos de fondo completos
- **Atajos de teclado**: Guía visible en pantalla

### 📱 **Tablet** (768px - 1023px)
- **Layout adaptado**: Selector de temas relocalizado
- **Grid responsivo**: 2 columnas máximo
- **Partículas reducidas**: Menos efectos para mejor rendimiento
- **Touch optimizado**: Botones más grandes

### 📲 **Móvil** (< 768px)
- **Una columna**: Timers apilados verticalmente
- **Sin partículas**: Optimización de batería
- **Controles grandes**: Fácil uso con dedos
- **Texto legible**: Tamaños aumentados

## ♿ Accesibilidad

### 🔍 **Lectores de Pantalla**

- **ARIA labels**: Todos los elementos etiquetados
- **Anuncios de estado**: Cambios importantes comunicados
- **Estructura semántica**: HTML5 válido
- **Navegación lógica**: Orden de tabulación coherente

### ⌨️ **Navegación por Teclado**

- **Tab**: Navegar entre elementos
- **Enter/Space**: Activar botones
- **Escape**: Cerrar modales
- **Atajos personalizados**: Todas las funciones accesibles

### 🎨 **Contraste y Visibilidad**

- **Alto contraste**: Todos los temas WCAG AA compliant
- **Focus indicators**: Elementos activos claramente marcados
- **Tamaños legibles**: Textos de 14px mínimo
- **Colores seguros**: Sin dependencia solo del color

### 🔄 **Reduced Motion**

- **Respeto preferencias**: Detecta configuración del sistema
- **Animaciones mínimas**: Si está habilitado reduced-motion
- **Funcionalidad completa**: Sin pérdida de características

## 🔧 Resolución de Problemas

### 🔊 **Sonidos No Reproducen**

**Posibles causas:**
- Navegador bloquea autoplay
- Volumen del sistema silenciado
- Web Audio API no soportado

**Soluciones:**
1. Interactuar con la página antes (clic en cualquier lugar)
2. Verificar configuración de sonido del navegador
3. Actualizar a navegador moderno

### 🎨 **Temas No Cambian**

**Posibles causas:**
- JavaScript deshabilitado
- LocalStorage bloqueado
- Cache del navegador

**Soluciones:**
1. Habilitar JavaScript
2. Permitir cookies/storage local
3. Refrescar página (F5)

### ⚡ **Aplicación Lenta**

**Posibles causas:**
- Muchas animaciones activas
- Hardware limitado
- Muchas pestañas abiertas

**Soluciones:**
1. Cambiar a tema Light (menos efectos)
2. Cerrar otras pestañas
3. Habilitar "reduced motion" en sistema

### 📱 **Problemas en Móvil**

**Optimizaciones automáticas:**
- Partículas deshabilitadas
- Animaciones reducidas
- Layout simplificado

### 💾 **Datos No Se Guardan**

**Verificar:**
- LocalStorage habilitado
- Espacio de almacenamiento disponible
- Modo incógnito (datos temporales)

## 💡 Consejos y Trucos

### 🎯 **Uso Eficiente**

1. **Atajos de teclado**: Más rápido que el mouse
2. **Modo pantalla completa**: Ideal para presentaciones
3. **Múltiples timers**: Perfecto para intervalos de ejercicio
4. **Estadísticas**: Rastrea tus hábitos de tiempo

### 🎨 **Personalización**

1. **Encuentra tu tema**: Prueba todos los 6 temas
2. **Atajos rápidos**: Memoriza `S`, `C`, `T`, `SPACE`
3. **Exportación regular**: Mantén registro de tus tiempos

### 🏃‍♂️ **Casos de Uso Populares**

- **🏋️ Ejercicio**: Múltiples timers para intervalos
- **📚 Estudio**: Técnica Pomodoro con cuentas regresivas
- **🍳 Cocina**: Cronómetros para diferentes platos
- **🎯 Productividad**: Control de tiempo en tareas
- **🎮 Gaming**: Speedruns y desafíos de tiempo

## 🆘 Soporte

### 📋 **Información del Sistema**

Para reportar problemas, incluye:
- **Navegador**: Nombre y versión
- **Sistema**: Windows/Mac/Linux/Mobile
- **Pasos**: Cómo reproducir el problema
- **Tema activo**: Qué tema estabas usando

### 🔍 **Herramientas de Debug**

En la consola del navegador (F12):
```javascript
window.debugTimers()  // Ver estado de timers
app.getStats()        // Ver estadísticas
```

### 📞 **Recursos de Ayuda**

- **📋 Página de pruebas**: `test-functionality.html`
- **🎨 Página demo**: `demo.html`
- **📖 Documentación técnica**: `docs/README-tecnico.md`

---

## 🎉 ¡Disfruta tu Retro Timer!

Esperamos que disfrutes usando esta aplicación tanto como nosotros disfrutamos creándola. ¡Que tengas excelentes sesiones de tiempo! ⏰✨

**¿Tienes sugerencias?** Nos encantaría escucharlas para futuras versiones.

---

*Manual actualizado para la versión 4.0 - Fase 5 completada* 