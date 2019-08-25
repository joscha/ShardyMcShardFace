import yargs from 'yargs';
import { EOL } from 'os';
import { shard, logger, defaultSeed } from './';
import { Readable, Writable } from 'stream';

const info = logger.extend('info');

export function processStream(
    seed: string | undefined,
    rs: Readable = process.stdin,
    ws: Writable = process.stdout,
): void {
    rs.setEncoding('utf8');

    let things = '';
    rs.on('readable', () => {
        const chunk = rs.read();
        if (chunk !== null) {
            things += chunk;
        }
    });

    rs.on('end', () => {
        const lines = things.trim().split(EOL);
        ws.write(shard(lines, seed).join(EOL));
    });
}

export function main(): void {
    yargs
        .command(
            'shard [-s <seed>]',
            'Shard some items passed via stdin',
            yargs => {
                return yargs;
            },
            argv => {
                if (argv.seed) {
                    info('Using seed: %s', argv.seed);
                }
                processStream(argv.seed as any); // eslint-disable-line @typescript-eslint/no-explicit-any
            },
        )
        .option('seed', {
            alias: 's',
            default: defaultSeed,
        })
        .example('cat x | $0 shard', 'shard the items in x')
        .help('h')
        .alias('h', 'help')
        .parse();
}
