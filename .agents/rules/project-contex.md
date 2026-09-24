# Contexto del proyecto

Este proyecto es una plataforma web de minijuegos multijugador local.

Un dispositivo actúa como pantalla principal y host de la partida, mientras que los jugadores se conectan desde sus móviles mediante un código de sala y utilizan sus teléfonos como mandos.

## Concepto principal

* El host crea una sala.
* Se genera un código único.
* El código se muestra en la pantalla principal.
* Los jugadores introducen el código desde sus móviles.
* Los jugadores aparecen dentro de la sala.
* El host selecciona el minijuego.
* El juego se ejecuta en la pantalla principal.
* Los móviles funcionan como controladores.
* Las acciones y el estado de la partida deben sincronizarse en tiempo real.
* Al terminar una partida se puede seleccionar otro juego sin crear necesariamente una sala nueva.

## Arquitectura

La aplicación debe tratarse como una plataforma reutilizable, no como un conjunto de juegos aislados.

Los sistemas principales deben ser reutilizables entre juegos:

* Gestión de salas.
* Códigos de acceso.
* Jugadores.
* Comunicación en tiempo real.
* Sincronización.
* Eventos.
* Puntuaciones.
* Estados de partida.
* Host.
* Controladores móviles.

Los minijuegos deben diseñarse como módulos independientes que utilicen esta infraestructura.

## Objetivo

La arquitectura debe permitir añadir muchos minijuegos nuevos de forma sencilla, evitando duplicar lógica y evitando implementar soluciones específicas que solo funcionen para un único juego.

Cualquier nueva funcionalidad debe considerar cómo encaja dentro de la plataforma completa y si puede hacerse reutilizable.
