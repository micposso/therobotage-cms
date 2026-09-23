---
slug: autonomous-rescue-robots-earthquake-rubble
title: El próximo equipo de rescate tras un terremoto tendrá robots en los escombros.
category: INVESTIGACIÓN
date: 'August 14, 2026'
excerpt: >-
  Los robots de rescate autónomos están pasando de cámaras remotas a compañeros
  de IA para las críticas primeras 48 horas tras un terremoto.
headerImage: /images/news/autonomous-rescue-robots-earthquake-rubble-header.png
thumbnailImage: /images/news/autonomous-rescue-robots-earthquake-rubble-thumb.png
author: The Robot Age Editorial Team
translation:
  locale: es
  sourceHash: 08b1ce6f76a05d1eecb78467194a6a004bfcd5f6b7f008ab0e08290bdc32c4e3
  version: 1
  model: gpt-4.1-mini-2025-04-14
  generatedAt: '2026-09-22T17:59:47.033Z'
  reviewed: false
---

Cuando un terremoto derrumba un edificio, el rescate se convierte en una carrera contra vacíos, polvo, concreto inestable, servicios rotos y el tiempo. Las primeras 48 horas son la parte más dura de esa carrera. Los sobrevivientes pueden estar heridos, deshidratados, atrapados sin luz o escondidos bajo capas de escombros a los que las brigadas no pueden acceder de forma segura. La ventana de rescate suele describirse como las primeras 48 a 72 horas, pero cada hora perdida reduce la posibilidad de encontrar a alguien con vida.

Por eso, el futuro de la respuesta a terremotos no puede limitarse a cámaras robóticas o vehículos controlados a distancia. El siguiente salto son robots de rescate autónomos que trabajan junto a los equipos humanos: mapean estructuras colapsadas, detectan signos de vida, priorizan zonas de búsqueda, llevan sensores a vacíos inseguros y ayudan a los jefes de incidente a decidir dónde excavar primero.

## Las zonas de desastre reales ya cambiaron la cuestión

