import { chromium } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

async function run(): Promise<void> {
  const reportHtmlPath = path.join(__dirname, '..', 'reports', 'html', 'index.html');
  const pdfDir = path.join(__dirname, '..', 'reports', 'pdf');
  fs.mkdirSync(pdfDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const pdfPath = path.join(pdfDir, `report-${timestamp}.pdf`);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file://${reportHtmlPath}`);
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
  await browser.close();

  console.log(`PDF report generated at ${pdfPath}`);
}

run();
