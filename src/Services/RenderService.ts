import * as three from "three"

export class RenderService {
	constructor(
		canvas: HTMLCanvasElement
	) {
		this.Renderer = new three.WebGLRenderer({
			canvas: canvas, 
			antialias: true,
		})
		this.Renderer.setPixelRatio(1);
		this.Renderer.setSize(window.innerWidth, window.innerHeight);
		this.Renderer.shadowMap.enabled = true;
		this.Renderer.shadowMap.type = three.PCFSoftShadowMap;
		this.Renderer.setClearColor(0x000000, 1);
		this.Renderer.autoClear = true;
	}
	
	public Renderer: three.WebGLRenderer;
}