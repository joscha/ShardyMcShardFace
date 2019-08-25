import { processStream } from '../cli';
import { CiParallelVarsMock } from '../../__mocks__/ci-parallel-vars';
import { stdio, MockWritable, MockReadable } from 'stdio-mock';
import { EOL } from 'os';
import { Readable, Writable } from 'stream';

describe('ShardyMcShardFace', () => {
    let ciParallelVarsMock: CiParallelVarsMock;
    let stdin: MockReadable;
    let stdout: MockWritable;
    beforeEach(() => {
        jest.mock('ci-parallel-vars');
        ciParallelVarsMock = require('ci-parallel-vars');
        const s = stdio();
        stdin = s.stdin;
        stdout = s.stdout;
    });

    it('works via CLI', done => {
        ciParallelVarsMock.__setIndex(1).__setTotal(2);
        processStream(
            'test.',
            (stdin as any) as Readable, // eslint-disable-line @typescript-eslint/no-explicit-any
            (stdout as any) as Writable, // eslint-disable-line @typescript-eslint/no-explicit-any
        );
        stdin.write(['a', 'b', 'c', '', ''].join(EOL));
        stdin.end();

        setTimeout(() => {
            expect(stdout.data()).toEqual([['c', 'b'].join(EOL)]);
            done();
        }, 0);
    });
});
