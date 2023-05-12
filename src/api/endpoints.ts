// src/api/endpoints.ts
import { makeRequest } from './client';
import { baseUrl, authToken } from '.';

// Object management
import { fetchObject, uploadObject, fetchObjectList, deleteObject, infoObject } from './objects';
export { fetchObject, uploadObject, fetchObjectList, deleteObject, infoObject };

// Container management
import { fetchContainers } from './containers';
export { fetchContainers };

// TODO: Implement
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

// TODO: Implement
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

// TODO: Implement
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
