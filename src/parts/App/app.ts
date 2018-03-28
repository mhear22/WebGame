import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import * as three from "three";
import { Scene, PerspectiveCamera, WebGLRenderer } from "three";

@Component({
	selector:'app',
	template:require('./app.html')
})
export class App implements AfterViewInit {
	
	constructor() { }
	ngAfterViewInit(): void {
		this.BeginInit();
	}
	
	@ViewChild('splash')
	private canvasRef:ElementRef;
	private get canvas(): HTMLCanvasElement {
		return this.canvasRef.nativeElement;
	}
	
	private scene:Scene;
	private camera:PerspectiveCamera;
	private renderer:WebGLRenderer;
	
	
	private BeginInit() {
		this.scene = new three.Scene();
		this.camera = new three.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
		this.renderer = new three.WebGLRenderer({
			canvas:this.canvas,
			antialias:true
		});
		this.renderer.setPixelRatio(devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled=true;
		this.renderer.shadowMap.type = three.PCFSoftShadowMap;
		this.renderer.setClearColor(0xffffff,1);
		this.renderer.autoClear = true;
		
		var geo = new three.BoxGeometry(1,1,1);
		var mat = new three.MeshBasicMaterial({color:'red'});
		var cube = new three.Mesh(geo, mat);
		this.scene.add(cube);
		this.camera.position.z = 5;
		
		this.Animate();
	}
	
	private Animate() {
		this.renderer.render(this.scene,this.camera);
	}
}