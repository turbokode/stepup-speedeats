import 'dotenv/config';
import { z } from 'zod';

export const APP_ENV = z.string().parse(process.env.APP_ENV || 'dev');
export const BASE_URL = z.string().parse(process.env.BASE_URL || 'http://localhost');
export const PORT = z.coerce.number().parse(process.env.PORT || 3333);
export const APP_SECRET = z.string().parse(process.env.APP_SECRET);

export const API_KEY = z.string().parse(process.env.API_KEY);
export const AUTH_DOMAIN = z.string().parse(process.env.AUTH_DOMAIN);
export const PROJECT_ID = z.string().parse(process.env.PROJECT_ID);
export const STORAGE_BUCKET = z.string().parse(process.env.STORAGE_BUCKET);
export const MESSAGING_SENDER_ID = z.string().parse(process.env.MESSAGING_SENDER_ID);
export const APP_ID = z.string().parse(process.env.APP_ID);
