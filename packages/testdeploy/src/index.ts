import path from 'path';
import { stack, resource, zipAsset, TemplateSpec } from '@fmtk/cfnutil';
import {
  ResourceType,
  IAMRoleProps,
  LambdaFunctionProps,
} from '@fmtk/cfntypes';

export function myStack(): TemplateSpec {
  return stack('MyStack', scope => {
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

    const [handler] = resource(scope, 'HandlerFunc', {
      Type: ResourceType.LambdaFunction,
      Properties: as<LambdaFunctionProps>({
        Code: handlerCode,
        Handler: 'index.handler',
        Role: roleAttribs.Arn,
        Runtime: 'runtime',
      }),
    });

    return [role, handler, handlerAsset];
  });
}

// type helper for use until microsoft/TypeScript#35702 is fixed
function as<T>(value: T): T {
  return value;
}
