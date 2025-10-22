#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NestjsDemoStack } from '../lib/nestjs-demo-stack';

const app = new cdk.App();
const lambdaEnv = app.node.tryGetContext('lambdaEnv') as Record<string, string> | undefined;

new NestjsDemoStack(app, 'NestjsDemoStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  lambdaEnvironment: lambdaEnv,
});
