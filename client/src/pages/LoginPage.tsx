import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? 'login' : 'signup';
    
    try {
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Something went wrong');
      }

      // Save the token and go to dashboard
      if (data.token) localStorage.setItem('token', data.token);
      navigate('/dashboard');
      
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center font-sans transition-colors duration-300" 
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <div 
        className="p-8 rounded-xl shadow-2xl w-full max-w-md border transition-colors duration-300" 
        style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-bg)' }}
      >
        <h2 
          className="text-3xl font-bold text-center mb-6" 
          style={{ color: 'var(--color-primary)' }}
        >
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-center border border-red-500/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 opacity-70">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-black/10 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 opacity-70">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-black/10 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 font-bold rounded-lg transition-all hover:opacity-90 disabled:opacity-50 text-white mt-2"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="text-center mt-6 opacity-70 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="hover:underline font-semibold ml-1"
            style={{ color: 'var(--color-primary)' }}
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}