# Anzio Etiquetas

Este es un proyecto desarrollado para Frigosorno SA, que cumple como objetivo establecer una integración con el sistema que ellos usan escrito en COBOL, para facilitar la creación y gestión de formatos de etiquetas de impresión.

## Implementación:
### Frontend
- Estando en consola, en la raíz del proyecto:
```shell
$ cd ./client-web/
```
- Descargar dependencias:
```shell
$npm i
```
- Compilar:
```shell
npx ng build --prod
```

### Backend:

- Estando en consola, en la raíz del proyecto:
```shell
$ cd ./server/
```
- Descargar dependencias:
```shell
$ npm i
```
- Transpilar todo:
```shell
$ npx tsc
```
- Crearemos os archivos de configuración, para eso hay que iniciar el proyecto:
```shell
$ npm start server
```
- En la consola aparecerán un par de errores, y creará los archivos `'./appconfig.json'` y `'./ormconfig.json'`. Configure esos archivos dependiendo de cómo desea implementar el proyecto. En `'./ormconfig.json'`, tiene que indicar una base de datos ya creada, pero totalmente vacía.
- Luego de tener la base de datos creada y los archivos listos, hay que migrar el modelo de DB:
```shell
$ npx typeorm migration:run
```
- Luego insertar los datos por defecto del proyecto:
```shell
$ npm start seeds
```
- Finalmente el poryecto está listo para su uso:
```shell
$ npm start server
```
