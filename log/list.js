'use strict';

const debug = require('debug')('looogle')

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

function buildParams(queryParams) {
  if (queryParams.resource) {
    const resource = queryParams.resource.toLowerCase();
    return {
        IndexName: "ResourceIndex",
        KeyConditionExpression: "requestResource = :resource",
        ExpressionAttributeValues: {":resource": resource},
    };
  }

  if (queryParams.status) {
    const status = queryParams.status.toLowerCase();
    return {
      IndexName: "StatusIndex",
      KeyConditionExpression: "responseStatus = :status",
      ExpressionAttributeValues: {":status": status},
    };
  }

  return {};
}

function handleResponse(error, result, callback) {
  let response;

  if (error) {
    console.error(`Error fetching logs (STATUS: %n): %s`, error.statusCode, error);
    response = {
      statusCode: error.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t fetch the logs. Please try again or contact admin.',
    };
  } else {
    response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  }

  callback(null, response)
}

module.exports.list = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_LOG_TABLE,
  };

  const queryStringParameters = event.queryStringParameters;
  console.log('queryStringParameters', queryStringParameters);
  if (!queryStringParameters) {
    dynamoDb.scan(params, (error, result) => handleResponse(error, result, callback));
  } else {
    const queryParams = Object.assign(params, buildParams(queryStringParameters));
    dynamoDb.query(queryParams, (error, result) => handleResponse(error, result, callback));
  }
};
