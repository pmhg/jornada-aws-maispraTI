#!/bin/bash

# exit if no input params are supplied
S3_REPO=$(cat package.json | jq -r '.name' | rev | cut -d- -f 1 | rev)
REGION=${REGION:-sa-east-1}
ENV=${NODE_ENV:-hlg}
PROFILE=leeurope-$ENV
API_GATEWAY_ID=$(aws apigateway get-rest-apis --output json --profile $PROFILE | jq -r ".items[] | select(.name==\"$ENV-leeurope-api-$S3_REPO\") | .id")

echo "S3_REPO=$S3_REPO"
echo "REGION=$REGION"
echo "ENV=$ENV"
echo "PROFILE=$PROFILE"
echo "API_GATEWAY_ID=$API_GATEWAY_ID"

# check if bucket exists /$ENV/null prevents error
if aws s3api head-bucket --profile $PROFILE --bucket $ENV-leeurope-api-docs 2>/dev/null;  
then 
  echo 'bucket exists enable hosting'; 
else 
  echo 'no bucket - create it'; 
  aws s3api create-bucket --profile $PROFILE --bucket $ENV-leeurope-api-docs --region $REGION --create-bucket-configuration LocationConstraint=$REGION
fi

# remove old version of doc's
aws s3 rm s3://$ENV-leeurope-api-docs/$S3_REPO --recursive --profile $PROFILE
echo "$ENV-leeurope-api-docs/$S3_REPO removed";

# remove swagger-ui folder then clone repo for the latest version 
rm -rf swagger-ui
git clone https://github.com/swagger-api/swagger-ui.git
# replace reference inside index.html from https://petstore.swagger.io/v2/swagger.json to leeurope-api-$S3_REPO.json 
sed -i "s/https:\/\/petstore.swagger.io\/v2\/swagger.json/leeurope-api-$S3_REPO.json/g" /swagger-ui/dist/index.html 

# storage swagger ui to S3 bucket 
aws s3 cp ./swagger-ui/dist s3://$ENV-leeurope-api-docs/$S3_REPO/ --profile $PROFILE --recursive --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers

# export swagger doc from API Gateway
aws apigateway get-export --parameters extensions='apigateway' --profile $PROFILE --rest-api-id $API_GATEWAY_ID --stage-name $ENV --export-type swagger ./leeurope-api-$S3_REPO.json --region $REGION

node ./rebuildJSON.js

# storage exported file to S3
aws s3 cp ./leeurope-api-$S3_REPO.json s3://$ENV-leeurope-api-docs/$S3_REPO/ --profile $PROFILE --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers

# cleanup
rm -rf swagger-ui

# print your bucket url
echo https://$ENV-leeurope-api-docs.s3.$REGION.amazonaws.com/$S3_REPO/index.html