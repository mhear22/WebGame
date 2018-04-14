import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import * as three from "three";
import { Scene, PerspectiveCamera, WebGLRenderer, Mesh } from "three";
import { promise } from "selenium-webdriver";
import { Observable } from "rxjs";
import { Asset } from "../../objects/asset";
import { Cube } from "../../objects/cube";

@Component({
	selector: 'app',
	template: require('./app.html')
})
export class App implements AfterViewInit {

	constructor() {
		document.onkeydown = (ev: KeyboardEvent) =>this.KeyPress(ev, true);
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
	
	private keyMap:any = {};
	private scene: Scene;
	private camera: PerspectiveCamera;
	private renderer: WebGLRenderer;

	private Meshes:Asset[] = [];
	
	private BeginInit() {
		this.scene = new three.Scene();
		this.camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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
		this.camera.position.z = 5;

		this.Meshes.push(new Cube(2,2,2));
		
		this.Meshes.forEach(x=> {
			this.scene.add(x.Element);
		});
		
		var isDrawing = false;
		
		Observable.interval(16).subscribe(x=> {
			if(!isDrawing){
				if(this.keyMap[" "]) {
					var nuCube = new Cube();
					this.Meshes.push(nuCube);
					this.scene.add(nuCube.Element);
				}
				this.Meshes.forEach(x=> {
					x.Interval(this.keyMap);
				});
				isDrawing = true;
				this.Animate();
				isDrawing = false;
			}
		});
	}

	private KeyPress(press: KeyboardEvent, isPressed:boolean) {
		this.keyMap[press.key] = isPressed;
	}
	
	
	private mouseLocked:boolean = false;
	private MouseEvent(mouse: MouseEvent, mouseKey:number = 0) {
		this.mouseLocked = !(document.pointerLockElement !== this.canvas)
		
		if(this.mouseLocked) {
			var sen = 1000;
			this.camera.rotateY(mouse.movementX/sen);
			this.camera.rotateX(mouse.movementY/sen);
			console.log(`${this.camera.rotation.y} ${this.camera.rotation.x}`);
		}
		if(!this.mouseLocked && mouseKey > 0)
			this.canvas.requestPointerLock();
	}

	private Animate() {
		this.renderer.render(this.scene, this.camera);
	}
}