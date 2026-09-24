# Descripción del proyecto

El proyecto consiste en desarrollar una aplicación web de entretenimiento multijugador local, inspirada en plataformas como Play Cloud, donde los usuarios puedan acceder a una gran colección de minijuegos diseñados para jugar con amigos.

## Concepto principal

La aplicación funcionará utilizando dos tipos de dispositivos:

* **Dispositivo principal (host):** puede ser un portátil, ordenador, móvil o tablet. Este dispositivo se conecta a una sala y actúa como pantalla principal del juego. Desde él se seleccionará el minijuego, se mostrará la partida y aparecerá el código necesario para que otros jugadores se unan.
* **Dispositivos jugadores:** principalmente móviles. Los jugadores accederán a la aplicación desde su móvil, introducirán el código de la sala y quedarán conectados a la partida. El móvil funcionará como el mando o controlador del jugador.

El objetivo es que varias personas puedan estar juntas físicamente y utilizar un único dispositivo como pantalla mientras cada jugador utiliza su propio móvil como mando.

## Flujo de uso

1. Una persona abre la aplicación en un portátil, tablet o móvil.
2. Ese dispositivo crea una nueva sala.
3. La aplicación genera un código único para la sala.
4. El código se muestra en la pantalla principal.
5. Los demás jugadores abren la aplicación desde sus móviles.
6. Cada jugador introduce el código de la sala.
7. Los móviles se conectan a la sala y aparecen como jugadores dentro de la pantalla principal.
8. El host selecciona el minijuego que se quiere jugar.
9. Todos los jugadores participan utilizando sus móviles como controles.
10. La partida se desarrolla y el resultado se muestra en el dispositivo principal.
11. Al terminar, los jugadores pueden volver al menú y seleccionar otro minijuego sin necesidad de crear una nueva sala.

## Objetivo del producto

La aplicación debe ser rápida, sencilla y divertida de utilizar, especialmente en situaciones en las que varias personas están juntas y quieren empezar a jugar inmediatamente sin instalaciones ni configuraciones complicadas.

La experiencia debe centrarse en:

* Unirse a una partida mediante un código sencillo.
* Utilizar el móvil como mando.
* Tener una gran variedad de minijuegos.
* Poder cambiar de juego rápidamente.
* Soportar varios jugadores simultáneamente.
* Tener una interfaz clara y fácil de entender.
* Hacer que la experiencia funcione correctamente tanto en ordenadores como en móviles y tablets.

## Arquitectura conceptual

El sistema estará compuesto por tres elementos principales:

### 1. Lobby / Host

El dispositivo que crea la sala controla la partida y muestra:

* Código de la sala.
* Jugadores conectados.
* Lista de minijuegos.
* Juego seleccionado.
* Estado de la partida.
* Resultados y clasificación.

### 2. Controlador móvil

Cada jugador accede desde su móvil y, después de introducir el código de sala, obtiene una interfaz adaptada al minijuego actual.

Dependiendo del juego, el móvil podrá utilizar:

* Botones.
* Joysticks virtuales.
* Deslizadores.
* Pulsaciones rápidas.
* Gestos.
* Movimiento o sensores del dispositivo cuando sea compatible.
* Otros controles específicos del minijuego.

### 3. Sistema de salas y comunicación en tiempo real

La aplicación necesita mantener una comunicación en tiempo real entre el dispositivo principal y todos los jugadores conectados.

La sala deberá gestionar como mínimo:

* Creación y eliminación de salas.
* Códigos únicos.
* Entrada y salida de jugadores.
* Identidad de cada jugador.
* Estado actual de la partida.
* Selección del minijuego.
* Sincronización de eventos.
* Puntuaciones.
* Estado de la partida.

## Filosofía de desarrollo

La aplicación debe diseñarse desde el principio de forma modular para poder añadir nuevos minijuegos fácilmente.

Cada minijuego debería poder funcionar como un módulo independiente, definiendo:

* Número de jugadores.
* Pantalla del host.
* Interfaz del controlador móvil.
* Reglas del juego.
* Sistema de puntuación.
* Estados de la partida.
* Eventos necesarios para sincronización.

El objetivo a largo plazo es poder crear una plataforma con muchos minijuegos diferentes sin tener que modificar constantemente la arquitectura principal de la aplicación.

Los agentes de IA que trabajen en el proyecto deben entender que el objetivo no es crear simplemente una colección de juegos independientes, sino construir una **plataforma multijugador reutilizable sobre la que se puedan añadir continuamente nuevos juegos**.
