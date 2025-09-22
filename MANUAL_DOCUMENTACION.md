# Manual de Documentación

## Descripción General

Logic Programming es una plataforma interactiva para el aprendizaje de lógica de programación, diagramas de flujo, pseudocódigo y conceptos fundamentales de la programación. El proyecto está desarrollado en Angular y utiliza Electron para empaquetado de escritorio.

## Estructura del Proyecto

- **src/app/**: Componentes principales de la aplicación Angular.
- **src/assets/**: Recursos estáticos (imágenes, JSON, gifs, etc).
- **src/app/shared/**: Componentes reutilizables, servicios y utilidades.
- **src/app/home/modulos/**: Módulos temáticos (variables, funciones, modularidad, etc).
- **dist_electron/**: Archivos generados para la versión de escritorio.

## Instalación y Ejecución

1. Clona el repositorio.
2. Instala dependencias:
   ```
   npm install
   ```
3. Ejecuta en modo desarrollo:
   ```
   npm start
   ```
4. Para empaquetar la app de escritorio:
   ```
   npm run electron:build
   ```

## Principales Dependencias

- Angular
- Electron
- Tailwind CSS
- PrimeNG

## Estructura de Componentes

Cada componente Angular está documentado con comentarios JSDoc/TSDoc en el código fuente. Los principales componentes incluyen:

- **app.component**: Componente raíz.
- **puzzle.component**: Lógica de ejercicios tipo puzzle.
- **flowchart.component**: Renderizado y navegación de diagramas de flujo.
- **blockly-exercise.component**: Ejercicios interactivos con Blockly.
- **modularidad.component**: Módulo de funciones y modularidad.

## Convenciones de Código

- Uso de TypeScript estricto.
- Componentes y servicios documentados con JSDoc/TSDoc.
- Estilos con Tailwind y clases utilitarias.

## Documentación Interna

- Cada archivo TypeScript incluye comentarios sobre el propósito de la clase, métodos y propiedades.
- Los servicios explican su función y cómo inyectarlos.
- Los módulos temáticos tienen comentarios sobre su objetivo educativo.

## Pruebas

- Para ejecutar los tests:
  ```
  npm test
  ```
- Los tests cubren lógica de componentes y servicios principales.

## Créditos y Licencia

Desarrollado por Napssters. Licencia MIT.

---

> Este manual de documentación puede exportarse a Word para su entrega formal. Incluye la estructura, convenciones y guía de uso para desarrolladores y mantenedores del proyecto.
