const fs = require('node:fs');

var args = process.argv;

function findName(Name) {
	var value = args.find(x=>x.toLowerCase().startsWith(Name.toLowerCase()));

	if(value) {
		return value.split("=")[1];
	}
}

var data =  {
    "Parameters": {
		"ProjectName":findName("projectname") ?? "webgame",
		"ProjectHash":findName("ProjectHash") ?? "123abc",
		"Environment":findName("Environment") ?? "develop",
		"DeploymentBucket": findName("DeploymentBucket") ?? "dev.mikahear.es"
    }
};

var blob = JSON.stringify(data)

fs.writeFile("tconfig.json",blob, err => { });