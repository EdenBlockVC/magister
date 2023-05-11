import os from 'os';
import fs from 'fs';
import path from 'path';

// Define the path to the config file
const homeDir = os.homedir();
const configFilePath = path.join(homeDir, '.magister', 'config.json');

type Config = {
    defaultContainer: string;
};

export async function createDefaultConfig() {
    // Check if the config file exists
    if (!fs.existsSync(configFilePath)) {
        // If not, create it with some default configuration
        const defaultConfig = {
            defaultContainer: 'magister'
        };

        // Ensure the directory exists
        fs.mkdirSync(path.dirname(configFilePath), { recursive: true });

        // Write the default configuration to the file
        fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2));
    }
}

export async function getConfig(): Promise<Config> {
    // Ensure the config file exists
    await createDefaultConfig();

    // Read the config file
    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));

    // Return the config
    return config;
}

export async function setConfig(newConfig: any) {
    // Ensure the config file exists
    await createDefaultConfig();

    // Write the config file
    fs.writeFileSync(configFilePath, JSON.stringify(newConfig, null, 2));
}

export async function updateConfig(newConfig: any) {
    // Ensure the config file exists
    await createDefaultConfig();

    // Read the config file
    const config = await getConfig();

    // Update the config
    const updatedConfig = {
        ...config,
        ...newConfig
    };

    // Write the config file
    fs.writeFileSync(configFilePath, JSON.stringify(updatedConfig, null, 2));
}
