import type { APIContext } from 'astro';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET, POST } from '../../pages/api/ping';

describe('/api/ping - GET Handler', () => {
  let mockRequest: Request;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));

    mockRequest = new Request('https://example.com/api/ping', {
      method: 'GET'
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Response Status', () => {
    it('returns 200 status code', async () => {
      const response = await GET({ request: mockRequest } as APIContext);

      expect(response.status).toBe(200);
    });
  });

  describe('Response Body', () => {
    it('returns correct JSON structure', async () => {
      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data).toEqual({
        message: 'pong',
        timestamp: '2025-01-15T12:00:00.000Z',
        url: 'https://example.com/api/ping',
        status: 'ok'
      });
    });

    it('includes message field with "pong" value', async () => {
      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.message).toBe('pong');
    });

    it('includes status field with "ok" value', async () => {
      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.status).toBe('ok');
    });

    it('includes timestamp in ISO 8601 format', async () => {
      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.timestamp).toBe('2025-01-15T12:00:00.000Z');
      expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
    });

    it('includes url from request', async () => {
      const customRequest = new Request('https://portfolio.example.com/api/ping?test=1', {
        method: 'GET'
      });

      const response = await GET({ request: customRequest } as APIContext);
      const data = await response.json();

      expect(data.url).toBe('https://portfolio.example.com/api/ping?test=1');
    });
  });

  describe('Response Headers', () => {
    it('sets Content-Type header to application/json', async () => {
      const response = await GET({ request: mockRequest } as APIContext);

      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('sets CORS header to allow all origins', async () => {
      const response = await GET({ request: mockRequest } as APIContext);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });
  });
});

describe('/api/ping - POST Handler', () => {
  let mockRequest: Request;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Response Status', () => {
    it('returns 200 status code', async () => {
      mockRequest = new Request('https://example.com/api/ping', {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST({ request: mockRequest } as APIContext);

      expect(response.status).toBe(200);
    });
  });

  describe('Request Body Handling', () => {
    it('echoes request body in response', async () => {
      const requestBody = { user: 'test', action: 'ping' };

      mockRequest = new Request('https://example.com/api/ping', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.body).toEqual(requestBody);
    });

    it('includes method field with "POST" value', async () => {
      mockRequest = new Request('https://example.com/api/ping', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.method).toBe('POST');
    });

    it('handles malformed JSON gracefully', async () => {
      mockRequest = new Request('https://example.com/api/ping', {
        method: 'POST',
        body: 'not valid json',
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.body).toEqual({});
    });

    it('handles empty request body', async () => {
      mockRequest = new Request('https://example.com/api/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.body).toEqual({});
    });
  });

  describe('Response Body Structure', () => {
    it('returns correct JSON structure', async () => {
      const requestBody = { test: 'value' };

      mockRequest = new Request('https://example.com/api/ping', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data).toEqual({
        message: 'pong',
        timestamp: '2025-01-15T12:00:00.000Z',
        url: 'https://example.com/api/ping',
        method: 'POST',
        body: requestBody,
        status: 'ok'
      });
    });

    it('includes timestamp in ISO 8601 format', async () => {
      mockRequest = new Request('https://example.com/api/ping', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.timestamp).toBe('2025-01-15T12:00:00.000Z');
      expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
    });
  });

  describe('Response Headers', () => {
    it('sets Content-Type header to application/json', async () => {
      mockRequest = new Request('https://example.com/api/ping', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST({ request: mockRequest } as APIContext);

      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('sets CORS header to allow all origins', async () => {
      mockRequest = new Request('https://example.com/api/ping', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST({ request: mockRequest } as APIContext);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });
  });

  describe('Edge Cases', () => {
    it('handles complex nested JSON objects', async () => {
      const complexBody = {
        user: {
          id: 123,
          profile: { name: 'Test', settings: { theme: 'dark' } }
        },
        actions: ['read', 'write']
      };

      mockRequest = new Request('https://example.com/api/ping', {
        method: 'POST',
        body: JSON.stringify(complexBody),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.body).toEqual(complexBody);
    });

    it('handles large payload', async () => {
      const largeBody = { data: 'x'.repeat(10000) };

      mockRequest = new Request('https://example.com/api/ping', {
        method: 'POST',
        body: JSON.stringify(largeBody),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.body).toEqual(largeBody);
    });
  });
});
