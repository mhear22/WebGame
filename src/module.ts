import { NgModule } from "@angular/core";
import { App } from "./parts/App/app";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { routes } from "./routes";
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
	imports:[
		BrowserModule,
		HttpModule,
		FormsModule,
		RouterModule.forRoot(routes),
	],
	declarations: [
		App
	],
	providers:[ ],
	bootstrap:[ ]
})
export class AppModule { }