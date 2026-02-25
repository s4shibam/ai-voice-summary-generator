import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const env = {
  openai_api_key: process.env.OPENAI_API_KEY,
  resend_api_key: process.env.RESEND_API_KEY
};
