import { baseUrl, authToken } from '.';
import { makeRequest } from './client';

async function parseContainers(data: any[]): Promise<string[]> {
    const containers: string[] = data.map((container): string => {
        return container.name;
    });
    return containers;
}

export async function fetchContainers() {
    const url = `${baseUrl}`;
    const response = await makeRequest(
        'GET',
        url,
        {},
        {
            'X-Auth-Token': authToken,
        },
    );

    return parseContainers(response.data);
}
