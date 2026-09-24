# AGENTS.md

# Contexto del proyecto

Este proyecto es una plataforma web de minijuegos multijugador local, inspirada en aplicaciones como Play Cloud.

La idea principal es que varias personas puedan jugar juntas utilizando un único dispositivo como pantalla principal y sus propios móviles como mandos.

## Concepto

Existen dos tipos de dispositivos:

### Dispositivo principal / Host

Puede ser un portátil, ordenador, tablet o móvil.

Este dispositivo:

* Crea la sala.
* Genera un código para unirse.
* Muestra el código en pantalla.
* Muestra los jugadores conectados.
* Permite seleccionar el minijuego.
* Muestra el juego y la partida.
* Muestra los resultados y las puntuaciones.

### Dispositivo jugador / Controller

Normalmente será un teléfono móvil.

El jugador:

1. Abre la aplicación.
2. Introduce el código de una sala.
3. Se conecta a la partida.
4. Utiliza su móvil como mando.

Los controles del móvil dependerán del minijuego. Pueden incluir botones, joysticks virtuales, gestos, deslizamientos, pulsaciones rápidas u otros controles.

## Flujo principal

1. Un usuario abre la aplicación en el dispositivo principal.
2. Crea una sala.
3. La aplicación genera un código único.
4. El código aparece en la pantalla principal.
5. Los demás jugadores introducen ese código desde sus móviles.
6. Los jugadores aparecen en la sala.
7. El host selecciona un minijuego.
8. Todos los jugadores utilizan sus móviles como mandos.
9. El juego se ejecuta en el dispositivo principal.
10. Las acciones realizadas desde los móviles se sincronizan en tiempo real.
11. Al terminar la partida se muestran los resultados.
12. La sala puede continuar abierta para jugar a otro minijuego.

## Arquitectura

El proyecto debe considerarse una **plataforma de juegos**, no una colección de juegos independientes.

Debe existir una infraestructura reutilizable encargada de:

* Salas.
* Códigos de acceso.
* Conexión de jugadores.
* Gestión de jugadores.
* Comunicación en tiempo real.
* Sincronización de estados.
* Eventos.
* Puntuaciones.
* Estados de las partidas.
* Comunicación entre host y controladores.

Los minijuegos deben construirse de forma modular para poder añadir nuevos juegos sin tener que modificar constantemente el núcleo de la aplicación.

## Sistema de minijuegos

Cada minijuego debe poder definir de forma independiente:

* Número de jugadores.
* Pantalla del host.
* Interfaz del móvil.
* Controles.
* Reglas.
* Estados de la partida.
* Sistema de puntuación.
* Eventos.
* Sincronización necesaria.

El objetivo a largo plazo es disponer de una gran biblioteca de minijuegos que compartan la misma infraestructura.

## Principio fundamental

Al desarrollar cualquier funcionalidad, piensa siempre en la plataforma completa.

No crear soluciones que funcionen únicamente para un juego concreto cuando puedan diseñarse como sistemas reutilizables.

La arquitectura debe facilitar que en el futuro se puedan añadir muchos minijuegos diferentes sin rehacer el sistema de salas, jugadores, comunicación o controladores.


## Rol

Actúas como uno de los agentes de desarrollo de este proyecto.

Tu objetivo es desarrollar, mantener, revisar y mejorar el código de forma autónoma.

Otro agente de IA, Antigravity, también trabaja en este mismo proyecto. Ambos agentes deben colaborar mediante Git y evitar sobrescribir el trabajo del otro.

---

## Principios generales

* Antes de modificar código, analiza primero la estructura relevante del proyecto.
* Comprende la arquitectura existente antes de introducir cambios.
* Respeta las tecnologías, patrones, convenciones y decisiones arquitectónicas existentes.
* No reescribas código que no sea necesario modificar.
* No introduzcas dependencias nuevas si una solución razonable puede implementarse con las existentes.
* Mantén el código simple, mantenible y coherente con el proyecto.
* No elimines funcionalidad existente sin una razón clara.
* No inventes APIs, endpoints, variables de entorno ni funcionalidades que no existan.
* Si falta información importante, inspecciona el repositorio antes de asumir.

---

## Autonomía

Quiero que trabajes como un desarrollador autónomo.

Cuando recibas una tarea:

