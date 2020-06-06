import { SceneBase } from "./SceneBase";
import { SandboxScene } from "./SandboxScene";
import { TempScene } from "./TempScene";
import { CameraController } from "../Services/CameraController";
import { KeyController } from "../Services/KeyController";
import { TestScene } from "./TestScene";
import { MainMenuScene } from "./MainMenuScene";
import { BankScene } from "./BankScene";

export class SceneLoader {
	private static levels = [
		{display:true, name: "Temp Level", level: TempScene },
		{display:true, name: "Sandbox", level: SandboxScene },
		{display:true, name: "test", level: TestScene },
		{display:false, name: "MainMenu", level: MainMenuScene },
		{display:true, name: "Bank", level: BankScene }
	]
	public static get Levels() { return SceneLoader.levels; }

	public static OnLevelChange: (scene:any) => void;
	public static SceneName: string;
	
	public static LoadLevel(name: string) {
		SceneLoader.SceneName = name;
		var level = this.levels.find(x => x.name == name);
		var constructor = level.level;
		this.OnLevelChange(constructor);
	}
}