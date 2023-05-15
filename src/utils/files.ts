import * as fs from 'fs/promises';
import { randomBytes } from 'node:crypto';

export async function createFile(fileName: string, size: number) {
    await fs.writeFile(fileName, randomBytes(size));
}

export async function removeFile(fileName: string) {
    await fs.unlink(fileName);
}

export async function fileSize(fileName: string) {
    const stats = await fs.stat(fileName);
    return stats.size;
}
