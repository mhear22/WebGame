electron:
	webpack --mode=production
	asar pack dist app.asar

run: electron
	electron main.asar.js
	
pack:
	#Probably doesnt work
	electron-packager dist/ game --overwrite