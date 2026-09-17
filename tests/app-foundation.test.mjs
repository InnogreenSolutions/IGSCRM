import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const app = await readFile(new URL('../src/main.jsx', import.meta.url), 'utf8');

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
  assert.ok(app.includes('Helen Slingsby follow-up'));
  assert.ok(app.includes('Write email to EnviroCentre about EAP'));
  assert.ok(app.includes('REFERENCE ONLY'));
});

test('documents, useful links and quotation launcher are present', () => {
  assert.ok(app.includes('Documents & Templates'));
  assert.ok(app.includes('EAP Application'));
  assert.ok(app.includes('https://www.innogreensolutions.com/quotations'));
});
