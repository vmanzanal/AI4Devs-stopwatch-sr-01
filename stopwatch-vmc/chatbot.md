# 🤖 Análisis del Proceso de Desarrollo con ChatBot ... de la humana victoria manzanal :D

### Claude hizo su propio análisis en [chatbot-claude.md](chatbot-claude.md) - me hace gracia la buena opinión que tiene el modelo de su trabajo 😄

## ¿Qué chatbot(s) usaste?
**Claude Sonnet 4** como chatbot principal, operando dentro del entorno de **Cursor IDE**

## ¿**Qué problemas** encontraste al interactuar con el modelo?
- Hay que indicar bien el contexto de trabajo, si no se pierde y empieza a navegar entre los ficheros.
- Aunque teníamos especificados los pasos y features a seguir el modelo siempre hacía la mayoría de las tareas en el primer paso o en el paso anterior y añadía nuevas features en la fase en curso.


## ¿**Qué decisiones**  tuviste que tomar tú como desarrollador para mejorar el código propuesto? 
- No tomé ninguna decisión, le dejé hacer para saber hasta donde llegaba. Es fascinante

## ¿**Qué tipo de intervenciones manuales** realizaste como desarrollador para mejorar la eficiencia del proceso?
- Ninguna, solo guardé el chat de cursor para tener todo el histórico de 
- Sí que he encontrado problemas en el desarrollo que habría que mejorar pero no me he tomado el tiempo :), prefiero seguir adelante:
    - Visuales: cuando hay 3 timers los contadores se salen de su caja contenedora
    - La feature de estadística y exportar a excel es bonita pero no tiene mucho sentido

## ¿**Cómo evaluarías** la utilidad de este flujo de trabajo real?
- Muy buena! Estructurando los pasos a seguir con el prompt de inicio e implementando paso a paso el modelo fue más allá de los requisitos aportando propuesta de valor.
    - por lo ya visto en el curso en el curso y experimentado en proyectos reales el output es mucho mejor usando metaprompting, preguntar dudas y dividiendo  el avance en distintas tareas (few-shots prompting)
- Sin duda en un proyecto real hay que (cosas que no me he tomado del tiempo de hacer en el ejercicio):
    - validar todo el output de la aplicación tando el código como la funcionalidad, aunque parezca que funciona
    - no dejar que implemente nuevas features que no están en los requisitos