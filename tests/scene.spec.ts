import {SceneBase} from "../src/Scenes/SceneBase"
import { KeyController } from "../src/Services/KeyController";
import { CameraController } from "../src/Services/CameraController";
import {Cube } from "../src/Objects/Cube";

class TestScene extends SceneBase {
	public Iterate(keyController: KeyController, Step: number): void {
		throw new Error("Method not implemented.");
	}
	constructor(public Camera: CameraController) {
		super(Camera)
		this.Add(new Cube(10,10,10, 0, -1, 0))
		this.Add(new Cube(100,100,100, 0, -1, 0))
	}
	public get MeshList() { return this.Meshes; }
	public get CollideList() { return this.CollideMeshes; }
}

describe("scene",() => {
	test("runs",() => {
		var key = new KeyController()
		var cam = new CameraController(null, null, key)
		
		var scene = new TestScene(cam)
		var nocol = false;
		try {
			scene.MeshList.forEach(x=> {
				x.Collide(scene.CollideList)
			})
			nocol = true;
		}
		catch { }
		
		if(nocol) {
			throw "Col didnt happen"
		}
	})
})

