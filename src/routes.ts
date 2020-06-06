import { Routes } from "@angular/router";
import { App } from "./Parts/App/App2";

export const routes: Routes = [
	{ path:'',redirectTo:'/', pathMatch:'full' },
	{ path:'app',component:App}
]