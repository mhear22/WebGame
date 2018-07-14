import { NgModule } from "@angular/core";
import { App } from "./Parts/App/App";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { routes } from "./routes";
import { BrowserModule } from '@angular/platform-browser';
import { InventoryDialog } from "./Parts/Inventory/Inventory";
import { MatDialogModule } from "@angular/material/dialog";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
	declarations: [
		App,
		InventoryDialog,
	],
	imports: [
		BrowserModule,
		HttpModule,
		FormsModule,
		RouterModule.forRoot(routes),
		BrowserAnimationsModule,
		MatDialogModule,
	],
	bootstrap: [App],
	entryComponents: [
		App,
		InventoryDialog,
	],
	providers: [
		InventoryDialog
	],
})
export class AppModule { }