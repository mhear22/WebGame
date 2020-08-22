import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { KeyController } from "../../Services/KeyController";
import { SettingItem } from "./SettingItem"
import { SceneLoader } from "../../Scenes/SceneLoader";
import { InventoryService } from "../../Services/InventoryService";
import { InventoryItem, II } from "../../DataModels/InventoryItem";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";


@Component({
	selector: 'InventoryDialog',
	template: require('./Inventory.html'),
})


export class InventoryDialog {
	private Options: SettingItem[] = [];
	private Selected: number = 0;
	private isClosed = false;
	private Inventory: InventoryItem[] = []
	
	private menu: InventoryItem[][] = []; 
	private x = 0;
	private y = 0;
	
	constructor(
		@Inject(MAT_DIALOG_DATA) private keyController: KeyController,
		@Inject(MatDialogRef) private dialogRef:MatDialogRef<any>
	) {
		dialogRef.beforeClose().subscribe(() => {
			this.isClosed = true;
		});
		
		this.menu = [
			InventoryService.Inventory,
			[
				new II("Do 1 Thing", {setting: true}, (self)=> {
					var data: any = self.Data
					data.setting = !data.setting
					if (data.setting)
						self.Name = "Do 1 thing"
					else
						self.Name = "Dont 1 thing"
					self.Data = data;
					return self;
				})
			],
			[new II("Load Sandbox World",null, () => {SceneLoader.LoadLevel("Sandbox")})],
			[new II("Quit",null, () => {SceneLoader.LoadLevel("MainMenu")})]
		]
		
		var keys = [
			"w",
			"a",
			"s",
			"d",
		].forEach(x=> {
			keyController.WaitFor(x, () => {
				this.Press(x);
			},100)
		})
		
		keyController.WaitFor(" ", () => {
			if(this.isClosed)
				return;
			var item = this.menu[this.y][this.x];
			
			if(item.Action) {
				var result = item.Action(item);
				if(result)
					this.menu[this.y][this.x] = result;
			}
			
		}, 100)
	}

	private Press(key:any) {
		var map:any = {
			"w": {x:0,y:-1 },
			"s": {x:0,y:1 },
			"a": {x:-1,y:0 },
			"d": {x:1,y:0 }
		}
		
		var selected = map[key];
		this.x += selected.x
		this.y += selected.y
		
		if(this.y < 0)
			this.y = 0;
		if(this.y >= this.menu.length)
			this.y = 0;
		var xMax = this.menu[this.y].length - 1
		if(this.x > xMax)
			this.x = 0;
		if(this.x < 0)
			this.x = xMax;
	}
}