import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi, AccessLogFormat, LogGroupLogDestination } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import * as path from 'path';

interface NestjsDemoStackProps extends StackProps {
  readonly lambdaEnvironment?: Record<string, string>;
}

export class NestjsDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: NestjsDemoStackProps) {
    super(scope, id, props);

    const lambda = new NodejsFunction(this, 'NestApiLambda', {
      entry: path.join(__dirname, '..', '..', 'src', 'lambda.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
      memorySize: 1024,
      timeout: Duration.seconds(30),
      bundling: {
        externalModules: ['pg-native'],
        nodeModules: ['@vendia/serverless-express', 'pg', 'reflect-metadata'],
        sourcesContent: false,
      },
      environment: {
        NODE_ENV: 'production',
        ...props?.lambdaEnvironment,
      },
    });

    const accessLogs = new LogGroup(this, 'ApiAccessLogs', {
      retention: RetentionDays.ONE_WEEK,
    });

    new LambdaRestApi(this, 'NestApiGateway', {
      handler: lambda,
      proxy: true,
      deployOptions: {
        stageName: 'prod',
        accessLogDestination: new LogGroupLogDestination(accessLogs),
        accessLogFormat: AccessLogFormat.clf(),
      },
    });
  }
}
