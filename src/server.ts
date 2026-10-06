import app from './app';
import { config } from './infrastructure/config/env';
import { connectDatabase, disconnectDatabase } from './infrastructure/database/prisma';

async function startServer() {
  await connectDatabase();

  const server = app.listen(config.port, '0.0.0.0', () => {
    console.log(`Application is running on http://0.0.0.0:${config.port} (Port ${config.port})`);
  });


  const handleShutdown = async (signal: string) => {
    console.log(`Received ${signal}. Gracefully shutting down...`);
    server.close(async () => {
      await disconnectDatabase();
      console.log('Server and database connection closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
