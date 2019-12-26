import { SceneBase } from "./SceneBase";
import { SandboxScene } from "./SandboxScene";
import { TempScene } from "./TempScene";
import { CameraController } from "../Services/CameraController";
import { KeyController } from "../Services/KeyController";

export class SceneLoader {
	private static levels = [
		{ name: "Temp Level", level: TempScene },
		{ name: "Sandbox", level: SandboxScene }
	]

	public static OnLevelChange: (scene:any) => void;

	public static LoadLevel(name: string) {
		var level = this.levels.find(x => x.name == name);
		var constructor = level.level;
		this.OnLevelChange(constructor);
	}
}