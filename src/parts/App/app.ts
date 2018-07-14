import { Component, ViewChild, ElementRef, AfterViewInit, inject, Inject } from "@angular/core";
import * as three from "three";
import { WebGLRenderer } from "three";
import { interval } from "rxjs";
import { CameraController } from "../../Services/CameraController";
import { SceneBase } from "../../Scenes/sceneBase";
import { TempScene } from "../../Scenes/TempScene";
import { MatDialog } from "@angular/material/dialog";
import { DebugInfo } from "../../Objects/DebugModel";
import { KeyController } from "../../Services/KeyController";

@Component({
	selector: 'app',
	template: require('./app.html')
})
export class App implements AfterViewInit {

	constructor(@Inject(MatDialog) private dialog:MatDialog) {
		document.onkeydown = (ev: KeyboardEvent) => this.keyController.KeyPress(ev, true);
		document.onkeyup = (ev: KeyboardEvent) => this.keyController.KeyPress(ev, false);
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
	
	private keyController:KeyController;
	private renderer: WebGLRenderer;
	private Camera: CameraController;
	private Scene:SceneBase;
	private LastSplit:number;
	
	public debugInfo:DebugInfo = new DebugInfo();
	public InteractionDialog:string = "";
	
	private BeginInit() {
		this.Camera = new CameraController(this.canvas, this.dialog);
		this.keyController = new KeyController();
		this.renderer = new three.WebGLRenderer({
			canvas: this.canvas,
			antialias: true
		});
		this.renderer.setPixelRatio(devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMapEnabled = true;
		this.renderer.shadowMap.type = three.PCFSoftShadowMap;
		this.renderer.setClearColor(0x000000, 1);
		this.renderer.autoClear = true;
		
		this.Scene = new TempScene(this.Camera, this.keyController);
		var isDrawing = false;

		this.keyController.WaitFor("`", () => {
			console.log("Toggle Debug")
			this.ShowDebug = !this.ShowDebug;
		}, 100);
		
		var lastFrame = new Date();
		interval(16).subscribe(x => {
			if (!isDrawing) {
				isDrawing = true;
				
				var currentFrame = new Date();
				
				this.LastSplit = this.getTimeSplit(lastFrame, currentFrame);
				
				if(this.ShowDebug)
					this.RenderDebug();
				
				this.InteractionDialog = this.Scene.InteractionText;
					
				this.Logic(this.LastSplit/100);
				this.Animate();
				
				lastFrame = currentFrame;
				
				isDrawing = false;
			}
		});
	}
	
	private times:number[] = [];
	private RenderDebug() {
		var cam = this.Camera.camera;
		
		if(this.times.length > 10) {
			var average = this.times.reduce((x,y) => x+y)/this.times.length;
			this.debugInfo.FPSString = `${(1000/average).toFixed(2)}`;
			this.times = [];
		}
		else {
			this.times.push(this.LastSplit);
		}
		
		//this.debugInfo.paintedCount = PathMapper.Squares;
		this.debugInfo.CamSpeed = `${this.Camera.speed}`;
		
		this.debugInfo.CamPosString = `
			X:${cam.position.x.toFixed(2)}
			Y:${cam.position.y.toFixed(2)}
			Z:${cam.position.z.toFixed(2)}
		`
		
		this.debugInfo.MouseString = `
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

	private MouseEvent(mouse: MouseEvent, mouseKey: number = 0) {
		this.Camera.MouseEvent(mouse,mouseKey);
	}
	
	private Logic(lastFrameSplit:number) {
		this.Scene.Iterate(this.keyController, lastFrameSplit);
		this.Camera.Interval(this.keyController, lastFrameSplit);
	}
	
	private Animate() {
		this.renderer.render(this.Scene.GetScene(), this.Camera.camera);
	}
}