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
		document.onkeydown = (ev: KeyboardEvent) => {
			this.KeyPress(ev, false);
		}
		
		document.onkeyup = (ev: KeyboardEvent) => {
			this.KeyPress(ev, true);
		}
	}
	
	ngAfterViewInit(): void {
		this.BeginInit();
	}

	@ViewChild('splash')
	private canvasRef: ElementRef;
	private get canvas(): HTMLCanvasElement {
		return this.canvasRef.nativeElement;
	}

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
		this.renderer.setClearColor(0xffffff, 1);
		this.renderer.autoClear = true;
		this.camera.position.z = 5;

		this.Meshes.push(new Cube());
		
		this.Meshes.forEach(x=> {
			this.scene.add(x.Element);
		});
		
		var isDrawing = false;
		Observable.interval(16).subscribe(x=> {
			if(!isDrawing){
				
				this.Meshes.forEach(x=> {
					x.Interval();
				});
				
				isDrawing = true;
				this.Animate();
				isDrawing = false;
			}
		});
	}

	private KeyPress(press: KeyboardEvent, isPressed:boolean) {
		this.Meshes.forEach(x=> {
			if(isPressed)
				x.KeyDown(press);
			else
				x.KeyUp(press);
		});
	}

	private Animate() {
		this.renderer.render(this.scene, this.camera);
	}
}