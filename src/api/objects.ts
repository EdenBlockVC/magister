import * as fs from 'fs/promises';
import * as mime from 'mime-types';
import path from 'path';
import { makeRequest } from './client';
import { baseUrl, authToken } from '.';


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

export async function uploadObject(containerName: string, objectName: string, overwrite: boolean = false) {
    // Read the file
    const data = await fs.readFile(objectName);
    const mimeType = mime.lookup(objectName);

    // Filename
    const filename = path.basename(objectName);

    const url = `${baseUrl}/${containerName}/${filename}`;
    const response = await makeRequest('PUT', url, data, {
        'X-Auth-Token': authToken,
        'Content-Type': mimeType,
    }, 'stream');
    return response.status === 201;
}

export async function fetchObjectList(containerName: string) {
    const url = `${baseUrl}/${containerName}`;
    const response = await makeRequest('GET', url, {}, {
        'X-Auth-Token': authToken,
    });
    return response.data;
}

export async function deleteObject(containerName: string, objectName: string) {
    const url = `${baseUrl}/${containerName}/${objectName}`;
    const response = await makeRequest('DELETE', url, {}, {
        'X-Auth-Token': authToken,
    });
    return response.status === 204;
}

export async function infoObject(containerName: string, objectName: string) {
    const url = `${baseUrl}/${containerName}/${objectName}`;
    const response = await makeRequest('HEAD', url, {}, {
        'X-Auth-Token': authToken,
    });

    if (response.status === 404) {
        return null;
    }

    return response.headers;
}
