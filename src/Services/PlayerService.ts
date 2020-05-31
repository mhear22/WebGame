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

		if (this.Key.KeyMap["w"])
			return new Vector3(0, 0, -timeSplit * this.MovementSpeed * 10);
		if (this.Key.KeyMap["s"])
			return new Vector3(0, 0, timeSplit * this.MovementSpeed * 10);
		if (this.Key.KeyMap["a"])
			return new Vector3(-timeSplit * this.MovementSpeed * 10, 0, 0);
		if (this.Key.KeyMap["d"])
			return new Vector3(timeSplit * this.MovementSpeed * 10, 0, 0);
		return new Vector3(0,0,0)
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
			pos.y -= 8;
			var ray = this.intersection(pos, new three.Vector3(0,-1,0))
			
			if (ray) {
				if (ray.distance > 1) {
					this.Camera.camera.position.y -= ((ray.distance) * 0.99);
				}
			}
			else
				this.Camera.camera.position.y += 0.1;
		}
		
		/*
		if(PlayerService.Gravity) {
			var pos = this.Camera.camera.position.clone()
			pos.y -= 8;
			
			var ray = this.intersection(pos, new three.Vector3(0,-1,0))
			
			if (ray) {
				//Over the floor
				var floor = ray;
				if (floor.distance > 0.5) {
					this.Camera.camera.position.y -= ray.distance/10;
				}
				else
					this.Camera.camera.position.y -= ray.distance;
			}
			else {
				pos.y += 1
				var floorAbove = this.intersection(pos, new three.Vector3(0,-1,0))
				if(floorAbove) {
					if(floorAbove.distance < 1) {
						var actualDist = Math.abs(floorAbove.distance - 1)
						this.Camera.camera.position.y += actualDist;
					}
				}
				else
					this.Camera.camera.position.y += 0.1;
				//Under the floor
				//console.log("Flying up")
				//flying up
			}
				
		}
		*/
		
		if(PlayerService.WalkingControls) {
			this.Move(this.MovementDirection(timeSplit));
		}
	}
	public Move(vector: Vector3) {
		vector.applyAxisAngle(this.Camera.camera.up, this.Camera.RotationY);
		this.Camera.camera.position.add(vector);
	}
}