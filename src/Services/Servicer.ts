export class Servicer {
	private static services:any[] = []
	
	public static Provide(Value:any, Name: any) {
		this.services[Name] = Value;
	}
	
	public static Get(Name:any) {
		return this.services[Name]
	}
	
	static KeyController = "KeyController";
	static CameraController = "CameraController";
	static Scene = "Scene";
}

