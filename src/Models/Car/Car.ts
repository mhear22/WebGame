import { FileAsset } from "../../Objects/FileAsset";
import { KeyController } from "../../Services/KeyController";
import { CameraController } from "../../Services/CameraController";
import { Vector3 } from "three";
import { PlayerService } from "../../Services/PlayerService";

export class CarModel extends FileAsset {
	constructor(private keyController:KeyController, private Camera:CameraController) {
		super(require("./Car.obj"), require("./Car.mtl"));
	}
	
	OnLoaded() {
		this.element.scale.addScalar(2);
		this.element.position.z = -60;
		this.element.position.y = 0;
		this.keyController.WaitFor("f",() => {
			var dist = this.element.position.distanceTo(this.Camera.camera.position)
			if(dist <= 10) {
				PlayerService.WalkingControls = this.isBeingUsed;
				this.isBeingUsed = !this.isBeingUsed;
			}
		})
		
	}
	private isBeingUsed = false;
	private speed = 0;
	private rotation = 0;
	
	Interval(keyController: KeyController, timeSplit: number): void {
		if(this.isBeingUsed) {
			if (keyController.KeyMap["w"])
				this.speed++;
			if (keyController.KeyMap["s"])
				this.speed--;
			if (keyController.KeyMap["a"])
				this.rotation += timeSplit;
			if (keyController.KeyMap["d"])
				this.rotation -= timeSplit;
		}
		
		this.speed = this.speed * (1 - timeSplit );
		
		var escapeDir = this.UnCollide()
		escapeDir.y = 0;
		this.element.position.add(escapeDir)
		if(!this.IsCollided)
			this.Move(new Vector3(0, 0, timeSplit * this.speed));
		
		this.element.rotation.y = this.rotation;
		if(this.isBeingUsed) {
			this.Camera.camera.position.copy(this.element.position)
			this.Camera.camera.position.y = 6;
		}
	}
	
	private Move(vector: Vector3) {
		if(this.element) {
			vector.applyAxisAngle(this.Camera.camera.up, this.rotation);
			this.element.position.add(vector);
		}
	}
}