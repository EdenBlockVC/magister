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
        .description('Create and switch to container')
        .action(async (containerName) => {
            if (containerName === undefined) {
                // If no container name is provided, use the default container
                const configData = await config.getConfig();
                containerName = configData.defaultContainer;
                console.log(chalk.blue("Using default container:", containerName));
            }

            // Check if the container already exists
            const containers = await endpoints.fetchContainers();
            if (containers.includes(containerName)) {
                console.log(chalk.blue("Container already exists"));
            } else {
                const containerCreated = await endpoints.createContainer(containerName);
                console.log(chalk.green("Container created:", containerCreated));
            }

            // Set the default container
            config.updateConfig({
                defaultContainer: containerName
            });
        });

    // Upload an object
    program.command('upload <objectName>')
        .description('Upload an object to the default container')
        .action(async (objectName) => {
            const defaultContainer = (await config.getConfig()).defaultContainer;
            await endpoints.uploadObject(defaultContainer, objectName);
        });

    // Download an object
    program.command('download <objectName>')
        .description('Download an object from the default container')
        .action(async (objectName) => {
            const defaultContainer = (await config.getConfig()).defaultContainer;
            await endpoints.fetchObject(defaultContainer, objectName, objectName);
        });

    // List objects
    program.command('list')
        .description('List objects in the default container')
        .action(async () => {
            const defaultContainer = (await config.getConfig()).defaultContainer;
            const objects = await endpoints.fetchObjectList(defaultContainer);
            console.table(objects);
        });

    // Parse commands
    program.parse();
}

main();