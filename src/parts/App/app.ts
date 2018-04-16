import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import * as three from "three";
import { Scene, PerspectiveCamera, WebGLRenderer, Mesh, Vector3, Camera } from "three";
import { promise } from "selenium-webdriver";
import { Observable } from "rxjs";
import { Asset } from "../../objects/asset";
import { Cube } from "../../objects/cube";
import { CameraController } from "../Service/Camera";
import { SceneBase } from "../../scenes/sceneBase";
import { TempScene } from "../../scenes/TempScene";

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

	private ShowDebug:boolean = true;
	private FPSString:string = "";
	private MouseString:string = "";
	
	private keyMap: any = {};
	private renderer: WebGLRenderer;
	private Camera: CameraController;
	private Scene:SceneBase;
	private LastSplit:number;
	
	private BeginInit() {
		this.Camera = new CameraController(this.canvas);
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
		
		this.Scene = new TempScene(this.Camera, this.keyMap);
		this.Scene.LoadMeshes();
		var isDrawing = false;

		
		var lastFrame = new Date();
		Observable.interval(16).subscribe(x => {
			if (!isDrawing) {
				isDrawing = true;
				
				var currentFrame = new Date();
				
				this.LastSplit = this.getTimeSplit(lastFrame, currentFrame);
				
				if(this.ShowDebug)
					this.RenderDebug();
				if(this.keyMap["`"])
					this.ShowDebug = !this.ShowDebug;
				
				this.Logic(this.LastSplit/100);
				this.Animate();
				
				lastFrame = currentFrame;
				
				isDrawing = false;
			}
		});
	}
	
	private RenderDebug() {
		var cam = this.Camera.camera;
		
		this.FPSString = `${(1000/this.LastSplit).toFixed(2)}`;
		this.MouseString = `
			X:${cam.rotation.x.toFixed(2)}
			Y:${cam.rotation.y.toFixed(2)}
			Z:${cam.rotation.z.toFixed(2)}
		`;
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
		this.Camera.MouseEvent(mouse,mouseKey);
	}
	
	private Logic(lastFrameSplit:number) {
		this.Scene.Iterate(lastFrameSplit);
		this.Camera.Interval(this.keyMap, lastFrameSplit);
	}
	
	private Animate() {
		this.renderer.render(this.Scene.GetScene(), this.Camera.camera);
	}
}