import * as fs from 'fs/promises';
import * as endpoints from "../api/endpoints";
import { randomBytes } from 'node:crypto';
// import * as prettyBytes from 'pretty-bytes';
let prettyBytes: any;

import('pretty-bytes').then(pb => {
    prettyBytes = pb.default;
});

function formatDuration(milliseconds: number): string {
    let seconds = Math.floor(milliseconds / 1000);  // convert to seconds

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    seconds = seconds % 60;  // remaining seconds

    let output = "";

    if (hours > 0) {
        output += `${hours} hour${hours === 1 ? "" : "s"}`;
        if (minutes > 0 || seconds > 0) output += ", ";
    }

    if (minutes > 0) {
        output += `${minutes} minute${minutes === 1 ? "" : "s"}`;
        if (seconds > 0) output += " and ";
    }

    if (seconds > 0 || output.length === 0) {
        output += `${seconds} second${seconds === 1 ? "" : "s"}`;
    }

    return output;
}


type SpeedTestResult = {
    speed: number;
    speedPretty: string;
    timeElapsed: number;
    timeElapsedPretty: string;
};

export async function speedTestUpload(defaultContainer: string, fileSize: number): Promise<SpeedTestResult> {
    // Create test file
    const testFile = 'speedtest.tmp';
    await fs.writeFile(testFile, randomBytes(fileSize));

    // Start timer
    const start = Date.now();

    // Upload file
    await endpoints.uploadObject(defaultContainer, testFile);

    // End timer
    const end = Date.now();
    const timeElapsed = end - start;

    // Calculate upload speed
    const speed = fileSize / (timeElapsed / 1000);

    // Remove test file
    await fs.unlink(testFile);

    return {
        speed: speed,
        speedPretty: `${prettyBytes(speed)}/s`,
        timeElapsed: timeElapsed,
        timeElapsedPretty: `${formatDuration(timeElapsed)}`,
    };
}

export async function speedTestDownload(defaultContainer: string, fileSize: number): Promise<SpeedTestResult> {
    // Use test file
    const testFile = 'speedtest.tmp';

    // Start timer
    const start = Date.now();

    // Download file
    await endpoints.fetchObject(defaultContainer, testFile);

    // End timer
    const end = Date.now();
    const timeElapsed = end - start;

    // Calculate upload speed
    const speed = fileSize / (timeElapsed / 1000);

    // Remove test file
    await fs.unlink(testFile);

    return {
        speed: speed,
        speedPretty: `${prettyBytes(speed)}/s`,
        timeElapsed: timeElapsed,
        timeElapsedPretty: `${formatDuration(timeElapsed)}`,
    };
}