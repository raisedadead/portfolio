import type { APIContext } from 'astro';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../../pages/api/health';

describe('/api/health - GET Handler', () => {
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
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET'
      });

      const response = await GET({ request: mockRequest } as APIContext);

      expect(response.status).toBe(200);
    });

    it('returns status "healthy" in response body', async () => {
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET'
      });

      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.status).toBe('healthy');
    });
  });

  describe('Response Body Structure', () => {
    it('includes timestamp in ISO 8601 format', async () => {
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET'
      });

      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.timestamp).toBe('2025-01-15T12:00:00.000Z');
      expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
    });

    it('includes environment field with "cloudflare-workers" value', async () => {
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET'
      });

      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.environment).toBe('cloudflare-workers');
    });

    it('includes headers object with user-agent, cf-ray, and cf-connecting-ip', async () => {
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET'
      });

      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.headers).toHaveProperty('user-agent');
      expect(data.headers).toHaveProperty('cf-ray');
      expect(data.headers).toHaveProperty('cf-connecting-ip');
    });
  });

  describe('Request Header Handling', () => {
    it('reads user-agent header from request', async () => {
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET',
        headers: {
          'user-agent': 'Mozilla/5.0 (Test Browser)'
        }
      });

      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.headers['user-agent']).toBe('Mozilla/5.0 (Test Browser)');
    });

    it('reads cf-ray header from request', async () => {
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET',
        headers: {
          'cf-ray': '123456789abcdef-SJC'
        }
      });

      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.headers['cf-ray']).toBe('123456789abcdef-SJC');
    });

    it('reads cf-connecting-ip header from request', async () => {
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET',
        headers: {
          'cf-connecting-ip': '192.168.1.1'
        }
      });

      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.headers['cf-connecting-ip']).toBe('192.168.1.1');
    });

    it('defaults to "unknown" when user-agent header is missing', async () => {
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET'
      });

      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.headers['user-agent']).toBe('unknown');
    });

    it('defaults to "unknown" when cf-ray header is missing', async () => {
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET'
      });

      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.headers['cf-ray']).toBe('unknown');
    });

    it('defaults to "unknown" when cf-connecting-ip header is missing', async () => {
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET'
      });

      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.headers['cf-connecting-ip']).toBe('unknown');
    });
  });

  describe('Response Headers', () => {
    it('sets Content-Type header to application/json', async () => {
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET'
      });

      const response = await GET({ request: mockRequest } as APIContext);

      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('sets CORS header to allow all origins', async () => {
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET'
      });

      const response = await GET({ request: mockRequest } as APIContext);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('sets Cache-Control header to no-cache', async () => {
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET'
      });

      const response = await GET({ request: mockRequest } as APIContext);

      expect(response.headers.get('Cache-Control')).toBe('no-cache');
    });
  });

  describe('Cloudflare-Specific Headers', () => {
    it('handles all Cloudflare headers together', async () => {
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET',
        headers: {
          'user-agent': 'UptimeMonitor/1.0',
          'cf-ray': 'abc123-LAX',
          'cf-connecting-ip': '10.0.0.1'
        }
      });

      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.headers).toEqual({
        'user-agent': 'UptimeMonitor/1.0',
        'cf-ray': 'abc123-LAX',
        'cf-connecting-ip': '10.0.0.1'
      });
    });

    it('mixes present and missing Cloudflare headers', async () => {
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET',
        headers: {
          'cf-ray': 'xyz789-DFW'
        }
      });

      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data.headers).toEqual({
        'user-agent': 'unknown',
        'cf-ray': 'xyz789-DFW',
        'cf-connecting-ip': 'unknown'
      });
    });
  });

  describe('Complete Response Validation', () => {
    it('returns complete health check response with all fields', async () => {
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET',
        headers: {
          'user-agent': 'HealthChecker/2.0',
          'cf-ray': 'health123-NYC',
          'cf-connecting-ip': '203.0.113.42'
        }
      });

      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      expect(data).toEqual({
        status: 'healthy',
        timestamp: '2025-01-15T12:00:00.000Z',
        environment: 'cloudflare-workers',
        headers: {
          'user-agent': 'HealthChecker/2.0',
          'cf-ray': 'health123-NYC',
          'cf-connecting-ip': '203.0.113.42'
        }
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string user-agent', async () => {
      mockRequest = new Request('https://example.com/api/health', {
        method: 'GET',
        headers: {
          'user-agent': ''
        }
      });

      const response = await GET({ request: mockRequest } as APIContext);
      const data = await response.json();

      // Empty string is falsy, should default to 'unknown'
      expect(data.headers['user-agent']).toBe('unknown');
    });

    it('handles multiple health check requests', async () => {
      const request1 = new Request('https://example.com/api/health', { method: 'GET' });
      const request2 = new Request('https://example.com/api/health', { method: 'GET' });

      const response1 = await GET({ request: request1 } as APIContext);
      const response2 = await GET({ request: request2 } as APIContext);

      const data1 = await response1.json();
      const data2 = await response2.json();

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(data1.status).toBe('healthy');
      expect(data2.status).toBe('healthy');
    });
  });
});
