import { FileAsset } from "../../Objects/FileAsset";
import { KeyController } from "../../Services/KeyController";
import { CameraController } from "../../Services/CameraController";
import { Vector3 } from "three";

export class CarModel extends FileAsset {
	constructor(private keyController:KeyController, private Camera:CameraController) {
		super(require("./Car.obj"), require("./Car.mtl"));
	}
	
	OnLoaded() {
		this.element.scale.addScalar(2);
		this.element.position.z = -20;
		this.keyController.WaitFor("f",() => {
			var dist = this.element.position.distanceTo(this.Camera.camera.position)
			if(dist <= 10) {
				this.isBeingUsed = !this.isBeingUsed;
			}
		})
		
	}
	private isBeingUsed = false;
	private speed = 1;
	private rotation = 0;
	
	Interval(keyController: KeyController, timeSplit: number): void {
		if(this.isBeingUsed) {
			
			if (keyController.KeyMap["w"])
				this.speed++;
				//this.Move(new Vector3(0, 0, -timeSplit * -this.speed * 10));
			if (keyController.KeyMap["s"])
				this.speed--;
				
			this.speed = this.speed * (1 - timeSplit );
				
			this.Move(new Vector3(0, 0, timeSplit * this.speed * 10));
			
				

			if (keyController.KeyMap["a"])
				this.rotation += timeSplit;
			if (keyController.KeyMap["d"])
				this.rotation -= timeSplit;
			
			this.element.rotation.y = this.rotation;
			this.Camera.camera.position.copy(this.element.position)
			this.Camera.camera.position.y = 6;
		}
	}
	
	private Move(vector: Vector3) {
		vector.applyAxisAngle(this.Camera.camera.up, this.rotation);
		this.element.position.add(vector);
	}
}