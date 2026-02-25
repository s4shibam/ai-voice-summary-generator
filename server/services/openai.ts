import OpenAI, { toFile } from 'openai';
import { env } from '../constants/env.js';

export const openai = new OpenAI({
  apiKey: env.openai_api_key
});

export { toFile };
