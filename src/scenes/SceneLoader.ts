import { SceneBase } from "./SceneBase";
import { SandboxScene } from "./SandboxScene";
import { TempScene } from "./TempScene";
import { CameraController } from "../Services/CameraController";
import { KeyController } from "../Services/KeyController";
import { TestScene } from "./TestScene";
import { MainMenuScene } from "./MainMenuScene";

export class SceneLoader {
	private static levels = [
		{ name: "Temp Level", level: TempScene },
		{ name: "Sandbox", level: SandboxScene },
		{ name: "test", level: TestScene },
		{ name: "MainMenu", level: MainMenuScene}
	]

	public static OnLevelChange: (scene:any) => void;
	public static SceneName: string;
	
	public static LoadLevel(name: string) {
		SceneLoader.SceneName = name;
		var level = this.levels.find(x => x.name == name);
		var constructor = level.level;
		this.OnLevelChange(constructor);
	}
}