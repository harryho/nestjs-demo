import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.config';

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
  await configureApp(app);
  
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
