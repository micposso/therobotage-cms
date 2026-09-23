---
id: 1
slug: failure-transparency-costs
essayNumber: '01'
date: 'April 10, 2026'
headline: >-
  La transparencia ante fallos no es un extra deseable en UX. Es un costo de
  despliegue.
refDimension: Transparencia ante fallos
title: >-
  La transparencia ante fallos no es un extra deseable en UX. Es un costo de
  despliegue.
excerpt: >-
  Cuando un robot no puede comunicar por qué se ha detenido, la carga de
  interpretación recae en el humano más cercano. Ese humano casi nunca está
  capacitado para ello. Esto es lo que sucede a continuación.
translation:
  locale: es
  sourceHash: a61954e8de1ea7fb5549b7dbc9341f70648b90c92eba1aa5c1435fe2138db6a5
  version: 1
  model: gpt-4.1-mini-2025-04-14
  generatedAt: '2026-09-22T18:07:43.708Z'
  reviewed: false
---
Cuando un robot no puede comunicar por qué se ha detenido, la carga de interpretación recae en el humano más cercano. Ese humano casi nunca está capacitado para ello. Esto es lo que sucede a continuación.

En una planta hospitalaria, una parada no anunciada desencadena una cadena de escalamiento: un miembro del personal informa a un supervisor, quien llama a mantenimiento, que a su vez contacta al proveedor. La secuencia dura un promedio de 14 minutos. Durante ese tiempo, el robot bloquea un pasillo, sostiene una carga o permanece inactivo en un espacio compartido. El costo operacional no está en la máquina, está en las personas que intentan interpretarla.

En cinco despliegues en logística y salud observados durante 18 meses, las paradas no planificadas sin salida de estado visible representaron el 62 por ciento de todos los eventos de escalamiento. Cada evento implicó en promedio que dos personas fueran apartadas de sus tareas principales. A 20 eventos por mes, son 40 horas de personal dedicadas a descifrar el silencio.

La Transparencia ante Fallos requiere que el robot comunique tres cosas: qué ha dejado de hacer, por qué se detuvo y qué debe hacer el humano más cercano a continuación. La mayoría de los sistemas desplegados no comunican ninguna de estas. Una luz ámbar intermitente no es Transparencia ante Fallos. Es ambigüedad con color.

Los responsables de despliegue que obtienen baja puntuación en Transparencia ante Fallos en la auditoría RXD suelen compartir un factor: trataron la comunicación de fallos como un caso extremo del firmware, no como un requisito de despliegue. La solución no siempre es una actualización de software. Es una decisión tomada antes de enviar el robot acerca de lo que el sistema debe a las personas que lo rodean cuando se detiene.
