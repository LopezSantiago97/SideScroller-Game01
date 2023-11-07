
# Sidescroller 2D

## Pasos para clonar
-> Instalar Node.js

-> Instalar Node Package Manager (NPM)

-> Crear carpeta

-> Abrir consola en esa carpeta

-> Ejecutar :

```bash
git init

git clone <LinkRepo>

npm install

npm run start
```

-> Fin


## Observaciones
El mapa esta hecho con Tiled
Las animaciones con X (ver nombre del programa)
Los sprites son de Kenny (ver url)



## TODO
-> Proyectiles

-> Enemigos

-> Gestion de Niveles

-> Game Over

-> Menu principal

-> Sonidos

-> Particulas?

-> Guardar data (ver si lo hago por API a alguna nube o solo local)


====================================================================================================================================

# Phaser 3 + TypeScript + Vite.js
Fuente del fork [phaser3-vite-template](https://github.com/ourcade/phaser3-vite-template).

## Prerequisites

You'll need [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed.

It is highly recommended to use [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm) to install Node.js and npm.

For Windows users there is [Node Version Manager for Windows](https://github.com/coreybutler/nvm-windows).

Install Node.js and `npm` with `nvm`:

```bash
nvm install node

nvm use node
```

Replace 'node' with 'latest' for `nvm-windows`.

## Getting Started

You can clone this repository or use [degit](https://github.com/Rich-Harris/degit) to scaffold the project like this:

```bash
npx degit https://github.com/ourcade/phaser3-typescript-vite-template my-folder-name
cd my-folder-name

npm install
```

Start development server:

```
npm run start
```

To create a production build:

```
npm run build
```

TypeScript files are intended for the `src` folder. 
`main.ts` is the entry point referenced by `index.html`.

## Static Assets

Any static assets like images or audio files should be placed in the `public` folder. 
It'll then be served from the root. 
For example: http://localhost:8000/images/my-image.png

Example `public` structure:

```
    public
    ├── images
    │   ├── my-image.png
    ├── music
    │   ├── ...
    ├── sfx
    │   ├── ...
```

They can then be loaded by Phaser with `this.image.load('my-image', 'images/my-image.png')`.


## Dev Server Port

Se puede modificar el puerto en `vite.config.ts` file. 
Look for the `server` section:

```js
{
	// ...
	server: { host: '0.0.0.0', port: 8000 },
}
```

Se puede cambiar de 8000 al puerto que pinte.
