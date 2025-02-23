# Compilador Proyecto

Este proyecto es un compilador simple que incluye análisis léxico, sintáctico y semántico, así como generación de código intermedio y optimización. A continuación se detallan los componentes principales del proyecto.

## Estructura del Proyecto

- **index.html**: Documento HTML principal que incluye referencias a los archivos CSS y JavaScript.
- **styles.css**: Archivo de estilos que define la presentación visual de la aplicación web.
- **script.js**: Código JavaScript principal que maneja las interacciones del usuario e integra los diferentes módulos.
- **modules/**: Directorio que contiene los módulos del compilador:
  - **lexico.js**: Implementa la funcionalidad de análisis léxico (scanner).
  - **sintactico.js**: Implementa la funcionalidad de análisis sintáctico (parser).
  - **semantico.js**: Implementa la funcionalidad de análisis semántico.
  - **intermedio.js**: Genera código intermedio a partir del árbol de análisis.
  - **optimizacion.js**: Contiene rutinas de optimización para mejorar el código intermedio.
  - **automatas.js**: Demuestra conceptos de teoría de autómatas.
- **package.json**: Archivo de configuración para npm que lista las dependencias, scripts y metadatos del proyecto.

## Instrucciones de Configuración

1. Clona el repositorio en tu máquina local.
2. Navega al directorio del proyecto.
3. Ejecuta `npm install` para instalar las dependencias necesarias.

## Uso

Para utilizar el compilador, abre el archivo `index.html` en un navegador web. Puedes interactuar con la aplicación y ver cómo se procesan las entradas a través de los diferentes módulos del compilador.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar el proyecto, por favor abre un issue o envía un pull request.