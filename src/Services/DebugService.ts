import { ServiceBase } from "./ServiceBase";
import { KeyController } from "./KeyController";
import { CameraController } from "./CameraController";

export class DebugService extends ServiceBase {
	public constructor(
		Camera: CameraController,
		Key: KeyController
	) { 
		super(Camera, Key);
		
		Key.WaitFor("`",() =>{
			this.Toggle = !this.Toggle;
		},100)
		
	}
	
	private Toggle = false;
	public DrawsHtml: boolean = true;
	public Iterates: boolean = true;
	
	private splitTime:number = 0
	private times:number[] = [];
	
	public Iterate(Split:number) {
		this.splitTime = Split;
	}
	
	private FPSString = "";
	public GetHtml() {
		if(!this.Toggle)
			return "";
		
		var cam = this.Camera.camera;
		if(this.times.length > 10) {
			var average = this.times.reduce((x,y) => x+y)/this.times.length;
			this.FPSString = `${(1000/average).toFixed(2)}`;
			this.times = [];
		}
		else {
			this.times.push(this.splitTime);
		}
		
		var text = `<div class="screen-text">
			${this.FPSString}
			X:${cam.rotation.x.toFixed(2)}
			Y:${cam.rotation.y.toFixed(2)}
			Z:${cam.rotation.z.toFixed(2)}
			CameraSpeed:${this.Camera.speed}
			<div>
				X:${cam.position.x.toFixed(2)}
				Y:${cam.position.y.toFixed(2)}
				Z:${cam.position.z.toFixed(2)}
			</div>
		</div>`;
		return text;
	}
	
}