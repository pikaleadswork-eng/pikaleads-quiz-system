import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '../lib/trpc';

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load saved email from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('pikaleads_login_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      setLoading(false);
      // Redirect based on role
      if (data.user.role === 'admin') {
        window.location.href = '/admin';
      } else if (data.user.role === 'manager') {
        window.location.href = '/manager';
      } else {
        window.location.href = '/crm';
      }
    },
    onError: (err) => {
      setError(err.message || 'Invalid email or password');
      setLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Save email to localStorage for next time
    localStorage.setItem('pikaleads_login_email', email);

    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (error) {
      // Error handled by onError
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #FFD93D 0%, #5B2E90 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '5px',
          }}>
            PIKALEADS
          </h1>
          <p style={{ color: '#888', fontSize: '14px' }}>
            CRM & Quiz System
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 59, 48, 0.1)',
            border: '1px solid rgba(255, 59, 48, 0.3)',
            color: '#ff3b30',
            padding: '12px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#ccc',
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#ccc',
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#666' : 'linear-gradient(135deg, #5B2E90 0%, #FFD93D 100%)',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