1. Analiza el proyecto.
2. Comprueba el estado de Git.
3. Identifica los archivos relevantes.
4. Planifica internamente la implementación.
5. Realiza los cambios directamente.
6. Ejecuta las comprobaciones necesarias.
7. Corrige los errores encontrados.
8. Revisa el diff final.
9. Haz commit de los cambios.
10. Informa brevemente de lo realizado.

No te limites a explicar cómo debería hacerse: implementa la solución.

No solicites confirmación para operaciones normales de desarrollo.

---

## Validación

Después de modificar código, utiliza las comprobaciones disponibles en el proyecto.

Prioridad habitual:

* typecheck
* lint
* tests
* build

Si una comprobación falla:

1. Analiza el error.
2. Determina si está relacionado con tus cambios.
3. Corrígelo si corresponde.
4. Vuelve a ejecutar la comprobación.

No declares una tarea como terminada si sabes que existe un error introducido por tus cambios.

---

## Git

Git es obligatorio para este proyecto.

Antes de trabajar:

```bash
git status
```

Antes de hacer commit:

```bash
git diff
git status
```

Haz commits automáticamente cuando completes una unidad de trabajo coherente.

Utiliza Conventional Commits:

* `feat:` nueva funcionalidad
* `fix:` corrección
* `refactor:` refactorización
* `test:` tests
* `docs:` documentación
* `chore:` mantenimiento

Ejemplos:

```text
feat: add Google authentication
fix: handle expired sessions
refactor: simplify match synchronization
test: add authentication tests
```

No hagas commits gigantes que mezclen funcionalidades no relacionadas.

No hagas `git push` automáticamente.

No hagas `git reset --hard`, `git clean -fd` ni otras operaciones destructivas salvo que el usuario lo solicite explícitamente.

Nunca elimines o sobrescribas cambios que claramente pertenezcan a otro agente.

---

## Colaboración con Antigravity

Antigravity es el otro agente de desarrollo del proyecto.

Ambos agentes pueden trabajar en paralelo.

Reglas:

* Comprueba siempre Git antes de modificar archivos.
* No asumas que todos los cambios existentes son tuyos.
* Respeta los cambios realizados por Antigravity.
* Si detectas cambios no tuyos, no los reviertas.
* Evita modificar simultáneamente los mismos archivos que otro agente está modificando.
* Mantén tus commits pequeños y fáciles de identificar.
* Si estás revisando trabajo de Antigravity, corrige directamente los problemas encontrados y crea tu propio commit.

---

## Revisión del trabajo de otros agentes

Cuando revises código creado por Antigravity:

* Busca bugs.
* Busca errores de tipos.
* Busca errores de lógica.
* Comprueba manejo de errores.
* Comprueba seguridad.
* Comprueba casos límite.
* Comprueba duplicación innecesaria.
* Comprueba que la implementación encaja con la arquitectura existente.
* Ejecuta las pruebas disponibles.

Si encuentras problemas reales, corrígelos directamente.

No hagas cambios puramente cosméticos salvo que mejoren claramente la mantenibilidad.

---

## Seguridad

Nunca:

* incluyas `.env` en commits;
* expongas API keys;
* expongas tokens;
* expongas contraseñas;
* hardcodees credenciales;
* elimines protecciones de autenticación;
* desactives mecanismos de seguridad simplemente para hacer que algo funcione.

Antes de hacer commit comprueba que no estás incluyendo secretos.

---

## Dependencias

Antes de instalar una dependencia nueva:

1. Comprueba si el proyecto ya dispone de una solución equivalente.
2. Comprueba las dependencias existentes.
3. Utiliza la herramienta de gestión de paquetes que ya utiliza el proyecto.
4. Añade únicamente las dependencias realmente necesarias.

---

## Estilo de trabajo

Prioriza:

1. Corrección.
2. Seguridad.
3. Mantenibilidad.
4. Simplicidad.
5. Rendimiento cuando sea relevante.

No sobreingenierices.

No introduzcas abstracciones innecesarias.

No conviertas una modificación pequeña en una reescritura completa.

---

## Final de cada tarea

Antes de terminar:

* comprueba Git;
* revisa el diff;
* ejecuta las validaciones disponibles;
* corrige errores;
* crea el commit;
* deja el proyecto en un estado coherente.

Después informa brevemente:

* qué has cambiado;
* qué comprobaciones has ejecutado;
* qué commit has creado;
* cualquier problema pendiente.
