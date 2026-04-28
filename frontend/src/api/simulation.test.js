import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert';

// 1. Mock dependencies before importing the module under test
const serviceMock = {
  get: mock.fn(async (url, config) => ({ success: true, url, ...config })),
  post: mock.fn(async (url, data, config) => ({ success: true, url, data, ...config })),
};

const requestWithRetryMock = mock.fn(async (fn, retries, delay) => {
  return await fn();
});

mock.module('./index.js', {
  defaultExport: serviceMock,
  namedExports: {
    requestWithRetry: requestWithRetryMock
  }
});

// 2. Import the functions to test
const {
  getSimulation,
  createSimulation,
  listSimulations,
  getSimulationProfiles
} = await import('./simulation.js');

afterEach(() => {
  serviceMock.get.mock.resetCalls();
  serviceMock.post.mock.resetCalls();
  requestWithRetryMock.mock.resetCalls();
});

test('getSimulation should call service.get with correct URL', async () => {
  const simulationId = 'sim-123';
  await getSimulation(simulationId);

  assert.strictEqual(serviceMock.get.mock.calls.length, 1);
  const args = serviceMock.get.mock.calls[0].arguments;
  assert.strictEqual(args[0], `/api/simulation/${simulationId}`);
});

test('getSimulation handles API error', async () => {
  const simulationId = 'sim-error';
  serviceMock.get.mock.mockImplementationOnce(async () => {
    throw new Error('API Error');
  });

  await assert.rejects(getSimulation(simulationId), {
    message: 'API Error'
  });
});

test('createSimulation should call requestWithRetry with correct parameters', async () => {
  const data = { project_id: 'proj-1' };
  await createSimulation(data);

  assert.strictEqual(requestWithRetryMock.mock.calls.length, 1);
  const args = requestWithRetryMock.mock.calls[0].arguments;
  assert.strictEqual(typeof args[0], 'function');
  assert.strictEqual(args[1], 3); // maxRetries
  assert.strictEqual(args[2], 1000); // delay

  // Verify the function passed to requestWithRetry calls the right service method
  // Note: createSimulation already calls the function once via our requestWithRetryMock
  assert.strictEqual(serviceMock.post.mock.calls.length, 1);
  assert.strictEqual(serviceMock.post.mock.calls[0].arguments[0], '/api/simulation/create');
  assert.deepStrictEqual(serviceMock.post.mock.calls[0].arguments[1], data);
});

test('listSimulations should call service.get with correct URL and optional project_id', async () => {
  // Without projectId
  await listSimulations();
  assert.strictEqual(serviceMock.get.mock.calls.length, 1);
  assert.strictEqual(serviceMock.get.mock.calls[0].arguments[0], '/api/simulation/list');
  assert.deepStrictEqual(serviceMock.get.mock.calls[0].arguments[1].params, {});

  serviceMock.get.mock.resetCalls();

  // With projectId
  const projectId = 'proj-abc';
  await listSimulations(projectId);
  assert.strictEqual(serviceMock.get.mock.calls.length, 1);
  assert.strictEqual(serviceMock.get.mock.calls[0].arguments[0], '/api/simulation/list');
  assert.deepStrictEqual(serviceMock.get.mock.calls[0].arguments[1].params, { project_id: projectId });
});

test('getSimulationProfiles should call service.get with default and custom platform', async () => {
  const simulationId = 'sim-456';

  // Default platform
  await getSimulationProfiles(simulationId);
  assert.strictEqual(serviceMock.get.mock.calls.length, 1);
  assert.strictEqual(serviceMock.get.mock.calls[0].arguments[0], `/api/simulation/${simulationId}/profiles`);
  assert.deepStrictEqual(serviceMock.get.mock.calls[0].arguments[1].params, { platform: 'reddit' });

  serviceMock.get.mock.resetCalls();

  // Custom platform
  await getSimulationProfiles(simulationId, 'twitter');
  assert.strictEqual(serviceMock.get.mock.calls.length, 1);
  assert.strictEqual(serviceMock.get.mock.calls[0].arguments[0], `/api/simulation/${simulationId}/profiles`);
  assert.deepStrictEqual(serviceMock.get.mock.calls[0].arguments[1].params, { platform: 'twitter' });
});
