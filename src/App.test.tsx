import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { api } from './api';

vi.mock('./api', () => ({ api: vi.fn() }));

const mockedApi = vi.mocked(api);

describe('ClientHub workspace', () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    localStorage.clear();
    mockedApi.mockReset();
  });

  it('shows an empty state only after tasks have loaded', async () => {
    localStorage.setItem('accessToken', 'test-token');
    mockedApi.mockResolvedValueOnce([]);

    render(<App />);

    expect(await screen.findByText('No deliverables yet')).toBeTruthy();
  });

  it('does not send a deliverable made only of spaces', async () => {
    localStorage.setItem('accessToken', 'test-token');
    mockedApi.mockResolvedValueOnce([]);

    render(<App />);
    await screen.findByText('No deliverables yet');

    fireEvent.change(screen.getByLabelText('New deliverable'), {
      target: { value: '   ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add deliverable' }));

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain('at least 2 characters');
    });
    expect(mockedApi).toHaveBeenCalledTimes(1);
  });

  it('filters deliverables by status and title', async () => {
    localStorage.setItem('accessToken', 'test-token');
    mockedApi.mockResolvedValueOnce([
      { id: 'task-1', title: 'Prepare release notes', completed: false },
      { id: 'task-2', title: 'Send handover report', completed: true },
    ]);

    render(<App />);
    expect(await screen.findByText('Prepare release notes')).toBeTruthy();
    expect(screen.getByText('Send handover report')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Open (1)' }));
    expect(screen.getByText('Prepare release notes')).toBeTruthy();
    expect(screen.queryByText('Send handover report')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Completed (1)' }));
    expect(screen.getByText('Send handover report')).toBeTruthy();
    expect(screen.queryByText('Prepare release notes')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'All (2)' }));
    fireEvent.change(screen.getByLabelText('Search deliverables'), {
      target: { value: 'release' },
    });
    expect(screen.getByText('Prepare release notes')).toBeTruthy();
    expect(screen.queryByText('Send handover report')).toBeNull();
  });

  it('adds a deliverable returned by the API', async () => {
    const task = {
      id: 'task-1',
      title: 'Review release notes',
      completed: false,
    };
    localStorage.setItem('accessToken', 'test-token');
    mockedApi.mockResolvedValueOnce([]).mockResolvedValueOnce(task);

    render(<App />);
    await screen.findByText('No deliverables yet');

    fireEvent.change(screen.getByLabelText('New deliverable'), {
      target: { value: '  Review release notes  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add deliverable' }));

    expect(await screen.findByText('Review release notes')).toBeTruthy();
    expect(mockedApi).toHaveBeenLastCalledWith('/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: 'Review release notes' }),
    });
  });
});
