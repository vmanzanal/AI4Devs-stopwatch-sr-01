
## ESTRETEGIA UTILIZADA 

Hice un poco de trampa porque he hecho el ejercicio dos meses después y ahora conozco mucho mejor las estrategias de prompting gracias al master. La metodología que he seguido que me está funcionando muy bien en la vida real:

1. 📋 Metaprompting 
    - Establecer contexto completo antes de empezar
    - Pedir planificación explícita
    - Solicitar clarificación de dudas
2. 🔄 Progressive/Iterative Prompting
3. 🎯 Validation-Driven Development 

Según el propio modelo esto sería: **Guided Iterative Development Prompting**

*Pongo mucho foco en la documentación y los tests porque me parece una parte fundamental que estoy implementando en nuestros proyectos actuales


## PROMPTS USADOS
Para ver el detalle de todo el chat completo ver: [cursor_complete_chat_retro timer.md](docs/cursor_complete_chat_retroTimer.md)

### PROMPT 1

Como ingeniero de software necesitamos replicar esta sencilla aplicación JavaScript: @https://www.online-stopwatch.com/ 
Las funcionalidades que buscamos son: 
- un cronómetro 
- una cuenta regresiva
	- al final de la cuenta regresiva mostrar una notificación y un sonido de alerta
- la aplicación permite gestionar a la vez multiples cronómetros o cuentas regresivas


El stack tecnológico debe ser simple: vanilla html, css y javacript

Recomiéndame los pasos a seguir para obtener un output no sólo de la aplicacación sino de las mejores prácticas a usar para mantener toda la documentación y tests del proyecto. Dame primero un plan de implementación en markdown. Antes de hacer nada pregúntame si tienes dudas adicionales

### PROMPT 2
 Respecto a las preguntas adicionales:  
 1. Límite de timers simultáneos (sugerí 5, ¿es apropiado?): 3 es suficiente
 2. Formato de tiempo (¿incluir horas o solo MM:SS.ms?): sólo MM:SS.ms
 3. Persistencia (¿guardar timers al recargar página?): No es necesario
 4. Sonidos (¿alguna preferencia específica de alerta?): que sea gracioso :)
 5. Features adicionales (¿laps, splits, exportar tiempos?): Exportar tiempos a csv

¿Este plan te parece completo o quieres que ajuste algún aspecto antes de comenzar?: Sí, el plan me parece completo, antes de comenzar exporta el Plan de Implementación a un fichero plan-de-implemetación.md en la carpeta @stopwatch-vmc

### PROMPT 3
Sí, ejecuta la fase 1 del proyecto: estructura base

### PROMPT 4
He probado la estructura de fase 1 y me parece correcta para seguir avanzando. Procece con la fase 2: Funcionalidad Core

### PROMPT 5
He probado las funcionalidades actuales y son correctas. Continua con la fase 3

### PROMPT 6
La fase 3 con las funcionalidades adicionales está muy bien, los atajos de teclado funcionan y la página demo aporta valor a la aplicación. Continua con la fase 4:  UX/UI Refinado (animaciones avanzadas, más temas)

### PROMPT 7
He probado la fase 4, las nuevas funcionales son correctas, los nuevos temas son chulos :) y los atajos de teclado funcionan. Procede con la fase 5: Testing y Documentación. Mueve el fichero markdown plan-de-implementacion.md y los nuevos ficheros que se creen en la fase 5 a una nueva carpeta docs dentro de @stopwatch-vmc

### PROMPT 7.1 (problema en la ejecución de la tarea)
Ha habido algún problema en la ejecución puedes revisar el estado de la fase 5?

### PROMPT 8
Cómo última tarea, mover todos los ficheros que son especificamente de la aplicación "retro-timer" a una subcarpeta app, para distinguir entre aplicación, documentación y test. Quedará el proyecto más ordenado y eso me agrada 😊  