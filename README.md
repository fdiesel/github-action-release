# Release - GitHub Action

Creates a new release based on conventional commits.

Reverts the release in the post job in case a step has failed.

## Usage

```yml
name: Release

on:
  push:
    branches: main

jobs:
  release:
    runs-on: ubuntu-latest

    permissions:
      contents: write

    steps:
      - name: Checkout Main
        uses: actions/checkout@v4

      - name: Release
        uses: fdiesel/release-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }} # required
          prefix: v # optional tag prefix (default: v)
          phase: # optional phase (dev / prod) (default: dev)
          strategy: node # optional (default: '')
```

### Strategies

If no strategy is set, the workflow will only use git and not update any files.

| value | task                                                                                           |
| :---- | :--------------------------------------------------------------------------------------------- |
| node  | utilizes `npm version ...` to bump the version in the package.json and package-lock.json files |

### Outputs

| key         | value                                          |
| :---------- | :--------------------------------------------- |
| created     | 'true' if a release was created                |
| pre-release | 'true' if the created release is a pre-release |
| tag         | tag name                                       |
| majorTag    | major version tag name                         |
| version     | semantic version                               |
| major       | major version                                  |
