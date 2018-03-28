import { Routes } from "@angular/router";
import { App } from "./parts/App/app";

export const routes: Routes = [
	{ path:'',redirectTo:'/', pathMatch:'full' },
	{ path:'app',component:App}
]