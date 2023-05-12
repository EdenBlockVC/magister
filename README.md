# Magister Locus

CLI tool for OnMachina™️

## Install dependencies

```console
yarn
```

## Run

```console
yarn run dev
```

## Usage

First you should make sure to import the environment variables found in the [settings page](https://demo.onmachina.io/settings). For this to work you need the variables `DSN_API_TOKEN` and `OS_STORAGE_URL` in your console or in a `.env` file.

### Create a container

Create and set the container as the current one.

```console
yarn start container [name]
```

### Upload or download a file

This uses the current container to store the files.

```console
yarn start upload <file-path>
yarn start download <object-name>
```

### Delete a file

Delete a file from the current container.

```console
yarn start delete <object-name>
```

### List files

List all files in the current container.

```console
yarn start list
```

### Info

Get info about a file in the current container.

```console
yarn start info <object-name>
```
