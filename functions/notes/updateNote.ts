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

export const updateNote = async (
  event: APIGatewayEvent,
  context: Context,
  cb: APIGatewayProxyCallback
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let id = event.pathParameters?.id;
  let data = JSON.parse(event.body as string);
  try {
    const params = {
      TableName: NOTES_TABLE_NAME as string,
      Key: { id },
      UpdateExpression: 'set #title = :title, #body = :body',
      ExpressionAttributeNames: {
        '#title': 'title',
        '#body': 'body',
      },
      ExpressionAttributeValues: {
        ':title': data.title,
        ':body': data.body,
      },
      ConditionExpression: 'attribute_exists(id)',
    };
    await documentClient.update(params).promise();
    cb(null, send(200, data));
  } catch (error) {
    cb(null, send(500, error.message));
  }
};
