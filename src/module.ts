import { NgModule } from "@angular/core";
import { App } from "./Parts/App/App2";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { routes } from "./routes";
import { BrowserModule } from '@angular/platform-browser';
import { InventoryDialog } from "./Parts/Inventory/Inventory";
import { MatDialogModule } from "@angular/material/dialog";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StorageServiceModule } from "angular-webstorage-service";
import { SaveService } from "./Services/SaveService";
import { MainMenuDialog } from "./Parts/MainMenu/MainMenu";

@NgModule({
	declarations: [
		App,
		InventoryDialog,
		MainMenuDialog
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		FormsModule,
		RouterModule.forRoot(routes),
		BrowserAnimationsModule,
		MatDialogModule,
		StorageServiceModule
	],
	bootstrap: [App],
	entryComponents: [
		App,
		InventoryDialog,
		MainMenuDialog
	],
	providers: [
		InventoryDialog,
		SaveService,
		MainMenuDialog
	],
})
export class AppModule { }