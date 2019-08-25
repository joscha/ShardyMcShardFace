import shuffle = require('shuffle-array');
import { alea } from 'seedrandom';
import createDebug from 'debug';

export const logger = createDebug('ShardyMcShardFace');
const debug = logger.extend('debug');

export class NotRunningInShardingContextError extends Error {}

export class NothingToShardError extends Error {}

export const defaultSeed = 'ShardyMcShardFace.';

export function shard<T>(
    things: readonly T[],
    seed = defaultSeed,
): readonly T[] {
    const allThings = things.length;
    debug('total items: %d', allThings);
    if (allThings === 0) {
        throw new NothingToShardError('Nothing to shard');
    }
    // we don't import this one, because it statically exposes the vars
    // and we need to be able to mock them for tests
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ciParallelVars = require('ci-parallel-vars');
    if (!ciParallelVars) {
        throw new NotRunningInShardingContextError(
            'Not running in a CI sharding context',
        );
    }
    const { index: currentSlice, total: slices } = ciParallelVars;
    debug('current slice: %d of %d', currentSlice + 1, slices);

    // TODO: we don't need to shuffle the whole array in order to chunk it,
    // theoretically we can just pick length/total items based on index from
    // the array
    const shuffled = shuffle([...things], {
        rng: alea(seed),
    });

    const itemsPerSlice = Math.floor(allThings / slices) || 1;
    const start = currentSlice * itemsPerSlice;
    const isLastSlice = currentSlice === slices - 1;
    const end = start + itemsPerSlice + (isLastSlice ? allThings % slices : 0);
    const slice = shuffled.slice(start, end);
    debug('%d item(s) in this slice: %O', end - start, slice);
    return slice;
}
