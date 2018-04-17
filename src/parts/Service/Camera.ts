import * as three from "three";
import { Vector3, Matrix4 } from "three";

export class CameraController {
	private perspectiveCamera: three.PerspectiveCamera;
	private mouseLocked: boolean;
	private FOV: number = 75;
	
	private RotX:number = 0;
	private RotY:number = 0;
	
	private InvertX:boolean = false;
	private InvertY:boolean = false;
	
	constructor(private canvas: HTMLCanvasElement) {
		this.perspectiveCamera = new three.PerspectiveCamera(this.FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
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
	
	public Interval(keyMap: any, timeSplit: number): void {
		if (keyMap["+"]) {
			if (this.FOV < 179)
				this.FOV += 1;
		}
		if (keyMap["-"]) {
			if (this.FOV > 1)
				this.FOV -= 1;
		}
		if (keyMap["-"] || keyMap["+"]) {
			console.log(this.FOV);
		}
		this.UpdateCamera();
	}

	public Rotate(x: number, y: number): void {
		this.RotX += y;
		this.RotY += x;
		
		var pi = Math.PI;
		
		if(this.RotX > pi/2)
			this.RotX = pi/2;
		if(this.RotX < -pi/2)
			this.RotX = -pi/2;
		
		if(this.RotY > pi)
			this.RotY -= pi*2;
		if(this.RotY < -pi)
			this.RotY += pi*2;
		
		this.camera.rotation.x = 0;
		this.camera.rotation.y = 0;
		this.camera.rotation.z = 0;
		
		
		if(this.InvertY)
			this.camera.rotateY(-this.RotY);
		else
			this.camera.rotateY(this.RotY)
		
		if(this.InvertX)
			this.camera.rotateX(-this.RotX);
		else
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