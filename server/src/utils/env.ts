import 'dotenv/config';

export const BASE_URL = process.env.BASE_URL || 'http://localhost:3333';
export const APP_ENV = process.env.APP_ENV || 'dev';
export const APP_SECRET = process.env.APP_SECRET as string;

export const DATABASE_URL = process.env.DATABASE_URL;

// FIREBASE
export const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY as string;
export const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN as string;
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID as string;
export const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET as string;
export const FIREBASE_MESSAGING_SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID as string;
export const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID as string;
