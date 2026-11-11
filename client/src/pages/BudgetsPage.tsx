import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function BudgetsPage() {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    fetchBudgets();
  }, [navigate]);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/budgets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setBudgets(await res.json());
    } catch (err) { console.log(err); }
  };

  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category, limit_amount: Number(limit) })
      });

      if (res.ok) {
        setMessage('Budget set successfully!');
        setCategory('');
        setLimit('');
        fetchBudgets();
      } else {
        setMessage('Failed to set budget.');
      }
    } catch (err) { setMessage('Network error.'); }
  };

  const handleDeleteBudget = async (id: number) => {
    if (!window.confirm("Remove this budget?")) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/budgets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBudgets();
    } catch (err) { console.log(err); }
  };

  return (
    <div className="min-h-screen p-8 font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b pb-4" style={{ borderColor: 'var(--color-card)' }}>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Your Budgets</h1>
          <Link to="/dashboard" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>← Back to Dashboard</Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Set Budget Form */}
          <div className="p-6 rounded-xl shadow-lg border transition-colors duration-300" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-bg)' }}>
            <h2 className="text-xl font-semibold mb-4">Set Monthly Budget</h2>
            {message && <p className="mb-2 text-sm" style={{ color: 'var(--color-primary)' }}>{message}</p>}
            
            <form onSubmit={handleSetBudget} className="space-y-4">
              <div>
                <label className="block text-sm opacity-70 mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 rounded bg-black/20 border border-white/10 outline-none" required>
                  <option value="" disabled hidden>Select category...</option>
                  <option>Food</option><option>Transport</option><option>Fun</option><option>Bills</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm opacity-70 mb-1">Monthly Limit ($)</label>
                <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} className="w-full p-2 rounded bg-black/20 border border-white/10 outline-none" required />
              </div>
              <button type="submit" className="w-full font-bold py-2 rounded hover:opacity-90 text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                Set Budget
              </button>
            </form>
          </div>

          {/* Active Budgets List */}
          <div className="p-6 rounded-xl shadow-lg border transition-colors duration-300" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-bg)' }}>
            <h2 className="text-xl font-semibold mb-4">Active Budgets</h2>
            {budgets.length === 0 ? (
              <p className="opacity-60">No budgets set yet.</p>
            ) : (
              <ul className="space-y-3">
                {budgets.map((b: any) => (
                  <li key={b.id} className="flex justify-between items-center p-3 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <div>
                      <span className="font-semibold block">{b.category}</span>
                      <span className="text-xs opacity-50">Monthly Limit</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold" style={{ color: 'var(--color-primary)' }}>${b.limit_amount}</span>
                      <button onClick={() => handleDeleteBudget(b.id)} className="text-sm hover:scale-110 transition-transform">🗑️</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}