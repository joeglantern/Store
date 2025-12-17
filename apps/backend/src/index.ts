import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import { testSupabaseConnection } from './lib/supabase.js';
import { productRoutes } from './routes/products.js';
import { categoryRoutes } from './routes/categories.js';
import { variantRoutes } from './routes/variants.js';
import { uploadRoutes } from './routes/upload.js';
import { initializeStorageBucket } from './services/storage.service.js';
import { setupWebSocket } from './config/socket.js';
import { setupSocketHandlers } from './websocket/index.js';

const fastify = Fastify({
  logger: true,
});

// Register plugins
await fastify.register(cors, {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
});

await fastify.register(helmet);

await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

await fastify.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Health check route
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Register API routes
await fastify.register(productRoutes, { prefix: '/api/v1' });
await fastify.register(categoryRoutes, { prefix: '/api/v1' });
await fastify.register(variantRoutes, { prefix: '/api/v1' });
await fastify.register(uploadRoutes, { prefix: '/api/v1' });

// Start server
const start = async () => {
  try {
    // Test Supabase connection
    console.log('Testing Supabase connection...');
    const supabaseConnected = await testSupabaseConnection();
    if (supabaseConnected) {
      console.log('✅ Supabase connection successful');

      // Initialize storage bucket
      await initializeStorageBucket();
    } else {
      console.warn('⚠️  Supabase connection failed - check your environment variables');
    }

    // Setup WebSocket on the same HTTP server (before listen)
    const io = await setupWebSocket(fastify.server);

    // Setup WebSocket event handlers
    setupSocketHandlers(io);

    // Make io available globally for broadcasting from services (before listen)
    fastify.decorate('io', io);

    const port = parseInt(process.env.PORT || '4000', 10);
    await fastify.listen({ port, host: '0.0.0.0' });

    console.log(`🚀 Backend server running on http://localhost:${port}`);
    console.log(`🔌 WebSocket ready on ws://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
