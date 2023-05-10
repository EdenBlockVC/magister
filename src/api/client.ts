// src/api/client.ts
import axios, { Method, AxiosResponse } from 'axios';

export async function makeRequest(
    method: Method,
    url: string,
    params?: Record<string, any>,
    headers?: Record<string, any>,
): Promise<AxiosResponse<any>> {
    try {
        const response = await axios({
            method,
            url,
            params: method === 'GET' || method === 'HEAD' ? params : undefined,
            data: method !== 'GET' && method !== 'HEAD' ? params : undefined,
            headers,
        });

        return response;
    } catch (error) {
        console.error(`Error making ${method} request to ${url}`, error);
        throw error;
    }
}