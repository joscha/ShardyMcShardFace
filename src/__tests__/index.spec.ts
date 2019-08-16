import { shard } from '../';
import { CiParallelVarsMock } from '../../__mocks__/ci-parallel-vars';

describe('ShardyMcShardFace', () => {
    it('throws when empty', () => {
        jest.unmock('ci-parallel-vars');
        expect(() => shard([])).toThrow(/Nothing to shard/);
    });

    it('throws when not in CI context', () => {
        jest.unmock('ci-parallel-vars');
        expect(() => shard([1, 2, 3])).toThrow(
            /Not running in a CI sharding context/,
        );
    });

    describe('functionality', () => {
        let ciParallelVarsMock: CiParallelVarsMock;

        function shards<T>(
            things: T[],
            total: number,
            seed = 'test.',
        ): (readonly T[])[] {
            const ret = [];
            for (let i = 0; i < total; i++) {
                ciParallelVarsMock.__setIndex(i).__setTotal(total);
                ret.push(shard(things, seed));
            }
            return ret;
        }
        beforeEach(() => {
            jest.mock('ci-parallel-vars');
            ciParallelVarsMock = require('ci-parallel-vars');
        });

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
