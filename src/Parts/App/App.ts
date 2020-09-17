import { Component, ViewChild, ElementRef, AfterViewInit, inject, Inject, Injector } from "@angular/core";
import * as three from "three";
import { WebGLRenderer } from "three";
import { CameraController } from "../../Services/CameraController";
import { SceneBase } from "../../Scenes/SceneBase";
import { TempScene } from "../../Scenes/TempScene";
import { MatDialog } from "@angular/material/dialog";
import { DebugInfo } from "../../DataModels/DebugModel";
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
import { SaveModel } from "../../DataModels/SaveModel";
import "joypad.js";
import { InventoryService } from "../../Services/InventoryService";
import { Servicer } from "../../Services/Servicer";


@Component({
	selector: 'app',
	template: require('./App.html')
})
export class App implements AfterViewInit {

	constructor(
		@Inject(MatDialog) private dialog: MatDialog,
		@Inject(SaveService) private saveService: SaveService,
		@Inject(Injector) private injector: Injector
	) {
		document.onkeydown = (ev: KeyboardEvent) => this.keyController.KeyPress(ev, true);
		document.onkeyup = (ev: KeyboardEvent) => this.keyController.KeyPress(ev, false);
		document.onmousemove = (ev: MouseEvent) => this.MouseEvent(ev);
		document.onclick = (ev: MouseEvent) => this.MouseEvent(ev, ev.button + 1);
		
		(window as any).joypad.on("connect", (e:any) => {
			(window as any).joypad.set({
				axisMovementThreshold: 0.1
			});
			
			var options:any = {}
			options.duration= 200;
			options.weakMagnitude= 1;
			options.strongMagnitude= 1;
			
			(window as any).joypad.vibrate(
				e.gamepad,
				options
			)
		});
		(window as any).joypad.on("button_press", (e:any) => {
			this.keyController.ControllerPress(e);
		});
		(window as any).joypad.on("axis_move", (e: any)=> {
			if(e.detail.stickMoved == "left_stick")
				this.keyController.HandleController(e);
			else
				this.Camera.AxisEvent(e);
		});

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
		Servicer.Provide(this.keyController, "KeyController");
		Servicer.Provide(this.Camera, "CameraController");
		
		SceneLoader.OnLevelChange = (scene) => {
			this.dialog.closeAll();
			PlayerService.WalkingControls = true;
			PlayerService.InventoryEnabled = true;
			PlayerService.Gravity = true;
			this.Camera.MouseInput = true;
			this.Camera.camera.position.set(0,8,0);
			this.Camera.camera.rotation.set(0,0,0);
			this.Scene = new scene(this.Camera, this.keyController, this.injector)
			this.serviceManager.ActiveScene = this.Scene;
			Servicer.Provide(this.Scene, "Scene");
		}
		this.serviceManager = new ServiceManager([
			DebugService,
			PlayerService
		],
			this.Camera,
			this.keyController,
			this.injector
		)
		
		this.HtmlLayers = this.serviceManager.Htmls();

		this.isDrawing = false;
		this.lastFrame = Date.now();
		
		this.keyController.WaitFor('p', () => {
			this.isPaused = !this.isPaused;
		}, 100)
		
		this.keyController.WaitFor('*',() => {this.Save()},1000)
		this.keyController.WaitFor('0',() => {this.saveService.Delete()},1000)
		
		
		if(this.saveService.HasSave()) {
			//Do something to setup from a save
			var save = this.saveService.GetSave();
			SceneLoader.LoadLevel(save.CurrentScene);
			try {
				var pos = save.PlayerPosition;
				this.Camera.camera.position.set(pos.x,pos.y,pos.z);
				
				var dir = save.PlayerDirection;
				this.Camera.camera.rotation.set(dir.x,dir.y,dir.z);
				this.Camera.RotX = save.CamX;
				this.Camera.RotY = save.CamY;
				save.Inventory.forEach(x=> {
					InventoryService.AddItem(x.Name);
				});
			}
			catch {}
		}
		else {
			SceneLoader.LoadLevel("MainMenu")
		}
		
		window.requestAnimationFrame(() => this.LoadingLoop());
	}
	
	private LoadingLoop() {
		setTimeout(() => {
			DebugService.Message("Loading")
			var result = this.Scene.IsLoaded();
			if(result) {
				window.requestAnimationFrame(() => this.RunRecursive());
			}
			else {
				window.requestAnimationFrame(() => this.LoadingLoop());
			}
		}, 10);
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
			
			try {
				this.currentFrame = Date.now();
	
				this.LastSplit = this.getMSSplit(this.lastFrame, this.currentFrame);
	
				this.Logic(this.LastSplit);
	
				this.HtmlUpdate(this.LastSplit);
	
				this.Animate();
	
				this.lastFrame = this.currentFrame;
			}
			catch (error) {
				console.error(error)
			}

			this.isDrawing = false;
		}
	}

	private getMSSplit(initalDate: number, secondDate: number): number {
		return (secondDate - initalDate) / 1000.0;
	}

	private MouseEvent(mouse: MouseEvent, mouseKey: number = 0) {
		this.Camera.MouseEvent(mouse, mouseKey);
		this.keyController.HandleMouse(mouse);
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
		oldSave.DebugMode = DebugService.DebugMode;
		oldSave.PlayerPosition = this.Camera.camera.position;
		oldSave.PlayerDirection = this.Camera.camera.rotation.toVector3();
		oldSave.CamY = this.Camera.RotY;
		oldSave.CamX = this.Camera.RotX;
		oldSave.Inventory = InventoryService.Inventory;
		this.saveService.Save(oldSave)
		DebugService.Message("Saved", 3);
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