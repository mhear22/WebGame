import { Component, ViewChild, ElementRef, AfterViewInit, inject, Inject } from "@angular/core";
import * as three from "three";
import { WebGLRenderer } from "three";
import { CameraController } from "../../Services/CameraController";
import { SceneBase } from "../../Scenes/SceneBase";
import { TempScene } from "../../Scenes/TempScene";
import { MatDialog } from "@angular/material/dialog";
import { DebugInfo } from "../../Objects/DebugModel";
import { KeyController } from "../../Services/KeyController";
import { SandboxScene } from "../../Scenes/SandboxScene";
import { DebugService } from "../../Services/DebugService";
import { PlayerService } from "../../Services/PlayerService";
import { ServiceManager, HtmlModel } from "../../Services/ServiceManager";
import { setTimeout } from "timers";
import { RenderService } from "../../Services/RenderService";
import { TestScene } from "../../Scenes/TestScene";
import { SceneLoader } from "../../Scenes/SceneLoader";
import { SaveService } from "../../Services/SaveService";
import { SaveModel } from "../../Objects/SaveModel";

@Component({
	selector: 'app',
	template: require('./app.html')
})
export class App implements AfterViewInit {

	constructor(
		@Inject(MatDialog) private dialog: MatDialog,
		@Inject(SaveService) private saveService: SaveService
	) {
		document.onkeydown = (ev: KeyboardEvent) => this.keyController.KeyPress(ev, true);
		document.onkeyup = (ev: KeyboardEvent) => this.keyController.KeyPress(ev, false);
		//document.onmousewheel = (ev: MouseEvent) => this.MouseEvent(ev);
		document.onmousemove = (ev: MouseEvent) => this.MouseEvent(ev);
		document.onclick = (ev: MouseEvent) => this.MouseEvent(ev, ev.button + 1);
	}

	ngAfterViewInit(): void {
		this.BeginInit();
	}

	@ViewChild('splash', { static: false })
	private canvasRef: ElementRef;
	private get canvas(): HTMLCanvasElement {
		return this.canvasRef.nativeElement;
	}

	private Iterators: any[] = []

	private serviceManager: ServiceManager;

	private HtmlLayers: HtmlModel[] = [new HtmlModel()]

	private ShowDebug: boolean = true;

	private keyController: KeyController;
	private renderer: RenderService;
	private Camera: CameraController;
	private Scene: SceneBase;
	private LastSplit: number;
	private isDrawing = false;
	private lastFrame = Date.now();

	public debugInfo: DebugInfo = new DebugInfo();
	public InteractionDialog: string = "";

	private BeginInit() {
		this.keyController = new KeyController();
		this.Camera = new CameraController(this.canvas, this.dialog, this.keyController);
		this.renderer = new RenderService(this.canvas);
		SceneLoader.OnLevelChange = (scene) => {
			this.Scene = new scene(this.Camera, this.keyController)
		}
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
		}, 100)
		
		this.keyController.WaitFor('*',() => {this.Save()},1000)
		
		
		if(this.saveService.HasSave()) {
			//Do something to setup from a save
			var save = this.saveService.GetSave();
			SceneLoader.LoadLevel(save.CurrentScene);
		}
		else {
			//Setup a save and configure
			SceneLoader.LoadLevel("test")
			this.Save()
		}
		
		
		


		window.requestAnimationFrame(() => this.RunRecursive());
	}

	private RunRecursive() {
		setTimeout(() => {
			window.requestAnimationFrame(() => this.RunRecursive());
			this.Run();
		}, 0)
	}

	private isPaused = false;
	private currentFrame = Date.now();

	private Run() {
		if (!this.isDrawing && !this.isPaused) {
			this.isDrawing = true;

			this.currentFrame = Date.now();

			this.LastSplit = this.getMSSplit(this.lastFrame, this.currentFrame);

			this.Logic(this.LastSplit);

			this.HtmlUpdate(this.LastSplit);

			this.Animate();

			this.lastFrame = this.currentFrame;

			this.isDrawing = false;
		}
	}

	private getMSSplit(initalDate: number, secondDate: number): number {
		return (secondDate - initalDate) / 1000.0;
	}

	private MouseEvent(mouse: MouseEvent, mouseKey: number = 0) {
		this.Camera.MouseEvent(mouse, mouseKey);
	}

	private LastHtmlUpdate = 0;
	private currentHtmls: HtmlModel[];
	private HtmlUpdate(split: number) {
		if (this.LastHtmlUpdate > 0.75) {
			this.LastHtmlUpdate = 0;

			this.currentHtmls = this.serviceManager.Htmls();
			this.HtmlLayers.forEach(x => {
				this.currentHtmls.forEach(cur => {
					if (cur.name == x.name) {
						x.html = cur.html;
					}
				});
			});
		}
		this.LastHtmlUpdate += split

	}

	private Save() {
		var oldSave = this.saveService.GetSave();
		if(!oldSave)
			oldSave = new SaveModel()
		oldSave.CurrentScene = SceneLoader.SceneName;
		this.saveService.Save(oldSave)
	}
	
	private Logic(lastFrameSplit: number) {
		this.serviceManager.Iterate(lastFrameSplit);
		this.Scene.Iterate(this.keyController, lastFrameSplit);
		this.Camera.Interval(this.keyController, lastFrameSplit);
	}

	private Animate() {
		this.renderer.Renderer.render(this.Scene.GetScene(), this.Camera.camera);
	}
}