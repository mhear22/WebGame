/**
 * Loads a Wavefront .mtl file specifying materials
 *
 * @author angelxuanchang
 */
import * as THREE from "three";
import { Texture } from "three";
export class MTLLoader implements THREE.MaterialLoader {
	constructor(manager?: THREE.LoadingManager,private textureUrl?:string) {
		if (!this.manager) {
			this.manager = THREE.DefaultLoadingManager
		}
	}

	manager: THREE.LoadingManager;
	materialOptions: {};
	materials: THREE.Material[];
	path: string;
	texturePath: string;
	crossOrigin: string;
	resourcePath: string;
	textures: any;

	setTextures(textures: { [key: string]: Texture }) {
		return this;
	};

	/**
	 * Adds a listener to an event type.
	 * @param type The type of the listener that gets removed.
	 * @param listener The listener function that gets removed.
	 */
	addEventListener(type: string, listener: (event: Event) => void): void { };
	/**
	 * Adds a listener to an event type.
	 * @param type The type of the listener that gets removed.
	 * @param listener The listener function that gets removed.
	 */
	hasEventListener(type: string, listener: (event: Event) => void): void { };
	/**
	 * Removes a listener from an event type.
	 * @param type The type of the listener that gets removed.
	 * @param listener The listener function that gets removed.
	 */
	removeEventListener(type: string, listener: (event: Event) => void): void { };
	/**
	 * Fire an event type.
	 * @param type The type of event that gets fired.
	 */
	dispatchEvent(event: { type: string;[attachment: string]: any; }): void { };

	/**
	 * Loads and parses a MTL asset from a URL.
	 *
	 * @param {String} url - URL to the MTL file.
	 * @param {Function} [onLoad] - Callback invoked with the loaded object.
	 * @param {Function} [onProgress] - Callback for download progress.
	 * @param {Function} [onError] - Callback for download errors.
	 *
	 * @see setPath setResourcePath
	 *
	 * @note In order for relative texture references to resolve correctly
	 * you must call setResourcePath() explicitly prior to load.
	 */
	load(url: string, onLoad: any, onProgress: any, onError: any) {
		var scope = this;
		//var path = ( this.path === undefined ) ? THREE.LoaderUtils.extractUrlBase( url ) : this.path;
		var path = this.path;

		var loader = new THREE.FileLoader(this.manager);
		loader.setPath(this.path);
		loader.load(url, function (text: any) {
			onLoad(scope.parse({ text: text, path: path }));
		}, onProgress, onError);
	}
	/**
	 * Set base path for resolving references.
	 * If set this path will be prepended to each loaded and found reference.
	 *
	 * @see setResourcePath
	 * @param {String} path
	 * @return {THREE.MTLLoader}
	 *
	 * @example
	 *	 mtlLoader.setPath( 'assets/obj/' );
	 *	 mtlLoader.load( 'my.mtl', ... );
	 */
	setPath(path: string) {
		this.path = path;
		return this;
	}
	/**
	 * Set base path for additional resources like textures.
	 *
	 * @see setPath
	 * @param {String} path
	 * @return {THREE.MTLLoader}
	 *
	 * @example
	 *	 mtlLoader.setPath( 'assets/obj/' );
	 *	 mtlLoader.setResourcePath( 'assets/textures/' );
	 *	 mtlLoader.load( 'my.mtl', ... );
	 */
	setResourcePath(path: string) {
		this.resourcePath = path;
		return this;
	}

	setBaseUrl(path: string): void {
	}

