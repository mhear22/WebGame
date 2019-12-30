import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import { KeyController } from "../../Services/KeyController";

@Component({
	template: require("./MainMenu.html")
})
export class MainMenuDialog {
	constructor(@Inject(MAT_DIALOG_DATA) private key: KeyController){
		
	}
}