import { test, mock } from 'node:test';
import assert from 'node:assert';

// 1. Mock dependencies before importing the module under test
const serviceMock = mock.fn(async (config) => ({ success: true, ...config }));

mock.module('./index.js', {
  defaultExport: serviceMock,
  namedExports: {
    requestWithRetry: async (fn) => await fn()
  }
});

// 2. Import the functions to test
const { generateOntology, buildGraph, getTaskStatus, getGraphData, getProject } = await import('./graph.js');

test('generateOntology should call service with correct config and multipart/form-data header', async () => {
  const formData = { some: 'form-data' };
  await generateOntology(formData);

  assert.strictEqual(serviceMock.mock.calls.length, 1);
  const config = serviceMock.mock.calls[0].arguments[0];

  assert.strictEqual(config.url, '/api/graph/ontology/generate');
  assert.strictEqual(config.method, 'post');
  assert.strictEqual(config.headers['Content-Type'], 'multipart/form-data');
  assert.strictEqual(config.data, formData);

  serviceMock.mock.resetCalls();
});

test('buildGraph should call service with correct config', async () => {
  const data = { project_id: '123', graph_name: 'test-graph' };
  await buildGraph(data);

  assert.strictEqual(serviceMock.mock.calls.length, 1);
  const config = serviceMock.mock.calls[0].arguments[0];

  assert.strictEqual(config.url, '/api/graph/build');
  assert.strictEqual(config.method, 'post');
  assert.deepStrictEqual(config.data, data);

  serviceMock.mock.resetCalls();
});

test('getTaskStatus should call service with correct taskId', async () => {
  const taskId = 'task-456';
  await getTaskStatus(taskId);

  assert.strictEqual(serviceMock.mock.calls.length, 1);
  const config = serviceMock.mock.calls[0].arguments[0];

  assert.strictEqual(config.url, '/api/graph/task/task-456');
  assert.strictEqual(config.method, 'get');

  serviceMock.mock.resetCalls();
});

test('getGraphData should call service with correct graphId', async () => {
  const graphId = 'graph-789';
  await getGraphData(graphId);

  assert.strictEqual(serviceMock.mock.calls.length, 1);
  const config = serviceMock.mock.calls[0].arguments[0];

  assert.strictEqual(config.url, '/api/graph/data/graph-789');
  assert.strictEqual(config.method, 'get');

  serviceMock.mock.resetCalls();
});

test('getProject should call service with correct projectId', async () => {
  const projectId = 'proj-abc';
  await getProject(projectId);

  assert.strictEqual(serviceMock.mock.calls.length, 1);
  const config = serviceMock.mock.calls[0].arguments[0];

  assert.strictEqual(config.url, '/api/graph/project/proj-abc');
  assert.strictEqual(config.method, 'get');

  serviceMock.mock.resetCalls();
});
