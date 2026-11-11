import { useTheme } from '../ThemeContext.tsx';
import { Link } from 'react-router-dom';

export default function AdminPage() {
  const { theme, updateTheme } = useTheme();

  return (
    <div className="min-h-screen p-8 font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b pb-4" style={{ borderColor: 'var(--color-card)' }}>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Admin Panel</h1>
          <Link to="/dashboard" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>← Back to App</Link>
        </header>

        <div className="p-6 rounded-xl shadow-lg border transition-colors duration-300" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-bg)' }}>
          <h2 className="text-xl font-semibold mb-6">Customize App Settings</h2>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="font-medium">Primary Color</label>
              <input type="color" value={theme.primary} onChange={(e) => updateTheme({ primary: e.target.value })} className="w-12 h-10 cursor-pointer rounded bg-transparent" />
            </div>
            
            <div className="flex justify-between items-center">
              <label className="font-medium">Background Color</label>
              <input type="color" value={theme.background} onChange={(e) => updateTheme({ background: e.target.value })} className="w-12 h-10 cursor-pointer rounded bg-transparent" />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-medium">Card Color</label>
              <input type="color" value={theme.card} onChange={(e) => updateTheme({ card: e.target.value })} className="w-12 h-10 cursor-pointer rounded bg-transparent" />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-medium">Text Color</label>
              <input type="color" value={theme.text} onChange={(e) => updateTheme({ text: e.target.value })} className="w-12 h-10 cursor-pointer rounded bg-transparent" />
            </div>

            {/* UPGRADED CURRENCY DROPDOWN */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <label className="font-medium">Currency</label>
              <select 
                value={theme.currency} 
                onChange={(e) => updateTheme({ currency: e.target.value })} 
                className="w-32 p-2 rounded bg-black/20 border border-white/20 outline-none cursor-pointer"
              >
                <option value="$">$ - USD (US Dollar)</option>
                <option value="KSh">KSh - KES (Kenyan Shilling)</option>
                <option value="€">€ - EUR (Euro)</option>
                <option value="£">£ - GBP (British Pound)</option>
                <option value="₦">₦ - NGN (Nigerian Naira)</option>
                <option value="R">R - ZAR (South African Rand)</option>
                <option value="₹">₹ - INR (Indian Rupee)</option>
                <option value="A$">A$ - AUD (Australian Dollar)</option>
                <option value="C$">C$ - CAD (Canadian Dollar)</option>
                <option value="¥">¥ - JPY (Japanese Yen)</option>
              </select>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}