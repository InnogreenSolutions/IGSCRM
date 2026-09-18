import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const app = await readFile(new URL('../src/main.jsx', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const manifest = JSON.parse(await readFile(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8'));
const worker = await readFile(new URL('../public/sw.js', import.meta.url), 'utf8');
const htaccess = await readFile(new URL('../public/.htaccess', import.meta.url), 'utf8');

test('customer pipeline omits qualification and records closed revenue', () => {
  const pipeline = app.match(/const pipelineStages = \[(.*?)\];/s)?.[1] || '';
  assert.ok(!pipeline.includes('Qualification'));
  assert.ok(pipeline.includes('Closed Won'));
  assert.ok(app.includes('Final dollar amount'));
});

test('scheduled customers create contractor and equipment tasks', () => {
  assert.ok(app.includes('Confirm contractor for'));
  assert.ok(app.includes('Order equipment for'));
});

test('owner task list and reference-only pricing are present', () => {
  assert.ok(app.includes('Priority customer follow-up'));
  assert.ok(app.includes('Write email to EnviroCentre about EAP'));
  assert.ok(app.includes('REFERENCE ONLY'));
});

test('documents, useful links and quotation launcher are present', () => {
  assert.ok(app.includes('Documents & Templates'));
  assert.ok(app.includes('EAP Application'));
  assert.ok(app.includes('https://www.innogreensolutions.com/quotations'));
});

test('production build fails closed behind private entry', () => {
  assert.ok(app.includes('const localPreview = import.meta.env.DEV'));
  assert.ok(app.includes('<OwnerLogin />'));
  assert.ok(app.includes('Homebase is private.'));
  assert.ok(!app.includes('Helen Slingsby'));
  assert.ok(!app.includes('Rinkee Ahmed'));
  assert.ok(!app.includes('Pali Singh'));
  assert.ok(html.includes('noindex, nofollow, noarchive, nosnippet'));
});

test('agent workspaces exist for Max, Hassan and Aun', () => {
  assert.match(app, /max:.*Field Advisor/);
  assert.match(app, /hassan:.*Field Sales Advisor/);
  assert.match(app, /aun:.*Independent Sales Partner/);
  assert.ok(app.includes('Sales learning hub'));
  assert.ok(app.includes('Office requests'));
});

test('desktop PWA and modular cockpit are configured', () => {
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.name, 'Innogreen Operating System');
  assert.ok(html.includes('manifest.webmanifest'));
  assert.ok(app.includes('beforeinstallprompt'));
  assert.ok(app.includes('Cockpit & Integrations'));
  assert.ok(app.includes('QuickBooks'));
  assert.ok(app.includes('Financeit'));
  assert.ok(worker.includes("url.pathname.startsWith('/api/')"));
  assert.ok(htaccess.includes('Options -Indexes'));
  assert.ok(htaccess.includes('Content-Security-Policy'));
  assert.ok(htaccess.includes('RewriteRule . /index.html'));
});
