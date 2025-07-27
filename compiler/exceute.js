const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'output');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const executeCode = async (filepath, input = '', language = 'cpp') => {
    const problemid = path.basename(filepath).split(".")[0];
    const inputfile = path.join(outputDir, `${problemid}.txt`);
    const outputfile = path.join(outputDir, `${problemid}.out`);

    // Save input to a file
    fs.writeFileSync(inputfile, input);

    let command;

    switch (language) {
        case 'cpp':
            command = `g++ ${filepath} -o ${outputfile} && ${outputfile} < ${inputfile}`;
            break;
        case 'python':
            command = `python3 ${filepath} < ${inputfile}`;
            break;
        case 'java':
            const dir = path.dirname(filepath);
            const filename = path.basename(filepath, '.java');
            command = `javac ${filepath} && java -cp ${dir} ${filename} < ${inputfile}`;
            break;
        default:
            throw new Error('Unsupported language');
    }

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) return reject({ error, stderr });
            if (stderr) return reject({ stderr });
            resolve(stdout);
        });
    });
};

module.exports = { executeCode };