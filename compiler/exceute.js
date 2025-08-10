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
        case 'java':
            const dir = path.dirname(filepath);
            const filename = path.basename(filepath, '.java');
            command = `javac ${filepath} && java -cp ${dir} ${filename} < ${inputfile}`;
            break;
        default:
            throw new Error('Unsupported language');
    }

    return new Promise((resolve, reject) => {
        exec(command,{timeout: 5000},(error, stdout, stderr) => {
            if (error) return reject({ error, stderr });
            if (stderr) return reject({ stderr });
            resolve(stdout);
        });
    });
};


const submitCode = async (id, filepath, language = 'cpp') => {
    try {
        const res = await axios.get(`${API}/api/problems/getProblemById/${id}`);
        console.log(res.data);
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

                // Determine specific error type
                if (message.includes('Time Limit Exceeded') || message.includes('timed out')) {
                    verdict = 'Time Limit Exceeded';
                } else if (message.includes('Compilation failed') || message.includes('error:')) {
                    verdict = 'Compilation Error';
                } else if (message.includes('Segmentation fault') || message.includes('segfault')) {
                    verdict = 'Runtime Error (Segmentation Fault)';
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
            message = `No test cases passed. ${testResults[0]?.error || ''}`;
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