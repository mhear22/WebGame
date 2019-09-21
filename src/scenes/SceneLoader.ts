import { SceneBase } from "./SceneBase";
import { SandboxScene } from "./SandboxScene";
import { TempScene } from "./TempScene";
import { CameraController } from "../Services/CameraController";
import { KeyController } from "../Services/KeyController";

export class SceneLoader {
	private levels = [
		{name: "Temp Level", level: TempScene },
		{name: "Sandbox", level: SandboxScene}
	]
	
	constructor(
		private Camera: CameraController,
		private key: KeyController 
	) { }
	
	
	public LoadLevel(name: string) {
		var level = this.levels.find(x=>x.name == name);
		
		var constructed = level.level.apply(this, [this.Camera, this.key])
		
		return constructed as SceneBase
	}
	
	
	
}