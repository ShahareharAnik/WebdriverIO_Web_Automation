import dotenv from 'dotenv';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { sendTestReport } from '@src/utils/emailUtil';
import fs from 'fs';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Define log file path
const LOG_FILE_PATH = path.resolve(__dirname, '../../test-results/spec-report.log');

// Ensure log directory exists
if (!fs.existsSync(path.dirname(LOG_FILE_PATH))) {
  fs.mkdirSync(path.dirname(LOG_FILE_PATH), { recursive: true });
}

// Writable stream for spec logs
const logStream = fs.createWriteStream(LOG_FILE_PATH, { flags: 'a' });

let passedTests: string[] = [];
let failedTests: string[] = [];

export const config: WebdriverIO.Config = {
  runner: 'local',
  specs: ['./test/specs/**/*.ts'],
  exclude: [],
  maxInstances: 10,

  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['--disable-gpu', '--window-size=1920,1080'],
    },
  }],

  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'mocha',

  reporters: [['spec', { outputStream: logStream }]],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  // Capture pass/fail tests
 


  onComplete: async function () {
    try {
      await new Promise<void>((resolve) => {
        logStream.on('finish', resolve);
        logStream.end();
      });

      let testReportPath = process.env.REPORTER === 'allure'
        ? path.resolve(__dirname, '../../allure-report/index.html')
        : LOG_FILE_PATH;

      if (process.env.EMAIL_REPORT === 'true') {
        console.log('Sending test report...');
        await sendTestReport(testReportPath, LOG_FILE_PATH);
      }
    } catch (error) {
      console.error('Error in onComplete:', error);
    }
  },
};