	setTexturePath(path: string) {
		console.warn('THREE.MTLLoader: .setTexturePath() has been renamed to .setResourcePath().');
		return this.setResourcePath(path);
	}
	setCrossOrigin(value: string) {
		this.crossOrigin = value;
		return this;
	}
	setMaterialOptions(value: string) {
		this.materialOptions = value;
		return this;
	}
	/**
	 * Parses a MTL file.
	*/
	parse(json: any) {
		var text: string = json;
		var path: string;

		var lines = text.split('\n');
		var info: any = {};
		var delimiter_pattern = /\s+/;
		var materialsInfo: any = {};
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			line = line.trim();
			if (line.length === 0 || line.charAt(0) === '#') {
				// Blank line or comment ignore
				continue;
			}
			var pos = line.indexOf(' ');
			var key = (pos >= 0) ? line.substring(0, pos) : line;
			key = key.toLowerCase();
			var value = (pos >= 0) ? line.substring(pos + 1) : '';
			value = value.trim();
			if (key === 'newmtl') {
				// New material
				info = { name: value };
				materialsInfo[value] = info;
			} else {
				if (key === 'ka' || key === 'kd' || key === 'ks' || key === 'ke') {
					var ss = value.split(delimiter_pattern, 3);
					info[key] = [parseFloat(ss[0]), parseFloat(ss[1]), parseFloat(ss[2])];
				} else {
					info[key] = value;
				}
			}
		}
		var materialCreator = new MaterialCreator(this.resourcePath || path, this.materialOptions,this.textureUrl);
		materialCreator.setCrossOrigin(this.crossOrigin);
		materialCreator.setManager(this.manager);
		materialCreator.setMaterials(materialsInfo);
		return (materialCreator as any)
	}
}
export class MaterialCreator {
	constructor(public baseUrl: string = '', public options?: any, public textureUrl?:any) {
		this.materialsInfo = {};
		this.materials = {};
		this.materialsArray = [];
		this.nameLookup = {};
		this.side = (this.options && this.options.side) ? this.options.side : THREE.FrontSide;
		this.wrap = (this.options && this.options.wrap) ? this.options.wrap : THREE.RepeatWrapping;
	}

	side: any;
	wrap: any;
	params: any;
	materialsInfo: any = {};
	materials: any = {};
	materialsArray: any = [];
	nameLookup: any = {};
	manager: any;

