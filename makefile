bucket = a----a


electron:
	webpack --mode=production
	asar pack dist app.asar

run: electron
	electron main.asar.js
	
pack:
	#Probably doesnt work
	electron-packager dist/ game --overwrite
	
deploy-pipeline:
	aws cloudformation package --s3-bucket=${bucket} --template-file ./stacks/pipeline.yml --output-template-file ./stacks/pipeline.package.yml
	aws cloudformation deploy --template-file ./stacks/pipeline.package.yml --stack-name WebGamePipeline --capabilities "CAPABILITY_NAMED_IAM" "CAPABILITY_IAM"
