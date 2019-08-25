# ShardyMcShardFace

Package to shard a set of items based on CI parallelization parameters, e.g. `YOUR_CI_SYSTEM_INDEX` and `YOUR_CI_SYSTEM_COUNT`.

## Features:

-   Shards as evenly as possible, uneven splits will end up in the tail shards
-   Supports sharding less items than parallelization count; tail shards will be empty
-   Distributes items into shards based on a given seed for a random number generator to provide random, but stable distribution.
-   Fully typed in Typescript

## Installation

```bash
yarn add shardy-mc-shard-face
```

## Usage

```
shardyMcShardFace(items: any[] [, seed: string]): shard[];
```

You can get debug output by setting the environment variable `DEBUG=ShardyMcShardFace:*`.

## Example

```ts
import { shard as shardyMcShardFace } from 'shardy-mc-shard-face';
const shard = shardyMcShardFace([1, 2, 3, 4]);
// shard is an array that contains items based on YOUR_CI_SYSTEM_INDEX and YOUR_CI_SYSTEM_COUNT
```

## CLI example

```bash
cat items | shardy shard
```

Input is expected to be newline-separated to `stdin`. Output is also newline-separated to `stdout`.

On a CI run this would look like this:
```bash
# CI_NODE_INDEX=1 (set by your CI system)
# CI_NODE_TOTAL=2 (set by your CI system)
echo "A\nB" | shardy shard
# Will print "A" (w/o quotes) to stdout
```

you can control the seed as well via `-s <seed>`.
For a full list of options, please run `shardy --help`.

## CI system support

CI systems supported are the ones supported by [ci-parallel-vars](https://github.com/jamiebuilds/ci-parallel-vars#supports). Feel free to open a pull request there and I will be happy to bump the dependency.
