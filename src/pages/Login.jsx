import { useState } from 'react';
import '../styles/Login.css';

export default function Login({ onLogin }) {
  const [form, setForm]   = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const CREDS = [
    { email:'admin@kauswagan.gov.ph', password:'admin123', user:{ name:'Barangay Admin', role:'Admin', email:'admin@kauswagan.gov.ph' } },
    { email:'staff@kauswagan.gov.ph', password:'staff123', user:{ name:'Staff Cruz', role:'Staff', email:'staff@kauswagan.gov.ph' } },
  ];

  const submit = () => {
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setTimeout(() => {
      const match = CREDS.find(c => c.email === form.email && c.password === form.password);
      if (match) { onLogin(match.user); }
      else { setError('Invalid credentials. Check the demo hint below.'); setLoading(false); }
    }, 800);
  };

  return (
    <div className="login-screen">
      <div className="login-grid"></div>
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon"><i className="fa-solid fa-shield-heart"></i></div>
          <h1 className="login-brand-name">IDRMS</h1>
          <p className="login-brand-desc">Intelligent Disaster Risk Management System</p>
          <div className="login-barangay"><i className="fa-solid fa-location-dot"></i> Barangay Kauswagan, CDO</div>
        </div>
        <div className="login-feature-list">
          {[['fa-map-location-dot','GIS Hazard Mapping'],['fa-bell','Real-Time Alert System'],['fa-house-flag','Evacuation Management'],['fa-brain','Risk Intelligence Engine']].map(([icon,label]) => (
            <div key={label} className="login-feature-item">
              <i className={`fa-solid ${icon}`}></i><span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Admin Login</h2>
            <p>Sign in to access the IDRMS Control Panel</p>
          </div>
          {error && <div className="login-error"><i className="fa-solid fa-circle-exclamation"></i>{error}</div>}
          <div className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <i className="fa-solid fa-envelope"></i>
                <input className="form-control" type="email" placeholder="admin@kauswagan.gov.ph" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} onKeyDown={e=>e.key==='Enter'&&submit()} />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <i className="fa-solid fa-lock"></i>
                <input className="form-control" type={showPass?'text':'password'} placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} onKeyDown={e=>e.key==='Enter'&&submit()} />
                <button className="toggle-pass" onClick={()=>setShowPass(!showPass)} tabIndex={-1}><i className={`fa-solid ${showPass?'fa-eye-slash':'fa-eye'}`}></i></button>
              </div>
            </div>
            <button className="btn btn-primary login-btn" onClick={submit} disabled={loading}>
              {loading ? <><i className="fa-solid fa-spinner fa-spin"></i> Signing in...</> : <><i className="fa-solid fa-right-to-bracket"></i> Sign In</>}
            </button>
          </div>
          <div className="login-hint">
            <i className="fa-solid fa-circle-info"></i>
            Demo — <strong>admin@kauswagan.gov.ph</strong> / <strong>admin123</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
