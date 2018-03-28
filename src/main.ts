import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './module';
import { enableProdMode } from '@angular/core';

if(location.hostname !== "localhost") {
	enableProdMode();
}

platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch((err :any) => alert(err));