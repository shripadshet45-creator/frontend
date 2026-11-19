import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  ChevronDown,
  Eye,
  EyeOff,
  Landmark,
  LockKeyhole,
  LogOut,
  Mail,
  Plus,
  ReceiptText,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from 'lucide-react'
import './App.css'

const API_URL = import.meta.env.VITE_ACCOUNT_API_URL?.replace(/\/$/, '')

type Account = {
  accountHolder: string
  accountNumber: string
  type: string
  balance: number
  availableBalance: number
  currency: string
}

const demoAccount: Account = {
  accountHolder: 'Alex Morgan',
  accountNumber: '•••• 4829',
  type: 'Everyday account',
  balance: 18420.65,
  availableBalance: 17920.65,
  currency: 'USD',
}

async function login(email: string, password: string) {
  if (!API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 700))
    return { token: 'demo-token', account: demoAccount }
  }

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!response.ok) throw new Error('We couldn’t sign you in. Check your details and try again.')
  return response.json()
}

async function fetchAccount(token: string): Promise<Account> {
  if (!API_URL) return demoAccount

  const response = await fetch(`${API_URL}/accounts/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Your account could not be loaded.')
  return response.json()
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

function Login({ onLogin }: { onLogin: (token: string, account: Account) => void }) {
  const [email, setEmail] = useState('alex@moment.money')
  const [password, setPassword] = useState('moment123')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await login(email, password)
      onLogin(result.token, result.account)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-shell">
      <section className="login-visual">
        <div className="brand brand-light"><span className="brand-mark"><span /></span>Money Moment</div>
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="moment-card">
          <div className="moment-card-head"><span>MONTHLY MOMENT</span><Sparkles size={16} /></div>
          <div className="moment-value">$6,840<span>.20</span></div>
          <p>Saved this month</p>
          <div className="moment-bars" aria-hidden="true">
            {[34, 52, 43, 68, 58, 82, 72, 94, 76, 88, 100, 92].map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
        <div className="quote">
          <div className="quote-icon"><ShieldCheck size={19} /></div>
          <p>Money should feel simple.<br /><strong>And so should banking.</strong></p>
        </div>
      </section>

      <section className="login-panel">
        <div className="brand brand-dark"><span className="brand-mark"><span /></span>Money Moment</div>
        <form className="login-form" onSubmit={submit}>
          <div className="welcome-mark"><Sparkles size={19} /></div>
          <p className="eyebrow">WELCOME BACK</p>
          <h1>Your moment awaits.</h1>
          <p className="login-copy">Sign in to continue to your account.</p>

          <label htmlFor="email">Email address</label>
          <div className="field">
            <Mail size={18} />
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="label-row">
            <label htmlFor="password">Password</label>
            <button type="button" className="text-button">Forgot password?</button>
          </div>
          <div className="field">
            <LockKeyhole size={18} />
            <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="icon-button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : <>Sign in <ArrowUpRight size={18} /></>}
          </button>

          <p className="secure-note"><ShieldCheck size={14} /> Protected by bank-grade encryption</p>
        </form>
      </section>
    </main>
  )
}

function Dashboard({ account, onLogout }: { account: Account; onLogout: () => void }) {
  const [balanceVisible, setBalanceVisible] = useState(true)

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand brand-dark"><span className="brand-mark"><span /></span>Money Moment</div>
        <nav>
          <button className="nav-item active"><WalletCards size={19} />Overview</button>
          <button className="nav-item"><ArrowUpRight size={19} />Payments</button>
          <button className="nav-item"><ReceiptText size={19} />Activity</button>
          <button className="nav-item"><Landmark size={19} />Accounts</button>
        </nav>
        <button className="nav-item logout" onClick={onLogout}><LogOut size={19} />Sign out</button>
      </aside>

      <section className="dashboard-main">
        <header className="topbar">
          <button className="mobile-brand"><span className="brand-mark"><span /></span></button>
          <div className="search"><Search size={17} /><span>Search your money</span><kbd>⌘ K</kbd></div>
          <button className="notification" aria-label="Notifications"><Bell size={20} /><i /></button>
          <button className="profile"><span>AM</span><ChevronDown size={16} /></button>
        </header>

        <div className="dashboard-content">
          <div className="welcome-row">
            <div><p className="eyebrow">OVERVIEW</p><h1>Good morning, {account.accountHolder.split(' ')[0]}</h1></div>
            <button className="add-button"><Plus size={17} /> Move money</button>
          </div>

          <div className="account-grid">
            <section className="balance-card">
              <div className="balance-head"><div><span>{account.type}</span><small>{account.accountNumber}</small></div>
                <button onClick={() => setBalanceVisible((value) => !value)} aria-label="Toggle balance">
                  {balanceVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <p>Available balance</p>
              <h2>{balanceVisible ? formatMoney(account.availableBalance) : '••••••'}</h2>
              <div className="balance-footer"><span><i />Active</span><strong>{formatMoney(account.balance)} <small>total</small></strong></div>
            </section>

            <section className="quick-card">
              <h3>Quick actions</h3>
              <div className="quick-actions">
                <button><span><Send size={19} /></span>Send</button>
                <button><span><ArrowDownLeft size={19} /></span>Request</button>
                <button><span><Plus size={19} /></span>Top up</button>
              </div>
            </section>
          </div>

          <section className="activity-card">
            <div className="section-head"><div><p className="eyebrow">RECENT</p><h3>Account activity</h3></div><button>View all <ArrowUpRight size={15} /></button></div>
            <div className="transaction-list">
              {[
                ['AC', 'Acme Studio', 'Payment received', '+$2,800.00', 'positive'],
                ['MS', 'Market Street', 'Groceries', '-$86.24', ''],
                ['SP', 'Spotify', 'Subscription', '-$11.99', ''],
              ].map(([initials, name, detail, amount, tone]) => (
                <div className="transaction" key={name}><span className="transaction-logo">{initials}</span><div><strong>{name}</strong><small>{detail}</small></div><b className={tone}>{amount}</b></div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [session, setSession] = useState<{ token: string; account: Account } | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('money-moment-token')
    if (!token) return
    fetchAccount(token).then((account) => setSession({ token, account })).catch(() => localStorage.removeItem('money-moment-token'))
  }, [])

  function handleLogin(token: string, account: Account) {
    localStorage.setItem('money-moment-token', token)
    setSession({ token, account })
  }

  function handleLogout() {
    localStorage.removeItem('money-moment-token')
    setSession(null)
  }

  return session ? <Dashboard account={session.account} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />
}

export default App
