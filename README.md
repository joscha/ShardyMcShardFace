# ShardyMcShardFace

Package to shard a set of items based on CI parallelization parameters, e.g. `YOUR_CI_SYSTEM_INDEX` and `YOUR_CI_SYSTEM_COUNT`.

## Features:

-   Shards as evenly as possible, uneven splits will end up in the tail shards
-   Supports sharding less items than parallelization count; tail shards will be empty
-   Distributes items into shards based on a given seed for a random number generator to provide random, but stable distribution.
-   Fully typed in Typescript

## CI system support

CI systems supported are the ones supported by [ci-parallel-vars](https://github.com/jamiebuilds/ci-parallel-vars#supports). Feel free to open a pull request there and I will be happy to bump the dependency.
