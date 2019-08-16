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
        beforeEach(() => {
            jest.mock('ci-parallel-vars');
            ciParallelVarsMock = require('ci-parallel-vars');
        });

        it('shards evenly', () => {
            ciParallelVarsMock.__setIndex(0).__setTotal(2);
            expect(shard([1, 2, 3, 4], 'test.')).toEqual([4, 1]);
            ciParallelVarsMock.__setIndex(1).__setTotal(2);
            expect(shard([1, 2, 3, 4], 'test.')).toEqual([3, 2]);
        });

        it('shards as evenly as possible', () => {
            ciParallelVarsMock.__setIndex(1).__setTotal(2);
            expect(shard([1, 2, 3], 'test.')).toEqual([3, 2]);
            ciParallelVarsMock.__setIndex(0).__setTotal(2);
            expect(shard([1, 2, 3], 'test.')).toEqual([1]);
        });
    });
});
