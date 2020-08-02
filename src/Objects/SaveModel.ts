import * as three from "three";

export class SaveModel {
	public CurrentScene: string;
	public DebugMode: boolean = false;
	public PlayerPosition: three.Vector3;
	public PlayerDirection: three.Vector3 = new three.Vector3(0,0,0);
	public CamY: number = 0;
	public CamX: number = 0;
}