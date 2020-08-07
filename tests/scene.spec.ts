import { SceneBase } from "../src/Scenes/SceneBase"
import { KeyController } from "../src/Services/KeyController";
import { CameraController } from "../src/Services/CameraController";
import { Cube } from "../src/Models/Cube";

class TestScene extends SceneBase {
	public Iterate(keyController: KeyController, Step: number): void {
		throw new Error("Method not implemented.");
	}
	constructor(public Camera: CameraController) {
		super(Camera);
		this.Add(new Cube(10, 10, 10, 0, -1, 0))
		this.Add(new Cube(10, 10, 10, 5, -1, 5))
	}
	public get MeshList() { return this.Meshes; }
	public get CollideList() { return this.CollideMeshes; }
}

describe("scene", () => {

	test("runs", () => {
		var key = new KeyController()
		var cam = new CameraController(null, null, key)
		var scene = new TestScene(cam)

		var colided = false;
		try {
			scene.MeshList.forEach(x => {
				if (x.Collide(scene.CollideList))
					colided = true
			})
		}
		catch { }
		expect(colided).toBe(true)
	})

	test("bouces", () => {
		var key = new KeyController()
		var cam = new CameraController(null, null, key)
		var scene = new TestScene(cam)

		scene.MeshList.forEach(x => {
			x.Collide(scene.CollideList)
			x.UnCollide()
			x.Interval(key, 1)
		})

		var recollided = scene.MeshList[0].Collide(scene.CollideList)
		expect(recollided).toBe(false)
	})
})

