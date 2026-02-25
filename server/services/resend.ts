import { Resend } from 'resend';
import { env } from '../constants/env.js';

const resend = new Resend(env.resend_api_key);

export { resend };
