import { ServiceBase } from "./ServiceBase";
import { Vector2, Vector3 } from "three";
import { Injector } from "@angular/core";
import { KeyController } from "./KeyController";
import { CameraController } from "./CameraController";
import { MatDialogRef, MatDialog } from "@angular/material";
import { InventoryDialog } from "../Parts/Inventory/Inventory";
import * as three from 'three';


export class PlayerService extends ServiceBase {
	public DrawsHtml: boolean = false;
	public Draws3D: boolean = false;
	public Iterates: boolean = true;

	private FallingMomentum = 10;
	
	private MovementSpeed = 1;
	public static WalkingControls = true;
	public static Gravity = true;
	public static InventoryEnabled = true;

	private InventoryOpen: boolean = false;
	private InventoryWindow: MatDialogRef<InventoryDialog, any>;

	public constructor(
		protected Camera: CameraController,
		protected Key: KeyController,
		protected injector: Injector
	) {
		super(Camera, Key, injector);
		var dialog = injector.get(MatDialog);
		this.Key.WaitFor("e", () => {
			if (!PlayerService.InventoryEnabled)
				return;
			if (!this.InventoryOpen) {
				var alreadyDisabled = PlayerService.WalkingControls == false;
				if (!alreadyDisabled) {
					PlayerService.WalkingControls = false;
					this.Camera.MouseInput = false;
				}

				this.InventoryOpen = true;

				this.InventoryWindow = dialog.open(InventoryDialog, {
					height: '80vh',
					width: '80vh',
					data: this.Key
				});

				this.InventoryWindow.afterClosed().subscribe(x => {
					if (!alreadyDisabled) {
						PlayerService.WalkingControls = true;
						this.Camera.MouseInput = true;
					}
					this.InventoryOpen = false;
				});

			}
			else {
				this.InventoryWindow.close(() => { })
			}
		}, 100)
	}

	private MovementDirection(timeSplit: number) {
		if (this.Key.KeyMap["shift"]) {
			this.MovementSpeed++;
			if (this.MovementSpeed >= 5)
				this.MovementSpeed = 5;
		}
		else {
			if (this.MovementSpeed > 1)
				this.MovementSpeed--;
			else
				this.MovementSpeed = 1;
		}

		var z = 0;
		var x = 0;
		
		if (this.Key.KeyMap["w"])
			z = -timeSplit * this.MovementSpeed * 10;
		if (this.Key.KeyMap["s"])
			z = timeSplit * this.MovementSpeed * 10;
		if (this.Key.KeyMap["a"])
			x = -timeSplit * this.MovementSpeed * 10;
		if (this.Key.KeyMap["d"])
			x = timeSplit * this.MovementSpeed * 10;
		return new Vector3(x,0,z)
	}
	
	private intersection(camPos: three.Vector3, direction: three.Vector3) {
		var ray = new three.Raycaster(camPos, direction, 0, 100);
		var meshes = this.GetScene().CollideMeshes;
		var rays = ray.intersectObjects(meshes).filter(x => x.distance > 0).sort(x => x.distance);
		return rays[0];
	}
	
	public Iterate(timeSplit: number) {
		if(PlayerService.Gravity) {
			var scene = this.GetScene()
			var meshes = scene.CollideMeshes;
			var pos = this.Camera.camera.position.clone()
			var ray = this.intersection(pos, new three.Vector3(0,-1,0))
			if(ray && ray.distance < 9 && ray.distance > 7) {
				this.Camera.camera.position.y -= (ray.distance - 8);
				this.FallingMomentum = 10;
			}
			else {
				this.FallingMomentum = this.FallingMomentum * (1 + timeSplit)
				this.Camera.camera.position.y -= this.FallingMomentum/100;
			}
		}
		
		if(PlayerService.WalkingControls) {
			var movementDir = this.MovementDirection(timeSplit);
			
			var isZeroed = movementDir.x == 0 && movementDir.z == 0;
			
			if(!isZeroed) {
				var pos = this.Camera.camera.position.clone();
				pos.y -= 7;
				var normDir = movementDir.clone().normalize().applyAxisAngle(this.Camera.camera.up, this.Camera.RotY);
				var ray = this.intersection(pos, normDir);
				if(!ray || ray.distance > 0.8) {
					this.Move(movementDir);
				}
			}
			else {
				
				this.Move(movementDir);
			}
			
		}
	}
	public Move(vector: Vector3) {
		vector.applyAxisAngle(this.Camera.camera.up, this.Camera.RotY);
		this.Camera.camera.position.add(vector);
	}
}