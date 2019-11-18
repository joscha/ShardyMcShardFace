import shuffle = require('shuffle-array');
import { alea } from 'seedrandom';
import createDebug from 'debug';

export const logger = createDebug('ShardyMcShardFace');
const debug = logger.extend('debug');
const info = logger.extend('info');

export class NotRunningInShardingContextError extends Error {}

export class NothingToShardError extends Error {}

export const defaultSeed = 'ShardyMcShardFace.';

type Options = {
    /**
     * The seed to use for shuffling the passed array; defaults to 'ShardyMcShardFace.'
     */
    seed?: string;
    /**
     * Throws when the passed array is empty; defaults to true
     * If set to false, the sharding function will return identity for the passed array
     */
    throwOnEmpty?: boolean;
    /**
     * Throws when CI and sharding can't be detected; defaults to true
     * If set to false, the sharding function will return identity for the passed array
     */
    throwWhenNotSharding?: boolean;

    /**
     * The concurrency object.
     */
    concurrency?: {
        index: number;
        total: number;
    };
};

export function shard<T>(
    things: readonly T[],
    opts: Options = {},
): readonly T[] {
    const defaultOptions = {
        seed: defaultSeed,
        throwOnEmpty: true,
        throwWhenNotSharding: true,
        // we don't import this one, because it statically exposes the vars
        // and we need to be able to mock them for tests
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        concurrency: require('ci-parallel-vars'),
    };

    const options = { ...defaultOptions, ...opts };

    const allThings = things.length;
    info('total items: %d', allThings);
    if (allThings === 0) {
        if (options.throwOnEmpty) {
            throw new NothingToShardError('Nothing to shard');
        } else {
            return things;
        }
    }

    if (!options.concurrency) {
        if (options.throwWhenNotSharding) {
            throw new NotRunningInShardingContextError(
                'Not running in a CI sharding context',
            );
        } else {
            return things;
        }
    }
    const { index: currentSlice, total: slices } = options.concurrency;
    info('current slice: %d of %d', currentSlice + 1, slices);

    // TODO: we don't need to shuffle the whole array in order to chunk it,
    // theoretically we can just pick length/total items based on index from
    // the array
    const shuffled = shuffle([...things], {
        rng: alea(options.seed),
    });

    const itemsPerSlice = Math.floor(allThings / slices) || 1;
    const start = currentSlice * itemsPerSlice;
    const isLastSlice = currentSlice === slices - 1;
    const end = start + itemsPerSlice + (isLastSlice ? allThings % slices : 0);
    const slice = shuffled.slice(start, end);
    info('%d item(s) in this slice', end - start);
    debug('items in this slice: %O', slice);
    return slice;
}
