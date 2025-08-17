const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const API = process.env.VITE_API_URL;
const { default: axios } = require('axios');

const outputDir = path.join(__dirname, 'output');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const executeCode = async (filepath, input = '', language = 'cpp') => {
    const problemid = path.basename(filepath).split(".")[0];
    const inputfile = path.join(outputDir, `${problemid}.txt`); // Input file path
    const outputfile = path.join(outputDir, `${problemid}.out`); // Output file path

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
        case 'java': {
            const dir = path.dirname(filepath);
            const inputFile = inputfile; // your existing input file variable
            const fixedFileName = 'Solution.java';
            const fixedFilePath = path.join(dir, fixedFileName);

            // Copy original Java file to fixed filename Solution.java
            if (filepath !== fixedFilePath) {
                fs.copyFileSync(filepath, fixedFilePath);
            }

            // Compile and run Solution.java (public class must be Solution)
            command = `javac ${fixedFilePath} && java -cp ${dir} Solution < ${inputFile}`;
            break;
        }
        default:
            throw new Error('Unsupported language');
    }

    return new Promise((resolve, reject) => {
        exec(command, {
            timeout: 5000,
            maxBuffer: 1024 * 1024 * 128 // 128MB memory limit
        }, (error, stdout, stderr) => {
            if (error) {
                // Check for different error types
                if (error.killed && error.signal === 'SIGTERM') {
                    return reject({ error: 'Time Limit Exceeded', stderr: 'Process terminated due to timeout' });
                }
                if (error.code === 'ENOBUFS' || stderr.includes('Cannot allocate memory')) {
                    return reject({ error: 'Memory Limit Exceeded', stderr: 'Process exceeded memory limit' });
                }
                if (stderr.includes('error:') || stderr.includes('Error:') || stderr.includes('compilation')) {
                    return reject({ error: 'Compilation Error', stderr });
                }
                return reject({ error: 'Runtime Error', stderr });
            }
            if (stderr) {
                // Check stderr for compilation errors
                if (stderr.includes('error:') || stderr.includes('Error:') || stderr.includes('compilation')) {
                    return reject({ error: 'Compilation Error', stderr });
                }
                return reject({ error: 'Runtime Error', stderr });
            }
            resolve(stdout);
        });
    });
};

const submitCode = async (id, filepath, language = 'cpp') => {
    try {
        const res = await axios.get(`${API}/api/problems/getProblemById/${id}`);
        const problem = res.data;
        if (!problem) {
            return {
                verdict: 'ERROR',
                message: 'Problem not found',
                testResults: []
            };
        }

        const testResults = [];
        let passedTests = 0;
        let totalTests = problem.testcases.length;

        // Test against all test cases
        for (let i = 0; i < problem.testcases.length; i++) {
            const testCase = problem.testcases[i];
            
            try {
                // Execute code with test case input
                const actualOutput = (await executeCode(filepath, testCase.input, language)).trim();
                const expectedOutput = testCase.output.trim();
                
                // Debug logging
                console.log(`Test Case ${i + 1}:`);
                console.log(`Input: "${testCase.input}"`);
                console.log(`Expected: "${expectedOutput}"`);
                console.log(`Actual: "${actualOutput}"`);
                console.log(`Match: ${actualOutput === expectedOutput}`);
                
                // Compare outputs
                const isCorrect = actualOutput === expectedOutput;
                
                if (isCorrect) {
                    passedTests++;
                }

                testResults.push({
                    testCase: i + 1,
                    input: testCase.input,
                    expectedOutput: expectedOutput,
                    actualOutput: actualOutput,
                    status: isCorrect ? 'PASSED' : 'FAILED',
                    verdict: isCorrect ? 'Accepted' : 'Wrong Answer'
                });

            } catch (error) {
                let verdict = 'Runtime Error';
                let message = error.error || error.stderr || 'Unknown error';

                // Enhanced error detection
                if (error.error === 'Time Limit Exceeded' || 
                    message.includes('Time Limit Exceeded') || 
                    message.includes('timed out') ||
                    message.includes('timeout') ||
                    message.includes('SIGTERM')) {
                    verdict = 'Time Limit Exceeded';
                    message = 'Your program exceeded the 5 second time limit';
                } else if (error.error === 'Memory Limit Exceeded' || 
                          message.includes('Memory Limit Exceeded') ||
                          message.includes('Cannot allocate memory') ||
                          message.includes('ENOBUFS') ||
                          message.includes('out of memory')) {
                    verdict = 'Memory Limit Exceeded';
                    message = 'Your program exceeded the memory limit';
                } else if (error.error === 'Compilation Error' ||
                          message.includes('Compilation Error') ||
                          message.includes('error:') ||
                          message.includes('Error:') ||
                          message.includes('compilation') ||
                          message.includes('undefined reference') ||
                          message.includes('undeclared') ||
                          message.includes('syntax error')) {
                    verdict = 'Compilation Error';
                    message = 'Your code has compilation errors';
                } else if (message.includes('Segmentation fault') || 
                          message.includes('segfault') ||
                          message.includes('SIGSEGV')) {
                    verdict = 'Runtime Error (Segmentation Fault)';
                    message = 'Your program caused a segmentation fault';
                } else if (message.includes('floating point exception') ||
                          message.includes('SIGFPE')) {
                    verdict = 'Runtime Error (Division by Zero)';
                    message = 'Your program caused a floating point exception';
                } else if (message.includes('abort') ||
                          message.includes('SIGABRT')) {
                    verdict = 'Runtime Error (Abort)';
                    message = 'Your program was aborted';
                }

                testResults.push({
                    testCase: i + 1,
                    input: testCase.input,
                    expectedOutput: testCase.output.trim(),
                    actualOutput: '',
                    status: 'ERROR',
                    verdict: verdict,
                    error: message
                });

                // Stop execution on first error (optional - you can continue if needed)
                break;
            }
        }

        // Determine overall verdict
        let overallVerdict;
        let message;

        if (passedTests === totalTests) {
            overallVerdict = 'ACCEPTED';
            message = `All ${totalTests} test cases passed!`;
        } else if (passedTests === 0) {
            overallVerdict = testResults[0]?.verdict || 'WRONG ANSWER';
            message = `No test cases passed. ${testResults?.error || ''}`;
        } else {
            overallVerdict = 'PARTIAL';
            message = `${passedTests}/${totalTests} test cases passed`;
        }

        return {
            verdict: overallVerdict,
            message: message,
            passedTests: passedTests,
            totalTests: totalTests,
            testResults: testResults,
            score: Math.round((passedTests / totalTests) * 100)
        };

    } catch (error) {
        console.error("Submission error:", error);
        return {
            verdict: 'ERROR',
            message: `System error: ${error.message}`,
            testResults: []
        };
    }
};

module.exports = { executeCode, submitCode };
