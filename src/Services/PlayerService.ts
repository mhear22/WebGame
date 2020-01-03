import { ServiceBase } from "./ServiceBase";
import { Vector2, Vector3 } from "three";
import { Injector } from "@angular/core";
import { KeyController } from "./KeyController";
import { CameraController } from "./CameraController";
import { MatDialogRef, MatDialog } from "@angular/material";
import { InventoryDialog } from "../Parts/Inventory/Inventory";

export class PlayerService extends ServiceBase {
	public DrawsHtml: boolean = false;
	public Draws3D: boolean = false;
	public Iterates: boolean = true;

	private MovementSpeed = 1;
	public static WalkingControls = true;
	
	private InventoryOpen:boolean = false;
	private InventoryWindow:MatDialogRef<InventoryDialog, any>;

	public constructor(
		protected Camera: CameraController,
		protected Key: KeyController,
		protected injector: Injector
	) {
		super(Camera, Key, injector);
		var dialog = injector.get(MatDialog);
		this.Key.WaitFor("e", () => {
			if(!this.InventoryOpen) {
				var alreadyDisabled = PlayerService.WalkingControls == false;
				if(!alreadyDisabled) {
					PlayerService.WalkingControls = false;
					this.Camera.MouseInput = false;
				}
				
				this.InventoryOpen = true;
				
				this.InventoryWindow = dialog.open(InventoryDialog, {
					height:'80vh',
					width:'80vh',
					data: this.Key
				});
				
				this.InventoryWindow.afterClosed().subscribe(x=> {
					if(!alreadyDisabled) {
						PlayerService.WalkingControls = true;
						this.Camera.MouseInput = true;
					}
					this.InventoryOpen = false;
				});
				
			}
			else {
				this.InventoryWindow.close(() => {})
			}
		},100)
	}
	
	public Iterate(timeSplit: number) {
		if(PlayerService.WalkingControls) {
			if(this.Key.KeyMap["shift"]) {
				this.MovementSpeed++;
				if(this.MovementSpeed >= 5)
					this.MovementSpeed = 5;
			}
			else {
				if(this.MovementSpeed > 1) {
					this.MovementSpeed--;
				}
				else
					this.MovementSpeed = 1;
			}
			
			if (this.Key.KeyMap["w"])
				this.Move(new Vector3(0, 0, -timeSplit * this.MovementSpeed * 10));
			if (this.Key.KeyMap["s"])
				this.Move(new Vector3(0, 0, timeSplit * this.MovementSpeed * 10));
			if (this.Key.KeyMap["a"])
				this.Move(new Vector3(-timeSplit * this.MovementSpeed * 10, 0, 0));
			if (this.Key.KeyMap["d"])
				this.Move(new Vector3(timeSplit * this.MovementSpeed * 10, 0, 0));
		}
	}
	public Move(vector: Vector3) {
		vector.applyAxisAngle(this.Camera.camera.up, this.Camera.RotationY);
		this.Camera.camera.position.add(vector);
	}
}