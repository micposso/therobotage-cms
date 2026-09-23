---
slug: nvidia-hugging-face-open-robotics-ecosystem
title: El ecosistema robótico en el que NVIDIA acaba de invertir
category: ANÁLISIS
date: 'September 4, 2026'
excerpt: >-
  El acuerdo de NVIDIA con Hugging Face convierte a Reachy Mini y Microduck en
  señales de una carrera mayor por desarrollar plataformas abiertas en robótica.
headerImage: /images/news/microduck-open-robotics-platform.webp
thumbnailImage: /images/news/microduck-open-robotics-platform.webp
author: The Robot Age Editorial Team
translation:
  locale: es
  sourceHash: a041ff57998c20bc8b0022d75b561c41868a3ee09e423ff8d61a9202bfbeb23c
  version: 1
  model: gpt-4.1-mini-2025-04-14
  generatedAt: '2026-09-22T18:01:38.604Z'
  reviewed: false
---
El rumor se confirmó. El 3 de septiembre de 2026, NVIDIA [anunció un acuerdo para adquirir Hugging Face](https://blogs.nvidia.com/blog/nvidia-to-acquire-hugging-face/) por 12,930,300,000 dólares. Hugging Face ya posee Pollen Robotics. Pollen está construyendo dos robots de bajo costo y muy diferentes, Reachy Mini y Microduck, que apuntan hacia la misma conclusión: la próxima plataforma robótica no será solo un robot. Será un ecosistema para desarrolladores.

Esto es importante porque NVIDIA no está comprando solo un sitio web de modelos. Está adquiriendo una capa de distribución para desarrolladores: el lugar que millones de creadores ya usan para encontrar modelos, conjuntos de datos, demostraciones, aplicaciones, documentación, rankings y ejemplos funcionales. NVIDIA tiene los chips, la pila de simulación robótica, Jetson, Isaac, GR00T, Cosmos y el lenguaje de la IA física. Hugging Face tiene la comunidad de desarrolladores.

NVIDIA afirma que Hugging Face permanecerá abierto, incluyendo soporte para múltiples nubes, aceleradores, y modelos de todo el ecosistema. Esa promesa es ahora la prueba central. Si NVIDIA mantiene Hugging Face realmente abierto, gana algo más difícil de construir que hardware: confianza, hábito y gravedad de desarrolladores.

El hardware impulsa el inicio de la robótica. Los ecosistemas la hacen crecer exponencialmente.

## Reachy Mini es el argumento de la robótica social

[Reachy Mini](https://pollen-robotics.com/reachy-mini/) es la máquina accesible de interacción humano-robot. Es pequeña, expresiva, y está diseñada para quienes desean experimentar con IA incorporada sin necesidad de un laboratorio robótico. La versión inalámbrica comienza en 499 dólares e incluye un Raspberry Pi CM4, Wi-Fi, USB, cámara, cuatro micrófonos, altavoz, acelerómetro y movimientos animados de cabeza. La versión Lite inicia en 399 dólares y utiliza un computador como cerebro.

Esa lista de especificaciones es modesta. Ese es el punto. Reachy Mini no pretende ser un trabajador de almacén, un asistente humanoide o una plataforma de manipulación hábil. Intenta dar presencia física a un agente de IA: mirar hacia una persona, escuchar, hablar, responder y ofrecer a los desarrolladores un cuerpo pequeño para diseñar a su alrededor.

Es un robot para alfabetización en interacción. Los agentes de voz son fáciles de demostrar en un navegador. Se vuelven más complejos e interesantes cuando el agente tiene cuerpo, dirección de la mirada, postura de escucha y un estado visible de fallo. Reachy Mini permite a diseñadores, investigadores, estudiantes y responsables de producto aprender esas limitaciones directamente.

## Microduck es el argumento de la IA física

[Microduck](https://pollen-robotics.com/microduck/blog/introducing-microduck/) es una apuesta diferente. Es un robot bípedo de 25 cm y menos de 800 g construido alrededor del aprendizaje por refuerzo, transferencia de simulación a real y comportamientos robóticos compartibles. Cuesta 399 dólares en preventa, utiliza 15 motores, tiene cámara, un pequeño sensor de profundidad, dos IMUs y un pico articulado que puede funcionar como una pequeña pinza.

<aside class="spec-card">
  <figure class="spec-card-media">
    <img src="/images/news/microduck-pollen-official.webp" alt="Microduck, un pequeño robot bípedo blanco y naranja de Pollen Robotics, mostrando un render de producto" />
    <figcaption>Microduck, el pequeño robot bípedo de código abierto de Pollen Robotics para experimentos con IA física. Imagen: Pollen Robotics</figcaption>
  </figure>
  <div class="spec-card-body">
    <p class="spec-card-eyebrow">Plataforma bípedo abierta</p>
    <h3 class="spec-card-name">Microduck</h3>
    <p class="spec-card-maker">Pollen Robotics · Hugging Face</p>
    <p class="spec-card-desc">Un bípedo de escala de palma diseñado para aprendizaje por refuerzo, transferencia de simulación a real, comportamientos robóticos compartidos y experimentación asequible con IA física.</p>
    <dl class="spec-card-specs">
      <div><dt>Altura</dt><dd>25 cm</dd></div>
      <div><dt>Peso</dt><dd>Menos de 800 g</dd></div>
      <div><dt>Actuación</dt><dd>15 motores</dd></div>
      <div><dt>Percepción</dt><dd>Cámara, sensor de profundidad, 2 IMUs</dd></div>
      <div><dt>Interacción</dt><dd>Pico articulado como pinza, identidad de audio individual</dd></div>
      <div><dt>Comportamientos</dt><dd>Caminar, sentarse, agacharse, recuperarse, patinar en rollers</dd></div>
      <div><dt>Software</dt><dd>Control abierto del robot, simulación, RL, herramientas sim-a-real</dd></div>
      <div><dt>Precio</dt><dd>399 dólares en preventa antes de impuestos y envío</dd></div>
    </dl>
  </div>
</aside>

Microduck puede caminar, sentarse, agacharse, recuperarse de muchas caídas, patinar en rollers, seguir un punto láser, reaccionar a su entorno y transportar objetos pequeños. Esos comportamientos son juguetones, pero la lógica de la plataforma es seria. El hardware bípedo económico hace que el fallo sea accesible. Si una política es mala, un robot pequeño se cae al suelo. Eso es muy distinto a dañar un humanoide caro o necesitar un laboratorio completo para probar una idea de locomoción.

Pollen es explícito sobre la pila: control del robot, simulación, aprendizaje por refuerzo y sim-a-real deben ser abiertos. Microduck no es solo un robot pequeño. Es un mecanismo de distribución pequeño para experimentos de IA física.

## Son opuestos en la forma más útil

Reachy Mini y Microduck no deben evaluarse como competidores. Son casi opuestos complementarios.

Reachy Mini trata sobre expresión, presencia social e IA orientada a humanos. Pregunta: ¿qué sucede cuando un asistente de IA tiene cara, movimientos, voz, hardware de escucha y un lugar en el escritorio?

Microduck trata sobre control, encarnación y aprendizaje físico. Pregunta: ¿qué pasa cuando estudiantes y desarrolladores en robótica pueden entrenar, compartir y probar comportamientos de movimiento en un bípedo económico?

Uno es para IA que interactúa. El otro, para IA que actúa. Uno pertenece a la tradición de la robótica social y las interfaces de compañía. El otro a la de aprendizaje por refuerzo, locomoción con patas e investigación sim-a-real. Pollen usa ambos para hacer el mismo argumento sobre ecosistemas: si el hardware es suficientemente barato y el software suficientemente abierto, más personas podrán desarrollar intuición práctica sobre robots.

## Hugging Face no compró una empresa robótica por accidente

Hugging Face [adquirió Pollen Robotics en 2025](https://huggingface.co/blog/hugging-face-pollen-robotics-acquisition). Ese movimiento parecía inusual solo si Hugging Face se entiende como un sitio web de modelos. Tiene mucho más sentido si se ve como una capa de distribución de IA.

La robótica necesita precisamente lo que Hugging Face ya sabe organizar: modelos, conjuntos de datos, demos, documentación, comunidad, rankings, versionado y el hábito social de compartir artefactos funcionales. El proyecto [LeRobot](https://github.com/huggingface/lerobot) de Hugging Face ya apunta en esta dirección: herramientas comunes para recolectar datos, entrenar políticas y trabajar con robots reales.

La parte difícil de la robótica no es solo construir un robot. Es hacer que el ciclo de aprendizaje sea repetible para muchas personas, máquinas y entornos. La robótica de código abierto busca hacer que el comportamiento robótico sea menos magia propietaria y más software inspeccionable.

Eso no hace que todo robot abierto sea desplegable. Sí hace que cada robot abierto sea más discutible, testeable, bifurcable y enseñable.

## Los equivalentes chinos no son una sola cosa

No existe un equivalente chino exacto de Reachy Mini junto con Microduck porque el mercado robótico chino aborda el problema de la plataforma desde varias direcciones simultáneas.

[Unitree R1](https://www.unitree.com/R1/) es la señal de asequibilidad más obvia. Unitree lista el R1 Air a 4,900 dólares y el R1 a 5,900 dólares antes de impuestos y envío. No es un juguete de escritorio. Es una plataforma de desarrollo de clase humanoide de bajo costo, que cambia la pregunta de "¿podemos permitirnos un humanoide?" a "¿estamos listos para gestionarlo?"

[Unitree G1](https://www.unitree.com/g1/) es una plataforma de investigación humanoide más avanzada. Está más cerca del desarrollo robótico de cuerpo completo que de la categoría de aprendizaje de escritorio. Si Microduck es un bípedo pequeño para experimentos económicos, los humanoides de Unitree son la señal seria china de que el hardware de robots con patas se está abaratando rápidamente.

[myCobot 280 Pi de Elephant Robotics](https://www.elephantrobotics.com/en/mycobot-pi/) es mejor comparación para manipulación de escritorio. Es un brazo robótico pequeño con Raspberry Pi, flujos de trabajo compatibles con Python y ROS, y un camino más claro hacia aplicaciones de pick-and-place, visión y control de brazo. Es menos carismático que Reachy Mini y menos orientado a comportamientos que Microduck, pero podría ser más útil para educación en manipulación.

Los kits educativos de compañías como [Hiwonder](https://docs.hiwonder.com/projects/TonyPi/en/latest/docs/1.getting_ready.html) y [Yahboom](https://github.com/YahboomTechnology/ROSMASTERX3) complementan el panorama: humanoides con Raspberry Pi, robots móviles con ROS, percepción basada en cámaras, LiDAR, mapeo, seguimiento de línea, detección de color y hardware curricular práctico. Estos sistemas no tienen la fuerza cultural de Hugging Face, pero sí ventaja en disponibilidad y precio.

La señal mayor de código abierto en China ocurre a nivel de modelos. El proyecto [Xiaomi-Robotics-1](https://github.com/XiaomiRobotics/Xiaomi-Robotics-1) de Xiaomi enmarca la inteligencia robótica como infraestructura compartida: código abierto, recursos de modelos, benchmarks y materiales para despliegue de modelos robóticos de visión-lenguaje-acción. El esfuerzo de datos [AGIBOT WORLD](https://agibot-world.com/) de AgiBot expresa un punto similar desde el lado de los datos. China no solo compite con cuerpos robóticos, compite en la difusión robótica.

## Lo que NVIDIA está comprando

NVIDIA ya tiene el centro de gravedad en hardware. No necesita Hugging Face porque no tenga chips. Lo necesita porque los desarrolladores robóticos no se organizan primero en torno a un proveedor de chips. Se organizan alrededor de ejemplos, modelos, conjuntos de datos, notebooks, demos, APIs, repositorios y otros desarrolladores.

Ese es el terreno de Hugging Face.

En la capa de IA, NVIDIA está comprando alcance. Jensen Huang escribió que más de 18 millones de desarrolladores, investigadores y creadores usan Hugging Face para compartir más de 3 millones de modelos, 500,000 conjuntos de datos y 1 millón de aplicaciones, con más de 200,000 empresas usando la plataforma para descubrir, evaluar, personalizar y desplegar IA. Eso no es solo tráfico, es la superficie de trabajo donde los modelos abiertos se vuelven útiles.

En la capa robótica, NVIDIA está comprando un puente hacia la IA incorporada. Hugging Face tiene LeRobot para entrenar y compartir políticas robóticas, una comunidad de datasets robóticos en rápido crecimiento y la línea de hardware de Pollen Robotics. La propia [revisión del ecosistema open-source](https://huggingface.co/blog/huggingface/state-of-os-hf-spring-2026) de Hugging Face describe robótica como una de las subcomunidades que más crecen en el Hub, con conjuntos de datos robóticos en aumento y Pollen abriendo ventas a laboratorios, empresas y aficionados. Reachy Mini y Microduck hacen visible esa estrategia: un robot para interacción humana y otro para aprendizaje físico.

En la capa empresarial, NVIDIA está comprando opcionalidad. Si la IA se desplaza hacia pesos abiertos, modelos especializados más pequeños, despliegue local, conjuntos de datos robóticos o flujos de trabajo de IA física, Hugging Face será donde gran parte de ese cambio aparecerá primero. Eso convierte la adquisición en una cobertura frente a un futuro donde la capa de modelos se fragmente entre laboratorios, países, nubes y pilas de hardware.

Con Hugging Face, NVIDIA puede conectar la pila robótica verticalmente:

- Descubrir modelos y políticas robóticas en Hugging Face.
- Entrenar y evaluar con herramientas abiertas como LeRobot.
- Simular en NVIDIA Isaac.
- Usar modelos robóticos y modelos del mundo de NVIDIA como punto de partida.
- Desplegar en Jetson, estaciones de trabajo RTX o GPUs en la nube.

Ese es el manual CUDA extendido hacia la IA física. La ganancia a largo plazo no es vender una GPU más. Es hacer de NVIDIA el lugar por defecto donde los desarrolladores robóticos aprenden, prototipan, evalúan y despliegan.

## El riesgo de código abierto

Hay un riesgo real en esta estrategia. Hugging Face funciona porque los desarrolladores confían en él como terreno neutral. Si se convierte en un canal obvio de NVIDIA, parte de esa confianza podría debilitarse. El mundo robótico particularmente necesita evaluación abierta, conjuntos de datos transparentes, fallos reproducibles y diversidad de hardware. Un hub de modelos que favorezca silenciosamente la pila de un proveedor podría frenar el movimiento que desea liderar.

Pero si NVIDIA mantiene realmente abierto a Hugging Face, el resultado podría ser poderoso. La robótica aún está demasiado fragmentada. Un desarrollador puede aprender modelos de lenguaje con una laptop y una tarjeta de modelo. Aprender robots todavía requiere hardware, drivers, simuladores, prácticas de seguridad, calibración y tolerancia al fallo físico. El campo necesita un lugar donde esas piezas puedan compartirse públicamente.

Reachy Mini y Microduck son máquinas pequeñas, pero apuntan a una gran pregunta de plataforma. La empresa robótica que gane la próxima década podría no ser la que tenga la demostración más impresionante. Podría ser la que brinde a más personas una forma de construir, romper, aprender y compartir.

Por eso el acuerdo NVIDIA-Hugging Face importa. No porque Hugging Face tenga un robot pato de 399 dólares. Porque ahora ofrece a NVIDIA un camino directo hacia el lugar donde la robótica se convierte en un movimiento de desarrolladores.
