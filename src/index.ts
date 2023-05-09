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

import * as yaml from 'js-yaml';
import * as fs from 'fs/promises';
import axios, { Method } from 'axios';
import * as crypto from 'crypto';

// const copperAPIBaseURL = 'https://api.copper.co/';
const copperAPIBaseURL = 'https://api.stage.copper.co/';

const API_KEY = String(process.env.API_KEY);
const API_KEY_SECRET = String(process.env.API_KEY_SECRET);

async function parseYamlFile(filePath: string): Promise<any> {
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const parsedYaml = yaml.load(fileContent);
        return parsedYaml;
    } catch (error) {
        console.error(`Error reading/parsing YAML file: ${filePath}`, error);
        throw error;
    }
}

function generateSignature(secret: string, timestamp: number, method: string, urlPath: string, body: string): string {
    const dataToSign = `${timestamp}${method}${urlPath}${body}`;
    return crypto.createHmac('sha256', secret).update(dataToSign).digest('hex');
}

async function requestWithSignature(method: Method, url: string, apiKey: string, secret: string, fields: Record<string, any> = {}) {
    const timestamp = Date.now();
    const urlPath = new URL(url).pathname;
    const body = method === 'POST' ? JSON.stringify(fields) : '';

    const signature = generateSignature(secret, timestamp, method, urlPath, body);

    const headers = {
        Authorization: `ApiKey ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Signature': signature,
        'X-Timestamp': timestamp,
    };

    try {
        const response = await axios({
            method,
            url,
            headers,
            data: method === 'POST' ? fields : undefined,
        });

        return response.data;
    } catch (error) {
        console.error(`Error making ${method} request to ${url}`, error);
        throw error;
    }
}

async function saveHashMap(filePath: string, hashMap: Record<string, any>): Promise<void> {
    try {
        const jsonData = JSON.stringify(hashMap, null, 2);
        await fs.writeFile(filePath, jsonData, 'utf8');
    } catch (error) {
        console.error(`Error saving hashmap to ${filePath}`, error);
        throw error;
    }
}

async function loadHashMap(filePath: string, defaultHashMap: Record<string, any> = {}): Promise<Record<string, any>> {
    try {
        // Check if the file exists
        try {
            await fs.access(filePath);
        } catch (error) {
            // If the file doesn't exist, create it with the default hashmap
            await saveHashMap(filePath, defaultHashMap);
        }

        // Load the hashmap from the file
        const jsonData = await fs.readFile(filePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error(`Error loading hashmap from ${filePath}`, error);
        throw error;
    }
}

async function main() {
    // Read
    const yamlFilePath = './edenblockkeys.yml';
    const yamlData = await parseYamlFile(yamlFilePath);

    let nodeKeys = Object.keys(yamlData.keys);

    // TODO: once the code has been validated, remove this slice to process all items
    nodeKeys = nodeKeys.slice(0, 1);
    // END TODO

    const nodes = nodeKeys.map(nodeKey => {
        const node = yamlData.keys[nodeKey];
        return {
            ...node,
            key: nodeKey,
        };
    });
    console.log(`Processing ${nodes.length} nodes.`);

    // // Get accounts
    // try {
    //     const result = await requestWithSignature(
    //         'GET',
    //         `${copperAPIBaseURL}platform/accounts`,
    //         API_KEY,
    //         API_KEY_SECRET
    //     )
    //     console.log(result.response)
    //     console.log(result.data)
    // } catch (error) {
    //     console.error('Error making GET request:', error);
    // }

    // Load current state
    const stateFilePath = './state.json';
    let state: Record<string, any> = {};
    try {
        state = await loadHashMap(stateFilePath);
    } catch (error) {
        console.error('Error loading state:', error);
    }

    // For each node do the request and save the state if it wasn't processed before
    for (const node of nodes) {
        // Skip nodes that were already processed
        if (state[node.key]) {
            console.log(`Skipping node ${node.key} because it was already processed.`);
            continue;
        }

        const url = `${copperAPIBaseURL}platform/orders`;
        const fields = {
            externalOrderId: node.key,
            baseCurrency: 'POKT',
            orderType: 'stake-delegation',
            portfolioId: '', // AccountID
            amount: '65005000000', // 60005 POKT
            blockchainTransactionType: 'stake-delegation',
        };
        try {
            const result = await requestWithSignature('POST', url, API_KEY, API_KEY_SECRET, fields);
            state[node.key] = result;

            // Save the current progress
            saveHashMap(stateFilePath, state);
        } catch (error) {
            console.error('Error making POST request:', error);
            state[node.key] = error;

            // Save the current progress
            saveHashMap(stateFilePath, state);
        }
    }
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
