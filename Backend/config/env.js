import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'JWT_SECRET',
  'MONGO_URI',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET'
];

export const validateEnv = () => {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ env.js: FAILED - Missing required environment variables:', missing.join(', '));
    process.exit(1);
  }
  
  console.log('✅ env.js: SUCCESS - Environment variables validated');
};