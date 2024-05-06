'use strict';
import { v4 as uuid } from 'uuid';
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

export const createNote = async (
  event: APIGatewayEvent,
  context: Context,
  cb: APIGatewayProxyCallback
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let data = JSON.parse(event.body as string);
  try {
    const params = {
      TableName: NOTES_TABLE_NAME as string,

      Item: {
        id: uuid(),
        title: data.title,
        body: data.body,
        createdAt: new Date().toJSON(),
      },
      ConditionExpression: 'attribute_not_exists(id)',
    };
    await documentClient.put(params).promise();
    cb(null, send(201, data));
  } catch (error) {
    cb(null, send(500, error.message));
  }
};
