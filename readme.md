# WebGame app

## To run

Running `npm install` should get all the dependancies

Viewing the HTML in a browser using webpack should run correctly and using Electron will also work. 

### Using Webpack in the browser

`webpack-dev-server` will build and host it and `webpack` will just build the application

### Using Electron to run the game

Installing electron globally and building the application will need to be done before the app is ready. then running electron in the root directory will get it running

# Design

The main game loop is located at `src/Parts/App.ts`. Its a base page for the application run inside of angular.

## Services

These are not Angular Services. These are systems within the game that work on the environment. they are different from Objects as they dont have a rendered Body

## Objects

These are 3d objects that exist in the environment. Each piece of code contains the related work required to run the object. Animations, shaders and textures should all be maintained here

## Scenes

This is a group of objects come together to create an environment.

## Things to be done

* Make the player have a physical coliding body
* build a game in its own scene
	* Maze game
	* FPS?
	* Neat environment
		* Side of a motorway in the rain going over a bank

* Buying and Selling Stores
* Making Money inside the game
* Fix the issue with the hopping mouse
* Menus and settings
* PostProcessing (Aliasing, bloom)

* React site to download versions from


## Assets to get rights for:
* Skybox: From "The Chayed" here https://opengameart.org/content/sky-box-sunny-day


## Project Features:
* able to be exported or run in a server
* automatic deployment
* full scene changing including unloading and loading
* Tweening between locations
* FPS style camera
* Controller support