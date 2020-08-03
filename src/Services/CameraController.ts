import * as three from "three";
import { Vector3, Matrix4 } from "three";
import { MatDialog, MatDialogRef } from "@angular/material";
import { InventoryDialog } from "../Parts/Inventory/Inventory";
import "rxjs";
import { KeyController } from "./KeyController";

export class CameraController {
	private perspectiveCamera: three.PerspectiveCamera;
	
	private mouseLocked: boolean;
	private FOV: number = 75;

	public RotX: number = 0;
	public RotY: number = 0;
	
	private InvertX: boolean = true;
	private InvertY: boolean = true;
	
	public static Close = 0.1;
	public static Far = 5000;

	public MouseInput:boolean = true;
	
	
	constructor(private canvas: HTMLCanvasElement, private dialog:MatDialog, private keyController:KeyController) {
		this.perspectiveCamera = new three.PerspectiveCamera(this.FOV, window.innerWidth / window.innerHeight, CameraController.Close, CameraController.Far);
		this.perspectiveCamera.position.y = 8;
		this.UpdateCamera();
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

		this.UpdateCamera();
	}

	public Rotate(x: number, y: number): void {
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

		if (this.mouseLocked && this.MouseInput) {
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