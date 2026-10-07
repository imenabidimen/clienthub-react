import { FormEvent, useEffect, useState } from 'react';
import { api } from './api';

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type AuthMode = 'login' | 'register';

export default function App() {
  const [authed, setAuthed] = useState(
    Boolean(localStorage.getItem('accessToken'))
  );
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authed) return;

    setLoading(true);
    api('/tasks')
      .then(setTasks)
      .catch(() => setError('Could not load the workspace.'))
      .finally(() => setLoading(false));
  }, [authed]);

  async function submitAuth(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const result = await api(endpoint, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem('accessToken', result.accessToken);
      setAuthed(true);
    } catch {
      setError(
        mode === 'login'
          ? 'Unable to sign in. Check your credentials.'
          : 'Could not create your account.'
      );
    } finally {
      setBusy(false);
    }
  }

  async function addTask(event: FormEvent) {
    event.preventDefault();

    if (!title.trim()) return;

    setBusy(true);
    setError('');

    try {
      const task = await api('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: title.trim() }),
      });

      setTasks((current) => [task, ...current]);
      setTitle('');
    } catch {
      setError('Could not add that deliverable.');
    } finally {
      setBusy(false);
    }
  }

  async function completeTask(id: string) {
    setError('');

    try {
      const updated = await api(`/tasks/${id}/complete`, {
        method: 'POST',
      });

      setTasks((current) =>
        current.map((task) => (task.id === id ? updated : task))
      );
    } catch {
      setError('Could not update that deliverable.');
    }
  }

  function logout() {
    localStorage.removeItem('accessToken');
    setAuthed(false);
    setTasks([]);
  }

  const done = tasks.filter((task) => task.completed).length;
  const open = tasks.length - done;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  if (!authed) {
    return (
      <main className="auth-page">
        <section className="auth-brand">
          <div className="client-logo">C</div>
          <p className="kicker">CLIENTHUB · DELIVERY</p>
          <h1>Keep the next delivery step clear.</h1>
          <p>A simple place to keep deliverables and follow-ups together.</p>
          <div className="quote">
            Keep the checklist clear and the handover simple.
          </div>
        </section>

        <section className="auth-card">
          <div className="mini-nav">
            <span>ClientHub</span>
            <span>Secure workspace</span>
          </div>

          <h2>
            {mode === 'login' ? 'Sign in' : 'Create your workspace'}
          </h2>
          <p className="muted">
            {mode === 'login'
              ? 'Welcome back. Your next deliverable is waiting.'
              : 'Set up your workspace in a few seconds.'}
          </p>

          <form onSubmit={submitAuth}>
            <label>
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                required
              />
            </label>

            <label>
              Password
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                minLength={8}
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                placeholder="Minimum 8 characters"
                required
              />
            </label>

            <button className="primary" disabled={busy}>
              {busy
                ? 'Working…'
                : mode === 'login'
                  ? 'Continue to workspace'
                  : 'Create workspace'}
            </button>
          </form>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <button
            className="text-button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
          >
            {mode === 'login'
              ? 'New to ClientHub? Create an account'
              : 'Already have an account? Sign in'}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="workspace">
      <header className="workspace-head">
        <div className="wordmark">
          <span className="client-logo small">C</span>
          <div>
            <b>ClientHub</b>
            <small>Delivery desk</small>
          </div>
        </div>

        <div className="client-switch">
          <span className="avatar">CH</span>
          <div>
            <b>Delivery workspace</b>
            <small>Current project</small>
          </div>
          <button onClick={logout}>Log out</button>
        </div>
      </header>

      <section className="welcome">
        <div>
          <p className="kicker">CURRENT PROJECT · DELIVERY</p>
          <h1>Good morning.</h1>
          <p>Here is what needs attention across your deliverables.</p>
        </div>

        <div className="progress">
          <span>Delivery progress</span>
          <strong>{progress}%</strong>
          <div>
            <i style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      <section className="metric-row">
        <div>
          <span>Open deliverables</span>
          <strong>{open}</strong>
          <small>Needs attention</small>
        </div>
        <div>
          <span>Completed</span>
          <strong>{done}</strong>
          <small>Ready to report</small>
        </div>
        <div>
          <span>Total this cycle</span>
          <strong>{tasks.length}</strong>
          <small>Current workspace</small>
        </div>
      </section>

      <section className="delivery-card">
        <div className="section-head">
          <div>
            <p className="kicker">DELIVERABLES</p>
            <h2>Project checklist</h2>
          </div>
          <span className="cycle">IN PROGRESS</span>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a client deliverable…"
            aria-label="New deliverable"
            required
          />
          <button disabled={busy}>Add deliverable</button>
        </form>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        {loading && <p className="muted">Loading workspace…</p>}

        {!loading && tasks.length === 0 && (
          <div className="empty">
            <b>No deliverables yet</b>
            <span>Add the first item to start the project checklist.</span>
          </div>
        )}

        <ul className="deliverables">
          {tasks.map((task, index) => (
            <li key={task.id} className={task.completed ? 'is-done' : ''}>
              <span className="index">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="deliverable-title">
                <b>{task.title}</b>
                <small>
                  {task.completed ? 'Ready for client review' : 'In progress'}
                </small>
              </div>

              <button
                className="status-btn"
                disabled={task.completed}
                onClick={() => completeTask(task.id)}
              >
                {task.completed ? 'Completed' : 'Mark done'}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
