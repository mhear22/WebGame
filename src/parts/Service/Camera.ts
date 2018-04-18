import * as three from "three";
import { Vector3, Matrix4 } from "three";

export class CameraController {
	private perspectiveCamera: three.PerspectiveCamera;
	private mouseLocked: boolean;
	private FOV: number = 75;
	
	private RotX:number = 0;
	private RotY:number = 0;
	
	private InvertX:boolean = true;
	private InvertY:boolean = true;
	
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
		
		var speed = 1;
		if(keyMap["shift"])
			speed = 2;
		
		if(keyMap["w"])
			this.Move(new Vector3(0,0,-timeSplit*speed));
		if(keyMap["s"])
			this.Move(new Vector3(0,0,timeSplit*speed));
		if(keyMap["a"])
			this.Move(new Vector3(-timeSplit*speed,0,0));
		if(keyMap["d"])
			this.Move(new Vector3(timeSplit*speed,0,0));
		
		this.UpdateCamera();
	}
	
	public Move(vector:Vector3) {
		vector.applyAxisAngle(this.camera.up, this.RotY);
		this.camera.position.add(vector);
	}
	
	public Rotate(x: number, y: number): void {
		if(this.InvertY)
			this.RotY -= x;
		else
			this.RotY += x;
		
		if(this.InvertX)
			this.RotX -= y;
		else
			this.RotX += y;
		
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
		
		this.camera.rotateY(this.RotY)
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