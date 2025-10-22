// check_page.js - headless check using Puppeteer
// Captura console messages, page errors y solicitudes fallidas al cargar la app local.

import puppeteer from 'puppeteer';

const url = process.argv[2] || 'http://127.0.0.1:62146/';
(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();

  const consoleMessages = [];
  const pageErrors = [];
  const failedRequests = [];

  page.on('console', msg => {
    consoleMessages.push({type: msg.type(), text: msg.text()});
  });
  page.on('pageerror', err => {
    pageErrors.push(String(err));
  });
  page.on('requestfailed', req => {
    failedRequests.push({url: req.url(), failureText: req.failure().errorText});
  });

  console.log('Navigating to', url);
  const response = await page.goto(url, {waitUntil: 'networkidle2', timeout: 30000}).catch(e => {console.error('Navigation failed:', String(e));});
  if (response) console.log('Main response status:', response.status());

  // Wait a bit for any async module loads (compatibilidad con versiones de Puppeteer)
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('\n--- Console messages ---');
  consoleMessages.forEach(m => console.log(`[${m.type}] ${m.text}`));

  console.log('\n--- Page errors ---');
  pageErrors.forEach(e => console.log(e));

  console.log('\n--- Failed requests ---');
  failedRequests.forEach(r => console.log(`${r.url} -> ${r.failureText}`));

  const hasProblems = pageErrors.length || failedRequests.length || consoleMessages.some(m => m.type === 'error');
  console.log('\nSummary:');
  if (!hasProblems) console.log('No runtime errors detected.');
  else console.log('Runtime issues detected (see above).');

  await browser.close();
})();
