import * as dotenv from 'dotenv';
dotenv.config({ override: true });

export const baseUrl = process.env.OS_STORAGE_URL;
export const authToken = process.env.DSN_API_TOKEN;
