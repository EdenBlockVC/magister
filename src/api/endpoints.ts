// src/api/endpoints.ts
import axios from 'axios';
import { makeRequest } from './client';
import { baseUrl, authToken } from '.';

const accountName = process.env.NEAR_ACCOUNT;

async function parseContainers(data: any[]): Promise<string[]> {
    const containers: string[] = data.map((container): string => {
        return container.name;
    });
    return containers;
}

export async function fetchContainers() {
    const url = `${baseUrl}`;
    const response = await makeRequest('GET', url, {}, {
        'X-Auth-Token': authToken,
    });
    return parseContainers(response.data);
}

export async function fetchContainersInfo() {
    const url = `${baseUrl}`;
    const response = await makeRequest('HEAD', url, {}, {
        'X-Auth-Token': authToken,
    });
    return response;
}

type ContainerMetadata = {
    [key: string]: string;
};

export async function updateAccountMetadata(metadata: ContainerMetadata) {
    const url = `${baseUrl}`;

    // Create headers
    let headers: any = {};

    for (const key in metadata) {
        headers[`X-Account-Meta-${key}`] = metadata[key];
    }

    const response = await makeRequest('HEAD', url, {}, {
        'X-Auth-Token': authToken,
        ...headers
    });
    return response;
}

// Containers

export async function createContainer(containerName: string) {
    const url = `${baseUrl}/${containerName}`;
    const response = await makeRequest('PUT', url, {}, {
        'X-Auth-Token': authToken,
        'X-Container-Meta-Book': 'beep boop',
    });
    return response.status === 201;
}

export async function fetchContainerInfo(containerName: string) {
    const url = `${baseUrl}/${containerName}`;
    const response = await makeRequest('HEAD', url, {}, {
        'X-Auth-Token': authToken,
    });

    if (response.status === 404) {
        throw new Error(`Container ${containerName} not found`);
    }

    return response.headers;
}

// Objects

export async function fetchContainerObjects(containerName: string) {
    const url = `${baseUrl}/${containerName}`;
    const response = await makeRequest('GET', url, {}, {
        'X-Auth-Token': authToken,
    });
    return response.data;
}

import * as fs from 'fs/promises';

export async function fetchObject(containerName: string, objectName: string, outputPath?: string | undefined) {
    const url = `${baseUrl}/${containerName}/${objectName}`;
    const response = await makeRequest('GET', url, {}, {
        'X-Auth-Token': authToken,
    }, 'stream');

    if (!outputPath) {
        outputPath = objectName;
    }

    // Write the response data to the file
    await fs.writeFile(outputPath, response.data, 'binary');
}

export async function uploadObject(containerName: string, objectName: string) {
    // Read the file
    const data = await fs.readFile(objectName);

    const url = `${baseUrl}/${containerName}/${objectName}`;
    const response = await makeRequest('PUT', url, data, {
        'X-Auth-Token': authToken,
    }, 'stream');
    return response;
}
