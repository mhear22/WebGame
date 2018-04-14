import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import * as three from "three";
import { Scene, PerspectiveCamera, WebGLRenderer, Mesh, Vector3, Camera } from "three";
import { promise } from "selenium-webdriver";
import { Observable } from "rxjs";
import { Asset } from "../../objects/asset";
import { Cube } from "../../objects/cube";
import { CameraController } from "../Service/Camera";

@Component({
	selector: 'app',
	template: require('./app.html')
})
export class App implements AfterViewInit {

	constructor() {
		document.onkeydown = (ev: KeyboardEvent) => this.KeyPress(ev, true);
		document.onkeyup = (ev: KeyboardEvent) => this.KeyPress(ev, false);
		document.onmousewheel = (ev: MouseEvent) => this.MouseEvent(ev);
		document.onmousemove = (ev: MouseEvent) => this.MouseEvent(ev);
		document.onclick = (ev: MouseEvent) => this.MouseEvent(ev, ev.button + 1);
	}

	ngAfterViewInit(): void {
		this.BeginInit();
	}

	@ViewChild('splash')
	private canvasRef: ElementRef;
	private get canvas(): HTMLCanvasElement {
		return this.canvasRef.nativeElement;
	}

	private keyMap: any = {};
	private scene: Scene;
	private renderer: WebGLRenderer;
	private cam: CameraController;
	
	private Meshes: Asset[] = [];

	private BeginInit() {
		this.scene = new three.Scene();
		this.cam = new CameraController(this.canvas);
		
		this.renderer = new three.WebGLRenderer({
			canvas: this.canvas,
			antialias: true
		});
		this.renderer.setPixelRatio(devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = three.PCFSoftShadowMap;
		this.renderer.setClearColor(0x000000, 1);
		this.renderer.autoClear = true;

		this.Meshes.push(new Cube(2, 2, 2,0,0,10));
		this.Meshes.push(new Cube(2, 2, 2,0,0,-10));
		this.Meshes.push(new Cube(2, 2, 2,0,10,0));
		this.Meshes.push(new Cube(2, 2, 2,0,-10,0));
		this.Meshes.push(new Cube(2, 2, 2,10,0,0));
		this.Meshes.push(new Cube(2, 2, 2,-10,0,0));

		this.Meshes.forEach(x => {
			this.scene.add(x.Element);
		});

		var isDrawing = false;

		var lastFrame = new Date();
		Observable.interval(1).subscribe(x => {
			if (!isDrawing) {
				var split = new Date();
				this.Logic(this.getTimeSplit(lastFrame, split)/100);
				lastFrame = split;
				isDrawing = true;
				this.Animate();
				isDrawing = false;
			}
		});
	}
	
	private getTimeSplit(initalDate:Date, secondDate:Date):number {
		var init = initalDate.getMilliseconds();
		var sec = secondDate.getMilliseconds();
		
		var split = 0;
		if(init > sec) {
			split = (1000 - init) + sec
		}
		else
			split = sec - init;
		return split;
	}

	private KeyPress(press: KeyboardEvent, isPressed: boolean) {
		this.keyMap[press.key] = isPressed;
	}

	private MouseEvent(mouse: MouseEvent, mouseKey: number = 0) {
		this.cam.MouseEvent(mouse,mouseKey);
	}
	
	private Logic(lastFrameSplit:number) {
		if (this.keyMap[" "]) {
			var nuCube = new Cube();
			this.Meshes.push(nuCube);
			this.scene.add(nuCube.Element);
		}
		this.Meshes.forEach(x => {
			x.Interval(this.keyMap, lastFrameSplit);
		});
		this.cam.Interval(this.keyMap, lastFrameSplit);
	}

	private Animate() {
		this.renderer.render(this.scene, this.cam.camera);
	}
}