	crossOrigin: string | boolean = 'anonymous'
	setCrossOrigin(value: string) {
		this.crossOrigin = value;
	}
	setManager(value: any) {
		this.manager = value;
	}
	setMaterials(materialsInfo: any) {
		this.materialsInfo = this.convert(materialsInfo);
		this.materials = {};
		this.materialsArray = [];
		this.nameLookup = {};
	}
	convert(materialsInfo: any) {
		if (!this.options) return materialsInfo;
		var converted: any = {};
		for (var mn in materialsInfo) {
			// Convert materials info into normalized form based on options
			var mat = materialsInfo[mn];
			var covmat: any = {};
			converted[mn] = covmat;
			for (var prop in mat) {
				var save = true;
				var value = mat[prop];
				var lprop = prop.toLowerCase();
				switch (lprop) {
					case 'kd':
					case 'ka':
					case 'ks':
						// Diffuse color (color under white light) using RGB values
						if (this.options && this.options.normalizeRGB) {
							value = [value[0] / 255, value[1] / 255, value[2] / 255];
						}
						if (this.options && this.options.ignoreZeroRGBs) {
							if (value[0] === 0 && value[1] === 0 && value[2] === 0) {
								// ignore
								save = false;
							}
						}
						break;
					default:
						break;
				}
				if (save) {
					covmat[lprop] = value;
				}
			}
		}
		return converted;
	}
	preload() {
		for (var mn in this.materialsInfo) {
			this.create(mn);
		}
	}
	getIndex(materialName: any) {
		return this.nameLookup[materialName];
	}
	getAsArray() {
		var index = 0;
		for (var mn in this.materialsInfo) {
			this.materialsArray[index] = this.create(mn);
			this.nameLookup[mn] = index;
			index++;
		}
		return this.materialsArray;
	}
	create(materialName: string) {
		if (this.materials[materialName] === undefined) {
			this.createMaterial_(materialName);
		}
		return this.materials[materialName];
	}
	createMaterial_(materialName: string) {
		// Create material
		var scope = this;
		var mat = this.materialsInfo[materialName];
		var params: THREE.MeshPhongMaterialParameters = {
			name: materialName,
			side: this.side
		};
		function resolveURL(baseUrl: string, url: string) {
			if (typeof url !== 'string' || url === '')
				return '';
			// Absolute URL
			if (/^https?:\/\//i.test(url)) return url;
			return baseUrl + url;
		}
		function setMapForType(mapType: string, value: string) {
			if ((params as any)[mapType])
				return; // Keep the first encountered texture
			var texParams = scope.getTextureParams(value, params);
			var map = (scope as any).loadTexture(resolveURL(scope.baseUrl, texParams.url));
			map.repeat.copy(texParams.scale);
			map.offset.copy(texParams.offset);
			map.wrapS = scope.wrap;
			map.wrapT = scope.wrap;
			(params as any)[mapType] = map;
		}
		for (var prop in mat) {
			var value = mat[prop];
			var n;
			if (value === '') continue;
			switch (prop.toLowerCase()) {
				// Ns is material specular exponent
				case 'kd':
					// Diffuse color (color under white light) using RGB values
					params.color = new THREE.Color().fromArray(value);
					break;
				case 'ks':
					// Specular color (color when light is reflected from shiny surface) using RGB values
					params.specular = new THREE.Color().fromArray(value);
					break;
				case 'ke':
					// Emissive using RGB values
					params.emissive = new THREE.Color().fromArray(value);
					break;
				case 'map_kd':
					// Diffuse texture map
					setMapForType("map", value);
					break;
				case 'map_ks':
					// Specular map
					setMapForType("specularMap", value);
					break;
				case 'map_ke':
					// Emissive map
					setMapForType("emissiveMap", value);
					break;
				case 'norm':
					setMapForType("normalMap", value);
					break;
				case 'map_bump':
				case 'bump':
					// Bump texture map
					setMapForType("bumpMap", value);
					break;
				case 'map_d':
					// Alpha map
					setMapForType("alphaMap", value);
					params.transparent = true;
					break;
				case 'ns':
					// The specular exponent (defines the focus of the specular highlight)
					// A high exponent results in a tight, concentrated highlight. Ns values normally range from 0 to 1000.
					params.shininess = parseFloat(value);
					break;
				case 'd':
					n = parseFloat(value);
					if (n < 1) {
						params.opacity = n;
						params.transparent = true;
					}
					break;
				case 'tr':
					n = parseFloat(value);
					if (this.options && this.options.invertTrProperty) n = 1 - n;
					if (n > 0) {
						params.opacity = 1 - n;
						params.transparent = true;
					}
					break;
				default:
					break;
			}
		}
		this.materials[materialName] = new THREE.MeshPhongMaterial(params);
		return this.materials[materialName];
	}
	getTextureParams(value: string, matParams: any) {
		var texParams: any = {
			scale: new THREE.Vector2(1, 1),
			offset: new THREE.Vector2(0, 0)
		};
		var items = value.split(/\s+/);
		var pos;
		pos = items.indexOf('-bm');
		if (pos >= 0) {
			matParams.bumpScale = parseFloat(items[pos + 1]);
			items.splice(pos, 2);
		}
		pos = items.indexOf('-s');
		if (pos >= 0) {
			texParams.scale.set(parseFloat(items[pos + 1]), parseFloat(items[pos + 2]));
			items.splice(pos, 4); // we expect 3 parameters here!
		}
		pos = items.indexOf('-o');
		if (pos >= 0) {
			texParams.offset.set(parseFloat(items[pos + 1]), parseFloat(items[pos + 2]));
			items.splice(pos, 4); // we expect 3 parameters here!
		}
		texParams.url = items.join(' ').trim();
		return texParams;
	}
	loadTexture(url: string, mapping: any, onLoad: any, onProgress: any, onError: any) {
		var texture;
		
		var manager = (this.manager !== undefined) ? this.manager : THREE.DefaultLoadingManager;
		var loader:any = new THREE.TextureLoader(manager);
		
		if (loader && loader.setCrossOrigin)
			loader.setCrossOrigin(this.crossOrigin);
			
		if(this.textureUrl)
			texture = loader.load(this.textureUrl, onLoad, onProgress, onError);
		else
			texture = loader.load(url, onLoad, onProgress, onError);
			
		if (mapping !== undefined)
			texture.mapping = mapping;
		return texture;
	}
}