---
slug: xiaomi-robotics-1-open-source-robot-model
title: >-
  Xiaomi acaba de hacer que el modelo del robot forme parte de la carrera
  open-source.
category: ANÁLISIS
date: 'August 5, 2026'
excerpt: >-
  Xiaomi-Robotics-1 convierte la robótica de código abierto en un argumento de
  infraestructura: los modelos compartidos pueden ayudar a laboratorios,
  desarrolladores y fabricantes pequeños a avanzar más rápido que con pilas de
  productos cerrados.
headerImage: /images/news/xiaomi-robotics-open-source-header.png
thumbnailImage: /images/news/xiaomi-robotics-open-source-thumb.png
author: The Robot Age Editorial Team
translation:
  locale: es
  sourceHash: 4d0a5bb5e0782e75fbbba885feb7356f847f82de1881ece63281bb04ddd9eb2d
  version: 1
  model: gpt-4.1-mini-2025-04-14
  generatedAt: '2026-09-22T18:02:28.262Z'
  reviewed: false
---
El grupo de robótica de Xiaomi ha publicado como open source [Xiaomi-Robotics-1](https://github.com/XiaomiRobotics/Xiaomi-Robotics-1), un modelo fundamental de visión, lenguaje y acción entrenado para manipulación móvil. Esta liberación es importante porque no es solo otra demostración impresionante de robots. Es una apuesta a que el modelo base para robótica puede convertirse en infraestructura compartida.

El momento es preciso. El 30 de julio, Google DeepMind presentó [Gemini Robotics 2](https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/), una nueva pila física de IA para control corporal completo, manipulación hábil, adaptación en el dispositivo y colaboración multi-robot. Unos días después, Xiaomi tomó una dirección comercial opuesta: en lugar de mostrar solo un sistema privado para socios, puso un modelo base de robot en canales públicos para desarrolladores.

Ese contraste se está convirtiendo en una de las tensiones definitorias en robótica. China está tratando cada vez más los modelos abiertos, pesos abiertos y conjuntos de datos abiertos como una forma de acelerar el ecosistema. Muchas empresas estadounidenses construyen modelos potentes de robótica dentro de pilas cerradas de productos, programas para socios o negocios propios de robots. Un enfoque distribuye capacidad. El otro concentra capacidad alrededor de productos.

## Qué liberó Xiaomi

El [repositorio Xiaomi-Robotics-1](https://github.com/XiaomiRobotics/Xiaomi-Robotics-1) describe XR-1 como un modelo base para robots entrenado con más de 100,000 horas de trayectorias de manipulación en el mundo real. Usa una arquitectura visión-lenguaje-acción diseñada para manipulación móvil lista para usar en entornos desconocidos y adaptación rápida a nuevas tareas.

La receta de entrenamiento sigue el patrón ahora conocido de los grandes modelos de lenguaje: preentrenamiento amplio primero, luego postentrenamiento para alineación. Xiaomi indica que XR-1 se preentrenó con más de 100,000 horas de datos de manipulación UMI sin embodiemento en más de 1,700 escenarios domésticos, comerciales, industriales y exteriores. Luego se postentrenó con más de 10,000 horas de datos de robots con distintos cuerpos.

La afirmación práctica no es que un modelo descargado haga instantáneamente útil a cualquier robot. La robótica no funciona así. Las cámaras deben calibrarse, los espacios de acción deben coincidir, la latencia debe controlarse, hay que construir sistemas de seguridad y cada despliegue debe superar el mundo real. La afirmación significativa es más precisa e importante: un equipo no debería tener que comenzar desde una política en blanco cada vez que cambia la tarea, pinza, habitación, conjunto de objetos o cuerpo del robot.

Xiaomi también muestra resultados de referencia en RoboCasa, RoboCasa365, VLABench y RoboDojo, y afirma que XR-1 ocupó el primer lugar en RoboCasa365 y RoboDojo al 15 de julio de 2026. Los benchmarks no prueban un despliegue, pero dan a equipos externos algo que reproducir, cuestionar y mejorar. Eso es justo lo que necesita la robótica abierta.

## Comparación con Google DeepMind

Gemini Robotics 2, de Google DeepMind, es el sistema más ambicioso en la frontera. DeepMind dice que permite control completo de humanoides desde pies a dedos, mejor destreza, trabajo en equipo entre robots y adaptación a nuevos cuerpos robóticos con solo pocas horas de datos. Su modelo de razonamiento incorporado, [Gemini Robotics ER 2](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/gemini-robotics-er-2/), está concebido como el cerebro de alto nivel: entiende video, sigue el progreso de tareas, planifica flujos de trabajo multi-paso, invoca herramientas y delega la ejecución a controladores robóticos de bajo nivel.

La historia para desarrolladores es diferente. La [documentación de la API robótica de Google](https://ai.google.dev/gemini-api/docs/robotics-overview) hace disponible Gemini Robotics ER 2 mediante la API Gemini y AI Studio, incluyendo endpoints estándar y de vista previa streaming. El modelo amplio de acción Gemini Robotics 2 y el modelo en dispositivo permanecen más como un camino para socios en acceso temprano. La [tarjeta del modelo de Google](https://deepmind.google/models/model-cards/gemini-robotics-er-2/) describe distribución por API y términos de uso, no una liberación de pesos abiertos que laboratorios externos puedan inspeccionar, bifurcar o ajustar libremente.

Esto no hace que el enfoque de Google sea erróneo. La robótica es sensible a la seguridad, depende del hardware y es caro validar. Una liberación controlada puede proteger calidad, gestionar riesgos y apoyar socios serios. Pero significa que la ruta de adopción está restringida. Los desarrolladores pueden construir con endpoints de razonamiento expuestos, pero no reciben la pila robótica completa subyacente.

Xiaomi hace un argumento de ecosistema distinto. Si los pesos del modelo, código, benchmarks y ruta de despliegue están disponibles, laboratorios pequeños, universidades, fabricantes de componentes y equipos independientes pueden probar el modelo en sus propios embodied robots. Pueden publicar fallos. Pueden adaptarlo a hardware específico. Pueden compararlo con sistemas competidores sin esperar una negociación de desarrollo de negocios.

## La estrategia abierta de robótica de China se aclara

Xiaomi-Robotics-1 no es una señal aislada. Xiaomi ya lanzó [Xiaomi-Robotics-0](https://huggingface.co/papers/2602.12684), un modelo VLA open-source enfocado en ejecución en tiempo real. Su organización en Hugging Face lista ahora modelos Xiaomi-Robotics-1, variantes Xiaomi-Robotics-0 y la colección del modelo base mundial Xiaomi-Robotics-U0. La DAMO Academy de Alibaba ha publicado [RynnBrain](https://arxiv.org/abs/2602.14979), descrito como una familia open-source de modelos base embodied para comprensión espacio-temporal, razonamiento, planificación y transferencia VLA. AgiBot lanzó [AGIBOT WORLD 2026](https://agibot-world.com/), una iniciativa abierta de conjuntos de datos de IA embodied basada en datos reales de robótica.

El patrón no es solo "China abierto, América cerrado." Meta, NVIDIA, Hugging Face, universidades y comunidades robóticas abiertas en EE.UU. y Europa contribuyen mucho a la IA y robótica abierta. Pero en humanoides comerciales y IA embodied, el centro de gravedad diverge. Las empresas chinas parecen cada vez más dispuestas a publicar activos de modelos y datasets para acelerar el ecosistema. Las empresas robóticas estadounidenses suelen mantener privado el núcleo del modelo porque está ligado directamente a un producto, flota o negocio robótico verticalmente integrado.

Para la adopción, esa distinción importa. Los robots no son como chatbots, donde un equipo puede cambiar una API por otra en un fin de semana. Un modelo de robot debe integrarse con cámaras, manos, ruedas, brazos, baterías, middleware, casos de seguridad, instalaciones y personas. Cuanto más cerrado esté el modelo, más difícil resulta para terceros entender por qué un robot se comporta así o adaptarlo a restricciones locales.

Los modelos abiertos no resuelven la robótica. Cambian quién puede trabajar en las partes no resueltas.

## Por qué la apertura ayuda a la adopción en robótica

El mayor beneficio de un modelo base robótico abierto no es ideológico. Es el área operativa. Más equipos pueden probar el mismo modelo en más entornos, en más hardware, con más casos de fallo de los que cualquier compañía sola puede gestionar internamente.

Eso importa porque el fallo en robótica es local. Un modelo que funciona en un laboratorio prístino puede fallar en un pasillo de hotel, un cuartito de restaurante, un pasillo de almacén o una casa con mala iluminación y ubicación inconsistente de objetos. Las liberaciones abiertas permiten que investigadores y practicantes publiquen esas discrepancias. También permiten a la comunidad desarrollar adaptadores, scripts de evaluación, envoltorios de seguridad y recetas de despliegue alrededor de una base común.

Los modelos abiertos también reducen el costo de entrada para constructores fuera de las grandes empresas. Una startup construyendo un robot de inspección especializado, un laboratorio universitario estudiando comportamiento de transferencia, o un fabricante probando una pinza nueva pueden empezar con un modelo base existente en vez de recolectar un corpus completo desde cero. Eso no elimina la necesidad de datos reales, pero puede mover el trabajo inicial de "¿podemos entrenar algo?" a "¿qué tan bien se transfiere a nuestra tarea?"

También hay un beneficio en interacción humano-robot. Cuando más equipos pueden inspeccionar, adaptar y evaluar el modelo, la conversación de diseño se amplía. Investigadores UX, gerentes de producto, investigadores de seguridad y equipos de operaciones pueden empezar a preguntar cómo el sistema representa incertidumbre, cuándo pide ayuda, cómo se recupera, cómo se muestra el progreso y dónde debe quedar el control humano. Los sistemas cerrados suelen exponer esas preguntas solo tras la estabilización del comportamiento del producto.

## El riesgo es fingir que abierto significa desplegable

La etiqueta open source merece escrutinio. Una liberación en robótica puede incluir código sin pesos útiles, pesos sin datos de entrenamiento, afirmaciones de entrenamiento sin evaluación reproducible, o una licencia que limita el uso práctico. Xiaomi-Robotics-1 es más útil porque la liberación pública apunta a código, recursos en Hugging Face, evaluación de benchmarks y materiales de despliegue. Aun así, los equipos deben inspeccionar la licencia real, los archivos del modelo, disponibilidad de datos, suposiciones de hardware y requisitos de despliegue antes de considerarlo base para un producto.

Los modelos abiertos también plantean preguntas de seguridad. Más acceso significa más experimentación, incluso integraciones de baja calidad. En robótica, una integración pobre puede dañar propiedades o lesionar personas. La respuesta no es retirarse completamente a sistemas cerrados. Es hacer que la evaluación, envoltorios de seguridad, paradas de emergencia, registros, pruebas en simulación y restricciones de despliegue sean tan compartibles como el modelo mismo.

Ahí será juzgada la liberación de Xiaomi. El titular es el modelo. El valor del ecosistema vendrá de si equipos externos pueden reproducir resultados, adaptarlo a nuevos robots, reportar fallos honestamente y construir prácticas de despliegue más seguras.

## La verdadera carrera es la capa de plataforma robótica

Google DeepMind impulsa la frontera del razonamiento incorporado e inteligencia corporal completa. Xiaomi impulsa la robótica open source hacia una plataforma de modelos base. No son el mismo movimiento.

El sistema de Google muestra qué puede ser la inteligencia robótica de alta gama: una capa de razonamiento que entiende escenas físicas, sigue progreso, coordina varios robots y maneja cuerpos complejos con hardware asociado. La liberación de Xiaomi muestra cómo podría difundirse la capacidad robótica: mediante pesos abiertos, benchmarks comunes, código reutilizable de despliegue y una comunidad creciente de laboratorios y constructores.

La pregunta de adopción ya no es solo qué modelo tiene mejor desempeño en una demo. Es qué modelo da al mercado amplio acceso suficiente para aprender, adaptar, gobernar y confiar en robots en entornos ordinarios.

Si China sigue liberando modelos robóticos abiertos usables mientras las empresas estadounidenses mantienen sus sistemas clave encerrados en sus productos, la diferencia puede no verse primero en los puntajes de benchmark. Puede verse en la difusión. Más gente podrá construir, probar, enseñar y criticar los sistemas abiertos. Así es como compone un ecosistema.

La robótica seguirá necesitando excelentes productos cerrados. Pero el campo también necesita bases compartidas. Xiaomi-Robotics-1 es señal de que la capa base de inteligencia robótica puede no pertenecer solo a las empresas que venden robots.
