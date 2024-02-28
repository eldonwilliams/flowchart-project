import yargs from 'yargs';
import { PathLike, readdir, writeFileSync, } from 'fs';
import path from 'path';

let verboseLog = (message: string) => {
    // @ts-ignore
    if (this.v) {
        console.log(message);
    }
}

yargs
    .scriptName('transformer')
    .usage('$0 <cmd> [args]')
    .option('D', {
        describe: 'delete the input file after processing',
        type: 'boolean',
        default: false
    })
    .option('v', {
        describe: 'verbose',
        type: 'boolean',
        default: false
    })
    .command('grade', false, (yargs) => {
        yargs
            .positional('input', {
                describe: 'input folder, file input is not supported',
                type: 'string',
                default: '/input'
            })
            .positional('output', {
                describe: 'output file or folder',
                type: 'string',
                default: 'output.json'
            })
            .positional('template', {
                describe: 'template file',
                type: 'string',
                default: 'template.dat'
            
            })
    }, (argv) => {
        verboseLog = verboseLog.bind(argv);
        verboseLog(`Processing ${argv.input} to ${argv.output}...`);
        verboseLog(`Template file is ${argv.template}`)
        if (argv.D) {
            verboseLog(`Deleting ${argv.input} after processing...`);
        }

        let output: { [key: string]: string, } = {};

        readdir(argv.input as PathLike, (err, files) => {
            if (err) {
                console.log('Error reading input folder', err);
                return;
            }

            console.log(`Found ${files.length} files in ${argv.input}`);

            files.forEach(file => {
                verboseLog(`Processing ${file}...`);
                // TODO: Actually process file
                let grade = (Math.random() * 100).toFixed(2);
                output[file] = grade;
                verboseLog(`Grade for ${file} is ${grade}`);
            });
        });

        // If we split by all the .s, we can get the extension.
        // If there is no extension, the last element (pop), will include a / from the file system path.
        // Does not handle the case such that "output" is the 
        if ((argv.output as string).split('.').pop()?.includes('/')) {
            verboseLog('Output is a file');
            console.log('Writing each file...');

            writeFileSync(argv.output as string, JSON.stringify(output));

            verboseLog('Wrote output');
        } else {
            verboseLog('Output is a folder');
            console.log('Writing to folder...');
            for (let file in output) {
                verboseLog(`Writing ${file} to ${argv.output}/${file}`);
                writeFileSync(path.join(argv.output as string, file), output[file]);
            }
        }
    })
    .help()
    .argv;