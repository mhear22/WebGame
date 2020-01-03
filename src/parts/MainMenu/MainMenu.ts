import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import { KeyController } from "../../Services/KeyController";
import { MenuItem } from "../../Objects/MenuItem";

@Component({
	template: require("./MainMenu.html")
})
export class MainMenuDialog {
	private selected = 0;
	
	private Menu:MenuItem[] = [
		new MenuItem("Continue"),
		new MenuItem("Level Select"),
		new MenuItem("Settings"),
	];
	
	private displayedMenu:MenuItem[] = []
	
	constructor(@Inject(MAT_DIALOG_DATA) private key: KeyController) {
		this.displayedMenu = this.Menu
		
		this.key.WaitFor("w",() => {
			this.selected--
			this.checkSelected()
		});
		
		this.key.WaitFor("s",() => {
			this.selected++
			this.checkSelected()
		});
	}
	
	private checkSelected() {
		if(this.selected >= this.displayedMenu.length)
			this.selected = this.displayedMenu.length - 1
		else if(this.selected < 0)
			this.selected = 0
	}
}