import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function findAvailablePort(startPort: number): Promise<number> {
  const net = require('net');
  
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  app.enableCors();
  
  const config = new DocumentBuilder()
    .setTitle('NestJS Customer API')
    .setDescription('REST API for managing customers with JWT authentication')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const preferredPort = parseInt(process.env.PORT) || 3000;
  const port = await findAvailablePort(preferredPort);
  
  await app.listen(port);
  
  if (port !== preferredPort) {
    console.log(`⚠️  Port ${preferredPort} was occupied, using port ${port} instead`);
  }
  
  console.log(`✅ Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger API documentation available at: http://localhost:${port}/api`);
}
bootstrap();
