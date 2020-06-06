electron:
	webpack --mode=production
	asar pack dist app.asar

run: electron
	electron main.asar.js
	
pack:
	electron-packager dist/ game --overwrite