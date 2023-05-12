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

import { program } from 'commander';
import chalk from 'chalk';
import * as endpoints from "./api/endpoints";
import * as config from "./utils/config";

async function main() {
    // Set program details
    program.name('magister')
        .version('0.0.1')
        .description('A CLI tool for interacting with On Machina™️');

    // Handle containers
    program.command('container [containerName]')
        .alias('c')
        .description('Create and switch to container')
        .action(async (containerName) => {
            if (containerName === undefined) {
                // If no container name is provided, use the default container
                const configData = await config.getConfig();
                containerName = configData.defaultContainer;
                console.log(chalk.blue("Using container:", containerName));
                return;
            }
            // Check if the container already exists
            const containers = await endpoints.fetchContainers();
            if (containers.includes(containerName)) {
                console.log(chalk.blue(`Container exists: ${containerName}`));
            } else {
                const containerCreated = await endpoints.createContainer(containerName);
                console.log(chalk.green(`Container created: ${containerName}`));
            }

            // Set the default container
            console.log(chalk.blue(`Using container: ${containerName}`));
            config.updateConfig({
                defaultContainer: containerName
            });
        });

    // Upload a file
    program.command('upload <file>')
        .alias('u')
        .alias('up')
        .description('Upload a file to the default container')
        .action(async (objectName) => {
            const defaultContainer = (await config.getConfig()).defaultContainer;
            await endpoints.uploadObject(defaultContainer, objectName);
        });

    // Download a file
    program.command('download <file>')
        .alias('d')
        .alias('dl')
        .alias('down')
        .description('Download a file from the default container')
        .action(async (objectName) => {
            const defaultContainer = (await config.getConfig()).defaultContainer;
            await endpoints.fetchObject(defaultContainer, objectName, objectName);
        });

    // List files
    program.command('list')
        .alias('ls')
        .description('List objects in the default container')
        .action(async () => {
            const defaultContainer = (await config.getConfig()).defaultContainer;
            const objects = await endpoints.fetchObjectList(defaultContainer);
            console.table(objects);
        });

    // Remove file
    program.command('remove <file>')
        .alias('rm')
        .alias('del')
        .alias('delete')
        .description('Remove a file from the default container')
        .action(async (objectName) => {
            const defaultContainer = (await config.getConfig()).defaultContainer;
            const deleted = await endpoints.deleteObject(defaultContainer, objectName);

            if (deleted === false) {
                console.log(chalk.red(`File not found: ${objectName} `));
                return;
            } else {
                console.log(chalk.green(`File deleted: ${objectName} `));
            }
        });

    // Get file info
    program.command('info <file>')
        .alias('i')
        .alias('inf')
        .alias('information')
        .description('Get information about a file from the default container')
        .action(async (objectName) => {
            const defaultContainer = (await config.getConfig()).defaultContainer;
            const info = await endpoints.infoObject(defaultContainer, objectName);
            if (info === null) {
                console.log(chalk.red(`File not found: ${objectName}`));
                return;
            }

            console.table(info);
        });

    // Parse commands
    program.parse();
}

main();