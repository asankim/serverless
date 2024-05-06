'use strict';
import { APIGatewayEvent, Context, APIGatewayProxyCallback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const documentClient = new DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
});
const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME;

const send = (statusCode, data) => {
  return {
    statusCode,
    body: JSON.stringify(data),
  };
};

export const getAllNotes = async (
  event: APIGatewayEvent,
  context: Context,
  cb: APIGatewayProxyCallback
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const params = {
      TableName: NOTES_TABLE_NAME as string,
    };
    const notes = await documentClient.scan(params).promise();
    cb(null, send(200, notes));
  } catch (error) {
    cb(null, send(500, error.message));
  }
};
