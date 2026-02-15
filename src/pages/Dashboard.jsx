import { useState } from 'react';
import StatCard from '../components/StatCard';
import AlertBanner from '../components/AlertBanner';
import '../styles/Dashboard.css';
import { weatherData, zoneRiskLevels, incidentByType, incidentHistory } from '../data/mockData';
import { useApp } from '../context/AppContext';

const TYPE_ICON  = { Flood:'fa-water', Fire:'fa-fire', Landslide:'fa-hill-rockslide', Storm:'fa-cloud-bolt', Earthquake:'fa-circle-exclamation' };
const TYPE_COLOR = { Flood:'#4cc9f0', Fire:'#e63946', Landslide:'#f4a261', Storm:'#f9c74f', Earthquake:'#b39ddb' };
const SEV_BADGE  = { High:'danger', Medium:'warning', Low:'info' };
const STATUS_BADGE = { Active:'danger', Pending:'warning', Verified:'info', Responded:'purple', Resolved:'success' };

export default function Dashboard() {
  const { incidents, alerts, evacCenters, residents, actLog } = useApp();
  const [showWeather, setShowWeather] = useState(false);
  const [dismissed, setDismissed]     = useState([]);

  const liveAlerts   = alerts.filter(a => a.level !== 'Resolved' && !dismissed.includes(a.id));
  const activeInc    = incidents.filter(i => ['Active','Pending'].includes(i.status));
  const incByType    = incidentByType.map(i => ({ ...i, count: incidents.filter(x=>x.type===i.type).length }));
  const maxCount     = Math.max(...incByType.map(i=>i.count), 1);
  const maxTrend     = Math.max(...incidentHistory.map(i=>i.count), 1);

  return (
    <div className="dashboard-page">
      <div className="pagasa-banner">
        <i className="fa-solid fa-satellite-dish pagasa-icon"></i>
        <span className="pagasa-label">PAGASA</span>
        <span className="pagasa-text">{weatherData.pagasaAdvisory}</span>
        <span className="pagasa-updated">Updated: 00:00 AM</span>
      </div>

      {liveAlerts.length > 0 && (
        <div className="active-alerts-strip">
          {liveAlerts.map(a => (
            <AlertBanner key={a.id} {...a} compact onDismiss={() => setDismissed(p=>[...p,a.id])} />
          ))}
        </div>
      )}

      <div className="stats-grid">
        <StatCard title="Total Incidents"     value={incidents.length}                                   icon="fa-triangle-exclamation" color="orange" change="+7" changeLabel="this month" trend="up" />
        <StatCard title="Active Emergencies"  value={incidents.filter(i=>i.status==='Active').length}    icon="fa-circle-radiation"     color="red"    change="+2" changeLabel="since yesterday" trend="up" />
        <StatCard title="Resolved"            value={incidents.filter(i=>i.status==='Resolved').length}  icon="fa-circle-check"         color="green"  change="+5" changeLabel="this week" trend="up" />
        <StatCard title="Evacuated Residents" value={residents.filter(r=>r.evacuationStatus==='Evacuated').length} icon="fa-person-walking-arrow-right" color="blue" change="+42" changeLabel="today" trend="up" />
        <StatCard title="Total Residents"     value={residents.length}                                   icon="fa-users"               color="purple" />
        <StatCard title="Open Evac Centers"   value={evacCenters.filter(c=>c.status==='Open').length}   icon="fa-house-flag"          color="yellow" />
      </div>

      <div className="dashboard-main-row">
        <div className="card dash-incidents">
          <div className="section-title">
            <i className="fa-solid fa-triangle-exclamation"></i>Active Incidents
            <span className="badge badge-danger ml-auto">{activeInc.length} Active</span>
          </div>
          <div className="incident-list">
            {activeInc.length === 0 && <div className="empty-state"><i className="fa-solid fa-circle-check"></i><p>No active incidents</p></div>}
            {activeInc.map(inc => (
              <div key={inc.id} className="incident-row">
                <div className={`inc-type-badge ${inc.type.toLowerCase()}`}><i className={`fa-solid ${TYPE_ICON[inc.type]}`}></i></div>
                <div className="inc-info">
                  <div className="inc-title">{inc.type} — {inc.zone}</div>
                  <div className="inc-location"><i className="fa-solid fa-location-dot"></i>{inc.location}</div>
                </div>
                <div className="inc-right">
                  <span className={`badge badge-${SEV_BADGE[inc.severity]}`}>{inc.severity}</span>
                  <span className={`badge badge-${STATUS_BADGE[inc.status]}`}>{inc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-right-col">
          <div className="card weather-card">
            <div className="weather-card-top">
              <div>
                <div className="section-title" style={{marginBottom:0}}><i className="fa-solid fa-cloud-sun-rain"></i>Current Weather</div>
                <div style={{fontSize:11,color:'var(--text-muted)',marginTop:4}}>CDO / Kauswagan</div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={()=>setShowWeather(!showWeather)}>
                <i className={`fa-solid fa-chevron-${showWeather?'up':'down'}`}></i> {showWeather?'Less':'Details'}
              </button>
            </div>
            <div className="weather-main">
              <span className="weather-temp">{weatherData.temperature}°C</span>
              <div className="weather-cond"><i className="fa-solid fa-cloud-rain weather-cond-icon"></i><span>{weatherData.condition}</span></div>
            </div>
            {showWeather && (
              <div className="weather-detail">
                <div className="weather-stat"><i className="fa-solid fa-droplet"></i><span>Humidity</span><strong>{weatherData.humidity}%</strong></div>
                <div className="weather-stat"><i className="fa-solid fa-wind"></i><span>Wind Speed</span><strong>{weatherData.windSpeed} km/h</strong></div>
                <div className="weather-stat"><i className="fa-solid fa-cloud-showers-heavy"></i><span>24h Rainfall</span><strong>{weatherData.rainfall24h} mm</strong></div>
                <div className="weather-risk"><i className="fa-solid fa-circle-exclamation"></i>Risk Level: <strong style={{color:'var(--accent-red)'}}>{weatherData.riskLevel}</strong></div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="section-title"><i className="fa-solid fa-map-pin"></i>Zone Risk Levels</div>
            <div className="zone-list">
              {zoneRiskLevels.map(z => (
                <div key={z.zone} className="zone-row">
                  <span className="zone-name">{z.zone}</span>
                  <span className="zone-hazard">{z.mainHazard}</span>
                  <div className="zone-bar-wrap"><div className={`zone-bar zone-${z.riskLevel.toLowerCase()}`} style={{width:`${(z.incidents/15)*100}%`}}></div></div>
                  <span className={`badge badge-${z.riskLevel==='High'?'danger':z.riskLevel==='Medium'?'warning':'success'}`}>{z.riskLevel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-bottom-row">
        <div className="card">
          <div className="section-title"><i className="fa-solid fa-chart-pie"></i>Incidents by Type</div>
          <div className="type-bars">
            {incByType.map(item => (
              <div key={item.type} className="type-bar-row">
                <span className="type-label">{item.type}</span>
                <div className="type-bar-track"><div className="type-bar-fill" style={{width:`${(item.count/maxCount)*100}%`,background:TYPE_COLOR[item.type]}}></div></div>
                <span className="type-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-title"><i className="fa-solid fa-chart-line"></i>Monthly Trend</div>
          <div className="trend-bars">
            {incidentHistory.map(item => (
              <div key={item.month} className="trend-bar-col">
                <div className="trend-bar-wrap"><div className="trend-bar-fill" style={{height:`${(item.count/maxTrend)*100}%`}} title={`${item.month}: ${item.count}`}></div></div>
                <span className="trend-month">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-title"><i className="fa-solid fa-clock-rotate-left"></i>Recent Activity</div>
          <div className="activity-feed">
            {actLog.slice(0,6).map((log,i) => (
              <div key={log.id||i} className="activity-item">
                <div className={`activity-dot ${log.type.toLowerCase()}`}></div>
                <div className="activity-info">
                  <div className="activity-action">{log.action}</div>
                  <div className="activity-meta"><i className="fa-solid fa-user"></i> {log.user} &nbsp;·&nbsp; <i className="fa-solid fa-clock"></i> {new Date(log.time).toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'})}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
