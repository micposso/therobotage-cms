---
id: 3
slug: recovery-design-gap
essayNumber: '03'
date: 'March 13, 2026'
headline: >-
  La brecha del diseño de recuperación: qué sucede después de que la interacción
  falla.
refDimension: Diseño de Recuperación
title: >-
  La brecha del diseño de recuperación: qué sucede después de que la interacción
  falla.
excerpt: >-
  La mayoría del diseño en interacción humano-robot (HRI) se detiene en el
  momento del éxito. El Diseño de Recuperación pregunta qué hace el robot — y
  qué comunica — cuando la interacción prevista falla. La mayoría de los robots
  desplegados no tienen respuesta.
translation:
  locale: es
  sourceHash: 48f9f0c5768a8334565b9941064acfa02ec495e53173c84e620df858776d2178
  version: 1
  model: gpt-4.1-mini-2025-04-14
  generatedAt: '2026-09-22T18:07:48.152Z'
  reviewed: false
---
La mayoría del diseño en interacción humano-robot (HRI) se detiene en el momento del éxito. El Diseño de Recuperación pregunta qué hace el robot — y qué comunica — cuando la interacción prevista falla. La mayoría de los robots desplegados no tienen respuesta.

Considere un robot de servicio encargado de entregar medicamentos a una habitación de paciente. La puerta está entreabierta. El robot no puede determinar si se permite la entrada. En ausencia de Diseño de Recuperación, el robot espera — sin comunicación, sin tiempo límite, sin señal de escalación. Una enfermera lo encuentra en el pasillo once minutos después. El medicamento llega tarde. No existe registro del retraso en el sistema. El robot cumplió su especificación técnica. La interacción falló.

Un buen Diseño de Recuperación define tres cosas para cada modo de fallo: una señal que comunique el estado de fallo al humano más cercano en términos claros, un umbral de tiempo tras el cual el robot escala o busca una ruta alternativa, y una entrada en registro que cree un historial auditable de qué ocurrió y cuándo. Ninguno de estos requiere hardware novedoso. Los tres requieren decisiones deliberadas de diseño realizadas antes del despliegue.

El costo de la ausencia de Diseño de Recuperación se acumula. Una interacción no resuelta es un inconveniente. Treinta interacciones no resueltas por semana, sin registro ni escalación consistente, producen un patrón que se vuelve invisible — absorbido en la frustración ambiental del personal sin emerger como un problema solucionable. Se culpa al robot. Se juzga mal el despliegue. La brecha del Diseño de Recuperación nunca se nombra.

Para quienes desplegan, la implicación práctica es una pregunta previa al lanzamiento que casi nadie hace: para cada uno de los diez modos de fallo más probabilísticos en este entorno, ¿qué comunica el robot, a quién y qué sucede después? Si la respuesta es "no estamos seguros," el Diseño de Recuperación no está completo. El robot no está listo.
