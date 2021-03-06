import { Inject } from "@angular/core";
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { SaveModel } from "../Objects/SaveModel";


export class SaveService {
	constructor(
		@Inject(SESSION_STORAGE) private storage: StorageService
	) {}
	
	public HasSave(): boolean {
		return !!this.GetSave();
	}
	
	public GetSave(): SaveModel {
		var data: SaveModel = this.storage.get("SaveData");
		return data
	}
	
	public Save(data: SaveModel) {
		this.storage.set("SaveData", data)
	}
}