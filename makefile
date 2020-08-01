bucket = a----a

electron:
	webpack --mode=production
	
pack: electron
	electron-builder -w
	
deploy-pipeline:
	aws cloudformation package --s3-bucket=${bucket} --template-file ./stacks/pipeline.yml --output-template-file ./stacks/pipeline.package.yml
	aws cloudformation deploy --template-file ./stacks/pipeline.package.yml --stack-name WebGamePipeline --capabilities "CAPABILITY_NAMED_IAM" "CAPABILITY_IAM" --parameter-overrides Branch=develop

deploy-pipeline-prod:
	aws cloudformation package --s3-bucket=${bucket} --template-file ./stacks/pipeline.yml --output-template-file ./stacks/pipeline.package.yml
	aws cloudformation deploy --template-file ./stacks/pipeline.package.yml --stack-name WebGamePipelineProd --capabilities "CAPABILITY_NAMED_IAM" "CAPABILITY_IAM" --parameter-overrides Branch=production

deploy-test:
	aws cloudformation package --s3-bucket=${bucket} --template-file ./stacks/test.yml --output-template-file ./stacks/test.dev.yml
	aws cloudformation deploy --template-file ./stacks/test.dev.yml --stack-name test-stack --capabilities "CAPABILITY_NAMED_IAM" "CAPABILITY_IAM"