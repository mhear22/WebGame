import { SceneBase } from "./SceneBase";
import { CameraController } from "../Services/CameraController";
import { KeyController } from "../Services/KeyController";
import { Skybox } from "../Objects/Skybox";
import { Sun } from "../Objects/Sun";
import { MatDialog } from "@angular/material";
import { Injector, inject } from "@angular/core";
import { MainMenuDialog } from "../Parts/MainMenu/MainMenu";
import { Rain } from "../Objects/Rain";

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
		
		//Trigger Dialog popup
		//Disable movement
	}
	
}