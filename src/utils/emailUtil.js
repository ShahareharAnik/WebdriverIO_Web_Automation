import nodemailer from 'nodemailer';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

function validateEnvVariables() {
  const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'TO_EMAIL'];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}

export async function sendTestReport(reportPath, logFilePath) {
  validateEnvVariables();

  // Read Spec Reporter Log File
  let logContent = '';
  if (fs.existsSync(logFilePath)) {
    logContent = fs.readFileSync(logFilePath, 'utf-8');
  }

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: `"WebdriverIO Test Results" <${process.env.SMTP_USER}>`,
    to: process.env.TO_EMAIL,
    subject: 'WebdriverIO Test Execution Report',
    html: `
      <h1>Test Execution Report</h1>
      <div style="font-family: monospace; white-space: pre; background: #f5f5f5; padding: 10px; border-radius: 5px;">
        ${logContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
      </div>
    `, // Ensure HTML-safe log content
    attachments: [{
      filename: 'TestReport.html',
      path: reportPath,
    }],
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}