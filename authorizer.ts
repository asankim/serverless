import {
  APIGatewayTokenAuthorizerEvent,
  AuthResponse,
  Context,
  PolicyDocument,
} from 'aws-lambda';

const { CognitoJwtVerifier } = require('aws-jwt-verify');
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNIT_WEB_CLIENT_ID = process.env.COGNIT_WEB_CLIENT_ID;

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: 'id',
  clientId: COGNIT_WEB_CLIENT_ID,
});

const generatePolicy = (principalId, effect, resource): AuthResponse => {
  let authResponese = {} as AuthResponse;
  let tmp = resource.split(':');
  let apiGatewayArnTmp = tmp[5].split('/');
  let resourceConfig =
    tmp[0] +
    ':' +
    tmp[1] +
    ':' +
    tmp[2] +
    ':' +
    tmp[3] +
    ':' +
    tmp[4] +
    ':' +
    apiGatewayArnTmp[0] +
    '/*/*';

  resource = resourceConfig;
  authResponese.principalId = principalId;
  if (effect && resource) {
    let policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: effect,
          Resource: resource,
          Action: 'execute-api:Invoke',
        },
      ],
    };
    authResponese.policyDocument = policyDocument;
  }

  authResponese.context = {
    foo: 'bar',
  };
  console.log(JSON.stringify(authResponese));
  return authResponese;
};
export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
  context: Context,
  callback: any
) => {
  let token = event.authorizationToken;
  console.log(token);
  try {
    const payload = await jwtVerifier.verify(token);
    console.log(JSON.stringify(payload));
    callback(null, generatePolicy('user', 'Allow', event.methodArn));
  } catch (error) {
    callback(null, 'Error: Invalid token');
  }
};
