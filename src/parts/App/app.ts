import { Component, ViewChild, ElementRef, AfterViewInit, inject, Inject } from "@angular/core";
import * as three from "three";
import { WebGLRenderer } from "three";
import { CameraController } from "../../Services/CameraController";
import { SceneBase } from "../../Scenes/sceneBase";
import { TempScene } from "../../Scenes/TempScene";
import { MatDialog } from "@angular/material/dialog";
import { DebugInfo } from "../../Objects/DebugModel";
import { KeyController } from "../../Services/KeyController";
import { SandboxScene } from "../../scenes/SandboxScene";
import { DebugService } from "../../Services/DebugService";
import { PlayerService } from "../../Services/PlayerService";
import { ServiceManager, HtmlModel } from "../../Services/ServiceManager";

@Component({
	selector: 'app',
	template: require('./app.html')
})
export class App implements AfterViewInit {

	constructor(@Inject(MatDialog) private dialog:MatDialog) {
		document.onkeydown = (ev: KeyboardEvent) => this.keyController.KeyPress(ev, true);
		document.onkeyup = (ev: KeyboardEvent) => this.keyController.KeyPress(ev, false);
		//document.onmousewheel = (ev: MouseEvent) => this.MouseEvent(ev);
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

	private Iterators:any[] = []
	
	private serviceManager:ServiceManager;
	
	private HtmlLayers:HtmlModel[] = []
	
	private ShowDebug:boolean = true;
	
	private keyController:KeyController;
	private renderer: WebGLRenderer;
	private Camera: CameraController;
	private Scene:SceneBase;
	private LastSplit:number;
	private isDrawing = false;
	private lastFrame = Date.now();
	
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
		
		this.Scene = new SandboxScene(this.Camera, this.keyController);
		this.serviceManager = new ServiceManager([
				DebugService,
				PlayerService
			],
			this.Camera,
			this.keyController
		)
		this.HtmlLayers = this.serviceManager.Htmls();
		
		this.isDrawing = false;
		this.lastFrame = Date.now();
		
		this.keyController.WaitFor('p', () => {
			this.isPaused = !this.isPaused;
		},100)
		
		window.requestAnimationFrame(() => this.RunRecursive());
	}
	
	private RunRecursive() {
		window.requestAnimationFrame(() => this.RunRecursive())
		this.Run();
	}
	
	private isPaused = false;
	
	private Run() {
		if (!this.isDrawing && !this.isPaused) {
			this.isDrawing = true;
			
			var currentFrame = Date.now();
			
			this.LastSplit = this.getMSSplit(this.lastFrame, currentFrame);
			
			this.Logic(this.LastSplit);
			
			this.HtmlUpdate(this.LastSplit);
			
			this.Animate();
			
			this.lastFrame = currentFrame;
			
			this.isDrawing = false;
		}
	}
	
	private getMSSplit(initalDate:number, secondDate:number):number {
		return (secondDate - initalDate) / 1000.0;
	}

	private MouseEvent(mouse: MouseEvent, mouseKey: number = 0) {
		this.Camera.MouseEvent(mouse,mouseKey);
	}
	
	private LastHtmlUpdate = 0;
	private HtmlUpdate(split:number) {
		if(this.LastHtmlUpdate > 0.5) {
			this.LastHtmlUpdate = 0;
			
			var current = this.serviceManager.Htmls();
			this.HtmlLayers.forEach(x=> {
				current.forEach(cur=>{
					if(cur.name == x.name) {
						x.html = cur.html;
					}
				});
			});
		}
		this.LastHtmlUpdate += split
		
	}
	
	private Logic(lastFrameSplit:number) {
		this.serviceManager.Iterate(lastFrameSplit);
		this.Scene.Iterate(this.keyController, lastFrameSplit);
		this.Camera.Interval(this.keyController, lastFrameSplit);
	}
	
	private Animate() {
		this.renderer.render(this.Scene.GetScene(), this.Camera.camera);
	}
}