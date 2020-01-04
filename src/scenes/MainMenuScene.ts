import { SceneBase } from "./SceneBase";
import { CameraController } from "../Services/CameraController";
import { KeyController } from "../Services/KeyController";
import { Skybox } from "../Objects/Skybox";
import { Sun } from "../Objects/Sun";
import { MatDialog } from "@angular/material";
import { Injector, inject } from "@angular/core";
import { MainMenuDialog } from "../Parts/MainMenu/MainMenu";
import { Rain } from "../Objects/Rain";
import { PlayerService } from "../Services/PlayerService";

export class MainMenuScene extends SceneBase {
	public Iterate = this.ColideIterate;
	
	constructor(
		protected Camera: CameraController,
		protected key: KeyController,
		injector: Injector
	) {
		super(Camera, injector);
		
		this.Add(new Rain())
		this.Add(new Sun(this.Scene, 0,80,0));
		
		var dialog = this.Injector.get(MatDialog);
		var menu = dialog.open(MainMenuDialog, {
			data: this.key,
			disableClose: true,
			hasBackdrop:false,
			
		});
		menu.afterClosed().subscribe(x=> {
			
		});
		
		//Race Conditions suck
		//Walking controls are being set to true by the SceneManager
		//but this scene says they should be false
		setTimeout(() => {
			this.Camera.MouseInput = false;
			PlayerService.WalkingControls = false;
			PlayerService.InventoryEnabled = false;
		},200)
		
	}
}