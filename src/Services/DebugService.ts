import { ServiceBase } from "./ServiceBase";
import { KeyController } from "./KeyController";
import { CameraController } from "./CameraController";
import { Injector } from "@angular/core";
import { SaveService } from "./SaveService";
import { DebugMessage } from "../DataModels/DebugMessage";
import * as moment from "moment";

export class DebugService extends ServiceBase {
	public constructor(
		Camera: CameraController,
		Key: KeyController,
		injector: Injector
	) {
		super(Camera, Key, injector);

		Key.WaitFor("`", () => {
			DebugService.DebugMode = !DebugService.DebugMode;
		}, 100)

		this.cam = this.Camera.camera;
		try{
			DebugService.DebugMode = injector.get(SaveService).GetSave().DebugMode;
		}
		catch {}
	}
	private cam: any;

	public static DebugMode = false;
	public DrawsHtml: boolean = true;
	public Iterates: boolean = true;

	private times: number[] = [];
	private runningTotal = 0;

	public Iterate(Split: number) {
		if (this.runningTotal > 10) {
			this.times = [];
			this.runningTotal = 0;
		}

		this.times.push(Split);
		this.runningTotal += Split;

	}
	public static Messages: DebugMessage[] = [];
	
	private FPSString = "";
	public GetHtml() {
		if (!DebugService.DebugMode)
			return "";

		this.FPSString = `${(1 / (this.runningTotal / this.times.length)).toFixed(2)}`;

		var expiry = moment()
		DebugService.Messages = DebugService.Messages
			.filter(x=> {
				var offset = expiry.add("s", -x.Offset);
				return x.SentDate.isAfter(offset)
			});
		
			var messages = DebugService.Messages.map(x=> {
				return `<div>${x.Message}</div>`;
			})
			.filter((val, index, self) => self.indexOf(val) == index)
			.join("")
		
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
			${messages}
		</div>`;
		
		
		return text;
	}
	
	public static Message(message: string, secondsToKeepUp: number = 2) {
		// If message already exists, bump expiry
		// If not create
		
		var existing = DebugService.Messages.find(x=>x.Message == message);
		
		if (existing) {
			var index = DebugService.Messages.map(x=>x.Message).indexOf(message);
			DebugService.Messages[index].SentDate = moment();
		}
		else {
			var model: DebugMessage = { Message: message, SentDate: moment(), Offset: secondsToKeepUp }
			DebugService.Messages.push(model);
			console.log(message);
		}
	}
}