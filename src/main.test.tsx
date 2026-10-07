import { describe, it, expect, beforeEach, vi } from 'vitest';
import { api } from './api';

describe('ClientHub session behavior', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('starts signed out when no token exists', () => {
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('stores and clears the access token', () => {
    localStorage.setItem('accessToken', 'demo');
    expect(localStorage.getItem('accessToken')).toBe('demo');
    localStorage.removeItem('accessToken');
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('clears an expired session on a 401 response', async () => {
    localStorage.setItem('accessToken', 'expired');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 401 }));
    await expect(api('/tasks')).rejects.toThrow('Session expired');
    expect(localStorage.getItem('accessToken')).toBeNull();
  });
});
