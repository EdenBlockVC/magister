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

import * as endpoints from "./api/endpoints";

async function main() {
    const containerCreated = await endpoints.createContainer("test-container");
    console.log("Container created: ", containerCreated);

    console.log(
        await endpoints.fetchContainerInfo('test-container')
    )

    console.log("Containers: ", await endpoints.fetchContainers());

    console.log("Objects: ", await endpoints.fetchContainerObjects('eden-block'));

    await endpoints.uploadObject('eden-block', 'test-orig.png');
    await endpoints.fetchObject('eden-block', 'test-orig.png', 'test-down.png');

    // const metadata = {
    //     "test": "test",
    //     "test2": "test2"
    // };
    // endpoints.updateAccountMetadata(metadata);
    // console.log("Containers info: ", await endpoints.fetchContainersInfo());
}

main();