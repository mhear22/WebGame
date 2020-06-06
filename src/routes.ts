import { Routes } from "@angular/router";
import { App } from "./Parts/App/App";

export const routes: Routes = [
	{ path:'',redirectTo:'/', pathMatch:'full' },
	{ path:'app',component:App}
]