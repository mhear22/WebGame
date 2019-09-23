import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { KeyController } from "../../Services/KeyController";

@Component({
	selector:'InventoryDialog',
	template: require('./Inventory.html'),
})
export class InventoryDialog {
	private Options:string[] = [];
	private Selected:number = 0;
	
	
	constructor(@Inject(MAT_DIALOG_DATA) private keyController:KeyController) {
		this.Options = [
			"Do a thing",
			"Do another thing",
			"Do a third thing"
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
	}
}