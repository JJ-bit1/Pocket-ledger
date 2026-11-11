import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext.tsx';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [expenses, setExpenses] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [customCategory, setCustomCategory] = useState(''); 
  
  const [hideAmounts, setHideAmounts] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  
  // New state to handle the custom delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    fetchExpenses();
  }, [navigate]);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setExpenses(await res.json());
    } catch (err) { console.log(err); }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const finalCategory = category === 'Other' ? customCategory : category;

    if (category === 'Other' && !customCategory.trim()) {
      setMessage('Please enter what you spent on.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: Number(amount), category: finalCategory, date: new Date().toISOString() })
      });

      if (res.ok) {
        setMessage('Expense added successfully!');
        setAmount(''); setCategory(''); setCustomCategory('');
        fetchExpenses();
      } else { setMessage('Failed to add expense.'); }
    } catch (err) { setMessage('Network error.'); }
  };

  // Updated Delete Handler (no more window.confirm)
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/expenses/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        setConfirmDeleteId(null); // Reset the confirm state
        fetchExpenses();
      }
    } catch (err) { console.log(err); }
  };

  const startEdit = (exp: any) => { setEditingId(exp.id); setEditAmount(exp.amount); setEditCategory(exp.category); };
  
  const saveEdit = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: Number(editAmount), category: editCategory })
      });
      if (res.ok) { setEditingId(null); fetchExpenses(); }
    } catch (err) { console.log(err); }
  };

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

  return (
    <div className="min-h-screen p-8 font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b pb-4" style={{ borderColor: 'var(--color-card)' }}>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Pocket Ledger</h1>
          <div className="space-x-6 flex items-center text-sm">
            <Link to="/admin" className="hover:underline opacity-80">Admin</Link>
            <button onClick={() => setHideAmounts(!hideAmounts)} className="opacity-80 hover:opacity-100">
              {hideAmounts ? '👁️ Show' : '🙈 Hide'}
            </button>
            <Link to="/budgets" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>Budgets</Link>
            <button onClick={handleLogout} className="text-red-400 font-semibold hover:underline">Logout</button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Expense Form */}
          <div className="p-6 rounded-xl shadow-lg border transition-colors duration-300" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-bg)' }}>
            <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
            {message && <p className="mb-2 text-sm" style={{ color: 'var(--color-primary)' }}>{message}</p>}
            
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm opacity-70 mb-1">Amount ({theme.currency})</label>
                <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2 rounded bg-black/20 border border-white/10 outline-none focus:border-white/30" required />
              </div>
              
              <div>
                <label className="block text-sm opacity-70 mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 rounded bg-black/20 border border-white/10 outline-none focus:border-white/30" required>
                  <option value="" disabled hidden>Select...</option>
                  <option>Food</option><option>Transport</option><option>Fun</option><option>Bills</option><option>Other</option>
                </select>
              </div>

              {category === 'Other' && (
                <div className="mt-2">
                  <label className="block text-sm opacity-70 mb-1">Custom Category</label>
                  <input type="text" placeholder="e.g., Gym..." value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} className="w-full p-2 rounded bg-black/20 border border-white/10 outline-none focus:border-white/30" required />
                </div>
              )}

              <button type="submit" className="w-full font-bold py-2 rounded transition-opacity hover:opacity-90" style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
                + Add Expense
              </button>
            </form>
          </div>

          {/* Recent Expenses */}
          <div className="p-6 rounded-xl shadow-lg border transition-colors duration-300" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-bg)' }}>
            <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
            {expenses.length === 0 ? (
              <p className="opacity-60">No expenses yet. Add one!</p>
            ) : (
              <ul className="space-y-3">
                {expenses.map((exp: any) => (
                  <li key={exp.id} className="p-3 rounded transition-colors duration-300" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    {editingId === exp.id ? (
                      /* EDIT MODE */
                      <div className="flex flex-col gap-2">
                        <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="p-1 rounded bg-black/40 border border-white/20 text-sm w-full outline-none" />
                        <input type="text" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="p-1 rounded bg-black/40 border border-white/20 text-sm w-full outline-none" />
                        <div className="flex gap-2 justify-end mt-1">
                          <button onClick={() => setEditingId(null)} className="text-xs opacity-70 hover:opacity-100">Cancel</button>
                          <button onClick={() => saveEdit(exp.id)} className="text-xs px-3 py-1 rounded text-white font-bold" style={{ backgroundColor: 'var(--color-primary)' }}>Save</button>
                        </div>
                      </div>
                    ) : (
                      /* VIEW MODE */
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold block">{exp.category}</span>
                          <span className="text-xs opacity-50">{new Date(exp.date).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className={`font-bold transition-all duration-300 ${hideAmounts ? 'blur-sm select-none opacity-50' : ''}`} style={{ color: 'var(--color-primary)' }}>
                            {theme.currency}{exp.amount}
                          </span>
                          
                          {/* CUSTOM DELETE CONFIRMATION */}
                          <div className="flex gap-2 text-sm items-center">
                            {confirmDeleteId === exp.id ? (
                              <div className="flex gap-1 items-center bg-red-500/20 px-2 py-1 rounded">
                                <span className="text-xs text-red-400">Sure?</span>
                                <button onClick={() => handleDelete(exp.id)} className="text-xs font-bold text-red-400 hover:text-red-300 ml-1">Yes</button>
                                <button onClick={() => setConfirmDeleteId(null)} className="text-xs text-gray-400 hover:text-white ml-1">No</button>
                              </div>
                            ) : (
                              <>
                                <button onClick={() => startEdit(exp)} className="hover:scale-110 transition-transform">✏️</button>
                                <button onClick={() => setConfirmDeleteId(exp.id)} className="hover:scale-110 transition-transform">🗑️</button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
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