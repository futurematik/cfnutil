const _AwsParams = {
  AccountId: { Ref: 'AWS::AccountId' },
  Partition: { Ref: 'AWS::Partition' },
  Region: { Ref: 'AWS::Region' },
  StackId: { Ref: 'AWS::StackId' },
  StackName: { Ref: 'AWS::StackName' },
  UrlSuffix: { Ref: 'AWS::UrlSuffix' },
};

type Params = { [K in keyof typeof _AwsParams]: string };

export const AwsParams: Params = (_AwsParams as unknown) as Params; // type for output
