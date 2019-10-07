import { ServiceBase } from "./ServiceBase";
import { Vector2, Vector3 } from "three";

export class PlayerService extends ServiceBase {
	public DrawsHtml: boolean = false;
	public Draws3D: boolean = false;
	public Iterates: boolean = true;
	
	private MovementSpeed = 1;
	
	private static walkingControls = true;
	private static walkingToggled = false;
	
	public static get WalkingControls() {
		return this.walkingControls;
	}
	
	public static set WalkingControls(value:boolean) {
		if(this.walkingControls != value && value)
			this.walkingToggled = true;
		this.walkingControls = value;
	}
	
	
	public Iterate(timeSplit: number) {
		if(PlayerService.walkingToggled) {
			PlayerService.walkingToggled = false;
			
			this.Camera.camera.position.y = 8
		}
		if(PlayerService.walkingControls) {
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