Los robots ya fueron probados en terremotos reales. Tras el terremoto de Amatrice en Italia en 2016, el proyecto financiado por la UE [TRADR](https://cordis.europa.eu/article/id/120405-eu-project-successfully-deploys-robots-following-italy-earthquake) desplegó dos vehículos terrestres no tripulados y tres drones a petición del cuerpo de bomberos italiano. Su trabajo fue práctico, no espectacular: recopilar imágenes, construir contexto 3D, inspeccionar interiores peligrosos y ayudar a los bomberos a entender estructuras dañadas sin enviar personas a espacios inseguros.

El propio [informe de campo de TRADR en Amatrice](https://www.tradr-project.eu/wp-content/uploads/amatrice_LBR_publishedversion-1.pdf) es útil porque muestra cómo es la robótica de rescate fuera de un laboratorio. Los problemas difíciles no eran solo la locomoción. Eran comunicaciones, coordinación humana, preparación en campo, interpretación de daños y generar confianza en los socorristas que no tenían tiempo para prototipos frágiles.

La lección fue clara: los robots pueden ganarse un lugar en la respuesta a desastres cuando hacen a los equipos más rápidos, seguros y mejor informados. Pero esa generación de sistemas aún era mayormente supervisada. El robot extendía los ojos y el alcance del rescatista. No se comportaba todavía como un compañero de equipo en campo.

## La IA transforma la búsqueda de observación pasiva a decisiones activas

La siguiente generación cambia el rol de la máquina. Una cámara remota espera a que un humano note algo. Un robot de rescate con IA puede decidir dónde mirar a continuación.

Investigaciones recientes sobre [búsqueda robótica activa de víctimas](https://digital.csic.es/handle/10261/396178) usan aprendizaje profundo y planificación probabilística para que un robot no siga solo una ruta fija por una zona de desastre. Estima dónde hay más probabilidad de encontrar víctimas, actualiza esa estimación al observar el entorno y elige el mejor próximo punto de vista. Otros trabajos combinan imagen RGB, térmica y multiespectral con aprendizaje profundo para mejorar la detección de víctimas en ambientes desordenados, con poca luz y parcialmente ocultos.

Esto es importante bajo los escombros porque el cuello de botella no es solo el acceso, sino la atención. Los equipos de rescate enfrentan demasiados huecos, caminos inestables y poca certeza. Un robot que pueda mapear, clasificar y priorizar posibles ubicaciones de sobrevivientes puede acelerar la búsqueda mientras los humanos se concentran en la extracción.

## Los cuadrúpedos están diseñados para terrenos dañados

Los robots cuadrúpedos son especialmente relevantes tras terremotos porque los escombros son hostiles para ruedas y orugas. Concreto roto, losas inclinadas, escaleras, huecos, escombros sueltos y varillas expuestas crean un terreno donde robots convencionales pueden detenerse. Los robots con patas pueden pisar superficies discontinuas, recuperar el equilibrio, subir caminos irregulares y cargar equipos como LiDAR, cámaras térmicas, micrófonos, sensores de gases, radios y suministros médicos pequeños.

Este cambio ya es visible en el campo. En la respuesta al terremoto 2024 en la península de Noto en Japón, las Fuerzas de Autodefensa Terrestres japonesas desplegaron vehículos terrestres no tripulados cuadrúpedos, según un [estudio de caso de Ghost Robotics](https://www.ghostrobotics.io/case-studies/autonomous-robots-for-earthquake-disaster-relief), para tareas como reconocimiento en zonas inseguras, entrega de pequeñas cargas y soporte de comunicaciones donde la infraestructura estaba dañada.

Esto no es el estado final. Es el momento clave. Los primeros despliegues prácticos prueban que los robots con patas pueden integrarse en el flujo de trabajo de desastres. El siguiente paso es darles más autonomía para que busquen con menor teleoperación constante durante las horas más caóticas de la respuesta.

## La prueba de autonomía vino del subsuelo

Un buen anticipo de la autonomía para rescates de terremoto puede venir de la robótica subterránea. En el desafío DARPA Subterranean, el equipo CERBERUS creó un sistema de robots con patas y drones diseñados para explorar ambientes sin GPS y con comunicaciones limitadas. El equipo combinó LiDAR, cámaras, sensores inerciales, mapeo multirrobot y autonomía para que un supervisor humano pudiera dirigir un equipo robótico en terreno complejo.

El [sistema CERBERUS](https://rsl.ethz.ch/research/challenges-competitions/cerberus.html) y su [documento técnico](https://arxiv.org/abs/2207.04914) son importantes porque los edificios colapsados crean limitaciones similares: sin GPS, con pocas comunicaciones, oscuridad, polvo, caminos bloqueados, pisos inestables y la urgente necesidad de buscar más área de la que las personas pueden cubrir con seguridad. El entorno DARPA fue una competición, no un terremoto. Pero la pila de autonomía apunta directamente a la respuesta a desastres: robots que pueden explorar, mapear, compartir información y seguir operando cuando la comunicación con el operador humano es poco fiable.

## Encontrar vida entre escombros es el verdadero premio

El robot de rescate más valioso no es el que parece más impresionante sobre los escombros. Es el que ayuda a encontrar a una persona viva antes.

Por eso importa la historia de la tecnología FINDER de NASA/JPL y DHS. Tras el terremoto de Nepal en 2015, [FINDER ayudó a los rescatistas a localizar a cuatro hombres](https://www.jpl.nasa.gov/news/finder-search-and-rescue-technology-helped-save-lives-in-nepal/) atrapados bajo escombros detectando latidos cardíacos a través de los restos. FINDER no era un robot autónomo, pero comprobó un principio crucial: la información que salva vidas puede detectarse antes de que los rescatistas lleguen físicamente a la víctima.

El siguiente paso es colocar ese tipo de sensores en plataformas móviles guiadas por IA. Una respuesta futura a un terremoto podría combinar cuadrúpedos que crucen la superficie de escombros, drones que mapeen estructuras dañadas desde arriba, robots blandos que exploren cavidades estrechas y sensores distribuidos que escuchen respiración, golpes, calor, movimiento, CO2 o latidos. El robot en forma de enredadera [SPROUT](https://news.mit.edu/2025/sprout-flexible-robot-help-emergency-responders-search-rubble-0402) del MIT Lincoln Laboratory apunta en esa dirección: un robot flexible diseñado para extenderse a través de espacios estrechos sin forzar los escombros.

## Robots al lado de los rescatistas, no en su lugar

La visión más fuerte no es que los robots reemplacen a los equipos de rescate. Es que trabajen junto a ellos.

Los equipos humanos aportan juicio estructural, habilidades médicas, coordinación, ética y la responsabilidad final de extraer a una persona con seguridad. Los robots aportan resistencia, escaneo repetible, acceso a zonas peligrosas, mapeo rápido y la capacidad de buscar en lugares demasiado riesgosos para personas o perros. El valor está en la combinación.

En las primeras 48 horas tras un terremoto, esa combinación podría ser más importante que casi cualquier otro caso de uso robótico. Un robot cuadrúpedo puede entrar a una zona inestable antes de que un equipo exponga personas. Un dron puede construir un mapa exterior en vivo. Un robot blando puede empujar un sensor más profundo en un vacío. Un sistema de IA puede fusionar señales en un mapa de búsqueda clasificado. Un comandante humano puede entonces decidir a dónde enviar el siguiente equipo, qué losa estabilizar y qué hueco merece excavación inmediata.

La tecnología no está completamente resuelta. Baterías, polvo, agua, escombros, fallos de radio, fiabilidad de sensores, certificación, entrenamiento de rescatistas y confianza pública siguen siendo grandes barreras. Una zona de desastre no es un piso de demostración. Un robot de rescate debe funcionar cuando el terreno está roto, la red desaparecida y vidas dependen de una confiabilidad constante.

Pero la dirección ya es visible. Los robots de rescate en terremotos están dejando de ser ojos sobre ruedas. Se están convirtiendo en compañeros autónomos para las personas que corren hacia edificios colapsados cuando todos los demás huyen.
