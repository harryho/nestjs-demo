import { Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import serverlessExpress from '@vendia/serverless-express';
import { AppModule } from './app.module';
import { configureApp } from './app.config';

let cachedHandler: Handler | null = null;

async function bootstrap(): Promise<Handler> {
  if (cachedHandler) {
    return cachedHandler;
  }

  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);

  await configureApp(app);
  await app.init();

  cachedHandler = serverlessExpress({ app: expressApp });
  return cachedHandler;
}

export const handler: Handler = async (event, context, callback) => {
  const lambdaHandler = await bootstrap();
  return lambdaHandler(event, context, callback);
};
