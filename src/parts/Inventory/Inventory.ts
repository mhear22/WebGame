import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { KeyController } from "../../Services/KeyController";
import { SettingItem } from "./SettingItem"


@Component({
	selector:'InventoryDialog',
	template: require('./Inventory.html'),
})


export class InventoryDialog {
	private Options:SettingItem[] = [];
	private Selected:number = 0;

	
	constructor(@Inject(MAT_DIALOG_DATA) private keyController:KeyController) {
		
		this.Options = [
			{ Name: "Do 1 thing", Action: () => { 
				
			}},
			{ Name: "Do Another thing", Action: () => {
				
			}}
		]
		
		keyController.WaitFor("w",() => {
			this.Selected--;
			if(this.Selected < 0)
				this.Selected = 0;
		},100)
		
		keyController.WaitFor("s",() => {
			this.Selected++;
			if(this.Selected >= this.Options.length)
				this.Selected = this.Options.length - 1
		},100)
		
		keyController.WaitFor(" ",() => {
			this.Options[this.Selected].Action()
		},100)
	}
}