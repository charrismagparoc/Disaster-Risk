import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import IncidentsPage from './pages/IncidentsPage';
import AlertsPage from './pages/AlertsPage';
import { EvacuationPage, ResidentsPage } from './pages/EvacResidents';
import { ResourcesPage, ReportsPage, IntelligencePage, UsersPage, ActivityPage } from './pages/OtherPages';

function AppInner() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');

  const handleLogin = (user) => { setCurrentUser(user); setIsLoggedIn(true); };
  const handleLogout = () => { setIsLoggedIn(false); setCurrentUser(null); setActivePage('dashboard'); };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':    return <Dashboard />;
      case 'map':          return <MapPage />;
      case 'incidents':    return <IncidentsPage />;
      case 'alerts':       return <AlertsPage />;
      default:             return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="main-content">
        <Topbar activePage={activePage} currentUser={currentUser} onLogout={handleLogout} />
        <main className="page-body">{renderPage()}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

export default App;
