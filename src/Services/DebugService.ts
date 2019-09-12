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
		
		this.cam = this.Camera.camera;
	}
	private cam: any;
	
	private Toggle = true;
	public DrawsHtml: boolean = true;
	public Iterates: boolean = true;
	
	private times:number[] = [];
	private runningTotal = 0;
	
	public Iterate(Split:number) {
		if(this.runningTotal > 10) {
			this.times = [];
			this.runningTotal = 0;
		}
		
		this.times.push(Split);
		this.runningTotal += Split;

	}
	
	private FPSString = "";
	public GetHtml() {
		if(!this.Toggle)
			return "";
		
		this.FPSString = `${(1/(this.runningTotal/this.times.length)).toFixed(2)}`;
		
		var text = `<div class="screen-text">
			${this.FPSString}
			X:${this.cam.rotation.x.toFixed(2)}
			Y:${this.cam.rotation.y.toFixed(2)}
			Z:${this.cam.rotation.z.toFixed(2)}
			CameraSpeed:${this.Camera.speed}
			<div>
				X:${this.cam.position.x.toFixed(2)}
				Y:${this.cam.position.y.toFixed(2)}
				Z:${this.cam.position.z.toFixed(2)}
			</div>
		</div>`;
		return text;
	}
	
}