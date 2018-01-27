# log-micro-service
Micro service exposing remote resources and operations specific to logging CRUD through AWS Lambda.

Important, you must have an appr

## Setup
To run this script you must have node installed before leveraging npm to install the project's dependencies. Once you have this installed, then you may install all dependencies for this project from the project root.
```
npm install
```

## Deploy
You must first ensure that you have the appropriate policy/permissions for adminstrating the following with your `dev` configured role:
* CloudFormation
* DynamoDB
* Lambda
* S3

To deploy the project you must first install the Serverless Framework via npm which was already installed when you installed Node.js (see `Setup` above):
```
npm install -g serverless
```

Once the installation process is done you can verify that Serverless is installed successfully by running the following command in your terminal:
```
serverless --version
```

Now that you have the Serverless Framework installed, you may deploy the services to AWS Lambda via the following terminal command:
```
serverless deploy
```

If your deployment was successful, you will see the script successfully completed and provided you with the URL paths to the resources that are now exposed though AWS API Gateway. You will also be able to find that sitting behind these paths are AWS Lambda functions for handling requests against the DynamoDB tables that were successfully created (w/all necessary indexes).

NOTE: To initialize data in these tables please see the `log-digest` project.
