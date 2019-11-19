import { shard } from '../';

describe('ShardyMcShardFace', () => {
    beforeAll(() => {
        // We still need this because cli uses the package to get concurrency from the
        // env and because of the global import we need to unmock it explicitly.
        jest.unmock('ci-parallel-vars');
    });

    it('throws when empty', () => {
        expect(() => shard([])).toThrow(/Nothing to shard/);
    });

    it('does not throw when empty if throwing has been disabled', () => {
        const arr: string[] = [];
        expect(shard(arr, { throwOnEmpty: false })).toBe(arr);
    });

    it('throws when not in CI context', () => {
        expect(() => shard([1, 2, 3])).toThrow(
            /Not running in a CI sharding context/,
        );
    });

    it('does not throw when throwing has been disabled', () => {
        const arr = [1, 2, 3];
        expect(shard(arr, { throwWhenNotSharding: false })).toBe(arr);
    });

    describe('functionality', () => {
        function shards<T>(
            things: T[],
            total: number,
            seed = 'test.',
        ): (readonly T[])[] {
            const ret = [];
            for (let i = 0; i < total; i++) {
                ret.push(
                    shard(things, { seed, concurrency: { index: i, total } }),
                );
            }
            return ret;
        }

        it('shards evenly', () => {
            expect(shards([1, 2, 3, 4], 2)).toEqual([[4, 1], [3, 2]]);
        });

        it('shards as evenly as possible; leftovers in the tail shard', () => {
            expect(shards([1, 2, 3], 2)).toEqual([[1], [3, 2]]);
        });

        it('tail shards empty when there are more slices than items', () => {
            expect(shards([1, 2, 3], 4)).toEqual([[1], [3], [2], []]);
        });

        it('seed drives shard allocation', () => {
            expect(shards([1, 2], 2)).toEqual([[2], [1]]);
            expect(shards([1, 2], 2, 'other.')).toEqual([[1], [2]]);
        });
    });
});
