// Copyright 2023 Daniel Luca

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// 	http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

import axios, { Method, AxiosResponse } from 'axios';

async function makeRequest(
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

// const baseUrl = 'https://api.testnet.onmachina.io/v1/';
const baseUrl = 'http://localhost:8080/v1/';

async function main() {
    // Example usage for GET request
    const accountsUrl = `${baseUrl}accounts`;
    const getResponse = await makeRequest('GET', accountsUrl, undefined, {
        'X-Auth-Token': 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODM2MjcwMTYsIm5iZiI6MTY4MzYyNzAxNiwiZXhwIjoxNjgzNjMwNjE2LCJzdWIiOiJjbGVhbnVuaWNvcm4udGVzdG5ldCJ9.bzxkQUqHvWISGQz4Mky_uwzqZx1oKuDVHMGImzaAYEzc-gXVcyjws3zfTnHWeZRQ4vlXGLSQzomXHQMCCXpKAQ'
    });
    console.log('GET request response data:', getResponse.data);

    // Example usage for POST request
    const postUrl = 'https://jsonplaceholder.typicode.com/posts';
    const postParams = {
        title: 'foo',
        body: 'bar',
        userId: 1,
    };
    const postHeaders = {
        'Content-type': 'application/json; charset=UTF-8',
    };
    const postResponse = await makeRequest('POST', postUrl, postParams, postHeaders);
    console.log('POST request response data:', postResponse.data);
}

main();