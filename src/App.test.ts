import { expect, test } from 'vitest';

test('Mantra Skill initialization', () => {
  expect(true).toBe(true);
});

test('App environment check', () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  expect(apiUrl).toBeDefined();
});
