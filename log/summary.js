'use strict';

const debug = require('debug')('looogle')

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.summary = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_SUMMARY_TABLE,
  };

  dynamoDb.scan(params, (error, result) => {
    let response;

    if (error) {
      console.error(`Error fetching summaries (STATUS: %n): %s`, error.statusCode, error);
      response = {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch log summaries. Please try again or contact admin.',
      };
    } else {
      response = {
        statusCode: 200,
        body: JSON.stringify(result.Items),
      };
    }

    callback(null, response)
  });
};
