import path from 'path';
import {
  stack,
  resource,
  zipAsset,
  TemplateSpec,
  resourceGroup,
  ResourceScope,
  awsStr,
  AwsParams,
} from '@fmtk/cfnutil';
import {
  ResourceType,
  IAMRoleProps,
  LambdaFunctionProps,
  ApiGatewayMethodProps,
} from '@fmtk/cfntypes';

export function myStack(): TemplateSpec {
  return stack('MyStack', scope => {
    const [handler, handlerAttribs] = handlerGroup(scope, 'MyHandler');

    const [restApi, restApiAttribs] = resource(scope, 'RestApi', {
      Type: ResourceType.ApiGatewayRestApi,
      Properties: {},
    });

    const [apiMethod] = resource(scope, 'ApiMethod', {
      Type: ResourceType.ApiGatewayMethod,
      Properties: as<ApiGatewayMethodProps>({
        HttpMethod: 'GET',
        RestApiId: restApiAttribs.ref,
        ResourceId: restApiAttribs.RootResourceId,
        Integration: {
          IntegrationHttpMethod: 'POST',
          Type: 'AWS_PROXY',
          Uri: awsStr`arn:${AwsParams.Partition}:apigateway:eu-west-2:lambda:path/2015-03-31/functions/${handlerAttribs.lambdaArn}/invocations`,
        },
      }),
    });

    return [handler, restApi, apiMethod];
  });
}

function handlerGroup(scope: ResourceScope, name: string) {
  return resourceGroup(scope, name, scope => {
    const [role, roleAttribs] = resource(scope, 'HandlerRole', {
      Type: ResourceType.IAMRole,
      Properties: as<IAMRoleProps>({
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: {
                Service: 'lambda.amazonaws.com',
              },
            },
          ],
          Version: '2012-10-17',
        },
        ManagedPolicyArns: [
          'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
        ],
      }),
    });

    const [handlerAsset, handlerCode] = zipAsset([
      {
        source: path.resolve(__dirname, '../lib/lambda.js'),
        target: 'index.js',
      },
    ]);

    const [handler, handlerAttribs] = resource(scope, 'HandlerFunc', {
      Type: ResourceType.LambdaFunction,
      Properties: as<LambdaFunctionProps>({
        Code: handlerCode,
        Handler: 'index.handler',
        Role: roleAttribs.Arn,
        Runtime: 'runtime',
      }),
    });

    return [
      [role, handlerAsset, handler],
      {
        lambdaArn: handlerAttribs.Arn,
      },
    ];
  });
}

// type helper for use until microsoft/TypeScript#35702 is fixed
function as<T>(value: T): T {
  return value;
}

console.log(JSON.stringify(myStack(), null, 2));
