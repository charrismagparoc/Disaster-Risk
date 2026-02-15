import { useState } from 'react';
import AlertBanner from '../components/AlertBanner';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/Pages.css';
import { zoneRiskLevels } from '../data/mockData';
import { useApp } from '../context/AppContext';

const ZONES=['All Zones','Zone 1','Zone 2','Zone 3','Zone 4','Zone 5','Zone 6'];
const quickAlerts=[
  {label:'Flood Warning',zone:'Zone 3',level:'Danger',icon:'fa-water',msg:'FLOOD WARNING: Water level critically high in Zone 3. Immediate evacuation of low-lying areas required.'},
  {label:'Evacuation Order',zone:'All Zones',level:'Danger',icon:'fa-person-walking-arrow-right',msg:'MANDATORY EVACUATION ORDER: All residents in high-risk zones must proceed to nearest evacuation center immediately.'},
  {label:'All Clear',zone:'All Zones',level:'Resolved',icon:'fa-circle-check',msg:'ALL CLEAR: The threat has passed. Residents may return to their homes. Exercise caution with debris and damaged structures.'},
  {label:'Storm Advisory',zone:'All Zones',level:'Advisory',icon:'fa-cloud-bolt',msg:'STORM ADVISORY: Prepare emergency kits. Strong winds and heavy rain expected within the next 12 hours.'},
];

function AlertsPage(){
  const {alerts,addAlert,deleteAlert}=useApp();
  const [showModal,setShowModal]=useState(false);
  const [form,setForm]=useState({level:'Advisory',zone:'All Zones',message:'',channel:'Web'});
  const [sent,setSent]=useState(false);
  const [deleteId,setDeleteId]=useState(null);

  const handleSend=()=>{
    if(!form.message.trim())return;
    addAlert(form);
    setSent(true);
    setTimeout(()=>{setShowModal(false);setSent(false);setForm({level:'Advisory',zone:'All Zones',message:'',channel:'Web'});},1500);
  };
  const openQuick=(q)=>{setForm({level:q.level,zone:q.zone,message:q.msg,channel:'Web + SMS'});setShowModal(true);};
  const handleDelete=()=>{deleteAlert(deleteId);setDeleteId(null);};

  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Alert System</div><div className="page-subtitle">Send and manage emergency alerts across all barangay zones</div></div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}><i className="fa-solid fa-bullhorn"></i> Send Alert</button>
      </div>

      <div className="card" style={{marginBottom:20}}>
        <div className="section-title"><i className="fa-solid fa-bolt"></i>Quick Emergency Broadcast</div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          {quickAlerts.map(q=>(
            <button key={q.label} className="btn btn-secondary" onClick={()=>openQuick(q)}>
              <i className={`fa-solid ${q.icon}`}></i>{q.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{marginBottom:20}}>
        <div className="section-title"><i className="fa-solid fa-map-pin"></i>Zone Risk Summary</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:10}}>
          {zoneRiskLevels.map(z=>(
            <div key={z.zone} className={`risk-card risk-${z.riskLevel.toLowerCase()}`}>
              <div className="risk-icon"><i className="fa-solid fa-location-dot"></i></div>
              <div className="risk-info"><div className="risk-zone">{z.zone}</div><div className="risk-desc">{z.mainHazard} · {z.incidents} incidents</div></div>
              <span className={`badge badge-${z.riskLevel==='High'?'danger':z.riskLevel==='Medium'?'warning':'success'}`}>{z.riskLevel}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-title"><i className="fa-solid fa-clock-rotate-left"></i>Alert History ({alerts.length})</div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {alerts.length===0&&<div className="empty-state"><i className="fa-solid fa-bell-slash"></i><p>No alerts sent yet. Use the button above to send an alert.</p></div>}
        {alerts.map(alert=>(
          <div key={alert.id} style={{position:'relative'}}>
            <AlertBanner level={alert.level} message={alert.message} zone={alert.zone} time={alert.sentAt} sentBy={alert.sentBy}/>
            <div style={{position:'absolute',top:10,right:10,display:'flex',gap:6}}>
              <button className="btn btn-sm" style={{background:'rgba(230,57,70,.12)',color:'var(--accent-red)',border:'1px solid rgba(230,57,70,.25)'}} onClick={()=>setDeleteId(alert.id)} title="Delete"><i className="fa-solid fa-trash"></i></button>
            </div>
          </div>
        ))}
      </div>

      {deleteId&&<ConfirmModal title="Delete Alert" message="Remove this alert from history?" onConfirm={handleDelete} onCancel={()=>setDeleteId(null)}/>}

      {showModal&&(
        <div className="modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fa-solid fa-bullhorn" style={{color:'var(--accent-red)',marginRight:8}}></i>Send Emergency Alert</h3>
              <button className="modal-close" onClick={()=>setShowModal(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            {sent?(
              <div style={{textAlign:'center',padding:'32px 0'}}>
                <i className="fa-solid fa-circle-check" style={{fontSize:48,color:'var(--accent-green)',display:'block',marginBottom:12}}></i>
                <h3>Alert Sent!</h3><p style={{color:'var(--text-secondary)',marginTop:6}}>Broadcast to {form.zone}.</p>
              </div>
            ):(
              <div className="form-grid">
                <div className="form-group"><label>Alert Level</label><select className="form-control" value={form.level} onChange={e=>setForm({...form,level:e.target.value})}><option>Advisory</option><option>Warning</option><option>Danger</option></select></div>
                <div className="form-group"><label>Target Zone</label><select className="form-control" value={form.zone} onChange={e=>setForm({...form,zone:e.target.value})}>{ZONES.map(z=><option key={z}>{z}</option>)}</select></div>
                <div className="form-group"><label>Channel</label><select className="form-control" value={form.channel} onChange={e=>setForm({...form,channel:e.target.value})}><option>Web</option><option>Web + SMS</option><option>SMS Only</option></select></div>
                <div className="form-group full"><label>Alert Message</label><textarea className="form-control" rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="e.g. Flood warning in Zone 3. Please evacuate immediately."></textarea></div>
                <div className="form-group full" style={{flexDirection:'row',justifyContent:'flex-end',gap:8}}>
                  <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleSend}><i className="fa-solid fa-paper-plane"></i>Send Alert</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default AlertsPage;
