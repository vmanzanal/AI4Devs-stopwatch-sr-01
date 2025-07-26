
#PROMPT 1

Como ingeniero de software necesitamos replicar esta sencilla aplicación JavaScript: @https://www.online-stopwatch.com/ 
Las funcionalidades que buscamos son: 
- un cronómetro 
- una cuenta regresiva
	- al final de la cuenta regresiva mostrar una notificación y un sonido de alerta
- la aplicación permite gestionar a la vez multiples cronómetros o cuentas regresivas


El stack tecnológico debe ser simple: vanilla html, css y javacript

Recomiéndame los pasos a seguir para obtener un output no sólo de la aplicacación sino de las mejores prácticas a usar para mantener toda la documentación y tests del proyecto. Dame primero un plan de implementación en markdown. Antes de hacer nada pregúntame si tienes dudas adicionales

#PROMPT 2
 Respecto a las preguntas adicionales:  
 1. Límite de timers simultáneos (sugerí 5, ¿es apropiado?): 3 es suficiente
 2. Formato de tiempo (¿incluir horas o solo MM:SS.ms?): sólo MM:SS.ms
 3. Persistencia (¿guardar timers al recargar página?): No es necesario
 4. Sonidos (¿alguna preferencia específica de alerta?): que sea gracioso :)
 5, Features adicionales (¿laps, splits, exportar tiempos?): Exportar tiempos a csv

¿Este plan te parece completo o quieres que ajuste algún aspecto antes de comenzar?: Sí, el plan me parece completo, antes de comenzar exporta el Plan de Implementación a un fichero plan-de-implemetación.md en la carpeta @stopwatch-vmc

#PROMPT 3
Sí, ejecuta la fase 1 del proyecto: estructura base
