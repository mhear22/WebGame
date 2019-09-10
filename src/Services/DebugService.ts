import { ServiceBase } from "./ServiceBase";
import { KeyController } from "./KeyController";
import { CameraController } from "./CameraController";

export class DebugService extends ServiceBase {
	public constructor(
		Camera: CameraController,
		Key: KeyController
	) { 
		super(Camera, Key);
	}
	
	
	public DrawsHtml: boolean = true;
	public Draws3D: boolean = false;
	public Iterates: boolean = false;

	
}