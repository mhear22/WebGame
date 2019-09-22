import * as three from "three";
import { Vector3, Matrix4 } from "three";
import { MatDialog, MatDialogRef } from "@angular/material";
import { InventoryDialog } from "../Parts/Inventory/Inventory";
import { delay } from "rxjs/operators";
import "rxjs";
import { KeyController } from "./KeyController";

export class CameraController {
	private perspectiveCamera: three.PerspectiveCamera;
	private mouseLocked: boolean;
	private FOV: number = 75;

	public get RotationX(){ return this.RotX; } 
	public get RotationY(){ return this.RotY; } 
	
	private RotX: number = 0;
	private RotY: number = 0;

	private InvertX: boolean = true;
	private InvertY: boolean = true;

	private IsRotationLocked:boolean = false;
	private IsMovementLocked:boolean = false;
	
	private InventoryOpen:boolean = false;
	private IsInventoryLocked:boolean= false;
	private InventoryWindow:MatDialogRef<InventoryDialog, any>;
	
	constructor(private canvas: HTMLCanvasElement, private dialog:MatDialog, private keyController:KeyController) {
		this.perspectiveCamera = new three.PerspectiveCamera(this.FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.perspectiveCamera.position.y = 8;
		this.UpdateCamera();
		this.keyController.WaitFor("e", () => {
			if(!this.InventoryOpen) {
				this.InventoryOpen = true;
				this.IsRotationLocked = true;
				this.IsMovementLocked = true;
				this.InventoryWindow = this.dialog.open(InventoryDialog, {
					height:'80vh',
					width:'80vh',
					data: this.keyController
				});

				this.InventoryWindow.afterClosed().subscribe(x=> {
					this.InventoryOpen = false;
					this.IsMovementLocked = false;
					this.IsRotationLocked = false;
				});
				
			}
			else {
				this.InventoryWindow.close(() => {})
			}
		},100)
	}

	public ToggleMaps() {
		this.IsMovementLocked = !this.IsMovementLocked;
	}
	
	public UpdateCamera(): void {
		var changed = false;
		if (this.camera.fov != this.FOV) {
			this.camera.fov = this.FOV;
			changed = true;
		}

		if (changed)
			this.camera.updateProjectionMatrix();
	}
	
	public speed = 0;
	public Interval(keyController: KeyController, timeSplit: number): void {
		if (keyController.KeyMap["+"]) {
			if (this.FOV < 179)
				this.FOV += 1;
		}
		if (keyController.KeyMap["-"]) {
			if (this.FOV > 1)
				this.FOV -= 1;
		}

		if (keyController.KeyMap["shift"]) {
			if(this.speed == 1) {
				this.speed = 2;
			}
			else {
				this.speed = this.speed * 1.05;
				if(this.speed > 170)
					this.speed = 170;
			}
		}
		else
			this.speed = 1;
		
		if(!this.IsMovementLocked) {
			if (keyController.KeyMap["w"])
				this.Move(new Vector3(0, 0, -timeSplit * this.speed * 10));
			if (keyController.KeyMap["s"])
				this.Move(new Vector3(0, 0, timeSplit * this.speed * 10));
			if (keyController.KeyMap["a"])
				this.Move(new Vector3(-timeSplit * this.speed * 10, 0, 0));
			if (keyController.KeyMap["d"])
				this.Move(new Vector3(timeSplit * this.speed * 10, 0, 0));
		}

		this.UpdateCamera();
	}

	public Move(vector: Vector3) {
		vector.applyAxisAngle(this.camera.up, this.RotY);
		this.camera.position.add(vector);
	}

	public Rotate(x: number, y: number): void {
		if(this.IsRotationLocked)
			return;
		if (this.InvertY)
			this.RotY -= x;
		else
			this.RotY += x;

		if (this.InvertX)
			this.RotX -= y;
		else
			this.RotX += y;

		var pi = Math.PI;

		if (this.RotX > pi / 2)
			this.RotX = pi / 2;
		if (this.RotX < -pi / 2)
			this.RotX = -pi / 2;

		if (this.RotY > pi)
			this.RotY -= pi * 2;
		if (this.RotY < -pi)
			this.RotY += pi * 2;

		this.camera.rotation.x = 0;
		this.camera.rotation.y = 0;
		this.camera.rotation.z = 0;

		this.camera.rotateY(this.RotY);
		this.camera.rotateX(this.RotX);
	}

	public MouseEvent(mouse: MouseEvent, mouseKey: number = 0) {
		this.mouseLocked = !(document.pointerLockElement !== this.canvas)

		if (this.mouseLocked) {
			var sen = 1000;
			this.Rotate(mouse.movementX / sen, mouse.movementY / sen);
		}
		if (!this.mouseLocked && mouseKey > 0)
			this.canvas.requestPointerLock();
	}

	get camera(): three.PerspectiveCamera {
		return this.perspectiveCamera;
	}
}