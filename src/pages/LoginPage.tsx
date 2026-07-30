import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { FormFieldWrapper } from '../components/common/FormField';
import LogoImg from '../assets/Blue.png';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email.trim()) return setError('Email is required');
    if (!password) return setError('Password is required');

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      let message = 'Invalid credentials';
      if (err && typeof err === 'object') {
        const maybe = err as { message?: unknown };
        if (typeof maybe.message === 'string') message = maybe.message;
      }
      setError(message);
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: '60px auto', padding: '0 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img src={LogoImg} alt="Minikin" style={{ height: 120, width: 'auto'}} />
        <p style={{ color: 'var(--color-text-secondary)' }}>Sign in to manage your brand campaigns</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'grid', gap: 12 }}>
          <FormFieldWrapper id="email" label="Email" required>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </FormFieldWrapper>

          <FormFieldWrapper id="password" label="Password" required>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ flex: 1 }}
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password visibility" className="btn btn--ghost btn--sm">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </FormFieldWrapper>

          {error && <p className="text-error" role="alert">{error}</p>}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            {/* <Link to="/">Back to home</Link> */}
            <Button type="submit" variant="primary" loading={loading}>Login</Button>
          </div>
        </div>
      </form>
    </main>
  );
}
