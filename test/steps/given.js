'use strict';
const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.an_authenticated_user = async () => {
  const userPoolId = process.env.USER_POOL_ID;
  const clientId = process.env.CLIENT_ID;
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  const params = {
    UserPoolId: userPoolId,
    ClientId: clientId,
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  let user = await cognito.adminInitiateAuth(params).promise();
  return user;
};
