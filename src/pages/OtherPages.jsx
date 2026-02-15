import { useState } from 'react';
import '../styles/Pages.css';
import { zoneRiskLevels, incidentByType, incidentHistory, RESOURCE_CATEGORIES } from '../data/mockData';
import { useApp } from '../context/AppContext';
import ConfirmModal from '../components/ConfirmModal';

// RESOURCES
export function ResourcesPage(){
  const {resources,addResource,updateResource,deleteResource}=useApp();
  const [filterCat,setFilterCat]=useState('All');
  const [showModal,setShowModal]=useState(false);
  const [editing,setEditing]=useState(null);
  const [deleteId,setDeleteId]=useState(null);
  const [form,setForm]=useState({name:'',category:'Equipment',quantity:1,available:1,status:'Available',location:''});
  const statusBadge={Available:'success',Deployed:'warning','In Use':'danger','Partially Deployed':'info'};
  const filtered=filterCat==='All'?resources:resources.filter(r=>r.category===filterCat);
  const openAdd=()=>{setEditing(null);setForm({name:'',category:'Equipment',quantity:1,available:1,status:'Available',location:''});setShowModal(true);};
  const openEdit=(r)=>{setEditing(r);setForm({...r});setShowModal(true);};
  const handleSave=()=>{
    if(!form.name.trim())return;
    if(editing){updateResource(editing.id,form);}else{addResource(form);}
    setShowModal(false);
  };
  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Resource Management</div><div className="page-subtitle">Track equipment, supplies, and deployment status</div></div>
        <button className="btn btn-primary" onClick={openAdd}><i className="fa-solid fa-plus"></i> Add Resource</button>
      </div>
      <div className="filter-row">
        <button className={`btn btn-sm ${filterCat==='All'?'btn-primary':'btn-secondary'}`} onClick={()=>setFilterCat('All')}>All</button>
        {RESOURCE_CATEGORIES.map(c=><button key={c} className={`btn btn-sm ${filterCat===c?'btn-primary':'btn-secondary'}`} onClick={()=>setFilterCat(c)}>{c}</button>)}
      </div>
      <div className="card" style={{padding:0}}>
        <div className="table-container">
          <table>
            <thead><tr><th>ID</th><th>Resource</th><th>Category</th><th>Total</th><th>Available</th><th>Availability</th><th>Status</th><th>Location</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(r=>{
                const pct=(r.available/r.quantity)*100;
                return(
                  <tr key={r.id}>
                    <td><span className="mono">{r.id}</span></td>
                    <td><strong>{r.name}</strong></td>
                    <td style={{color:'var(--text-secondary)',fontSize:12}}>{r.category}</td>
                    <td style={{textAlign:'center',fontWeight:700}}>{r.quantity}</td>
                    <td style={{textAlign:'center'}}>{r.available}</td>
                    <td style={{width:130}}>
                      <div className="res-status-bar">
                        <div className="res-bar-wrap"><div className="res-bar" style={{width:`${pct}%`,background:pct>50?'var(--accent-green)':pct>20?'var(--accent-orange)':'var(--accent-red)'}}></div></div>
                        <span style={{fontSize:11,color:'var(--text-muted)',flexShrink:0}}>{Math.round(pct)}%</span>
                      </div>
                    </td>
                    <td><span className={`badge badge-${statusBadge[r.status]||'neutral'}`}>{r.status}</span></td>
                    <td style={{fontSize:12,color:'var(--text-secondary)'}}>{r.location}</td>
                    <td>
                      <div style={{display:'flex',gap:6}}>
                        <button className="btn btn-outline btn-sm" onClick={()=>openEdit(r)} title="Edit"><i className="fa-solid fa-pen"></i></button>
                        <button className="btn btn-sm" style={{background:'rgba(230,57,70,.12)',color:'var(--accent-red)',border:'1px solid rgba(230,57,70,.25)'}} onClick={()=>setDeleteId(r.id)} title="Delete"><i className="fa-solid fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length===0&&<tr><td colSpan={9}><div className="empty-state"><i className="fa-solid fa-boxes-stacked"></i><p>No resources found.</p></div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {deleteId&&<ConfirmModal title="Delete Resource" message="Remove this resource?" onConfirm={()=>{deleteResource(deleteId);setDeleteId(null);}} onCancel={()=>setDeleteId(null)}/>}
      {showModal&&(
        <div className="modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3><i className="fa-solid fa-boxes-stacked" style={{color:'var(--accent-blue)',marginRight:8}}></i>{editing?'Edit Resource':'Add Resource'}</h3><button className="modal-close" onClick={()=>setShowModal(false)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="form-grid">
              <div className="form-group full"><label>Resource Name</label><input className="form-control" placeholder="e.g. Life Jackets" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
              <div className="form-group"><label>Category</label><select className="form-control" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{RESOURCE_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
              <div className="form-group"><label>Status</label><select className="form-control" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Available</option><option>Partially Deployed</option><option>Deployed</option><option>In Use</option></select></div>
              <div className="form-group"><label>Total Quantity</label><input className="form-control" type="number" min={0} value={form.quantity} onChange={e=>setForm({...form,quantity:parseInt(e.target.value)||0})}/></div>
              <div className="form-group"><label>Available</label><input className="form-control" type="number" min={0} value={form.available} onChange={e=>setForm({...form,available:parseInt(e.target.value)||0})}/></div>
              <div className="form-group full"><label>Storage Location</label><input className="form-control" placeholder="e.g. Barangay Hall Storage" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></div>
            </div>
            <div style={{marginTop:16,display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}><i className="fa-solid fa-floppy-disk"></i>{editing?'Save Changes':'Add Resource'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// REPORTS
export function ReportsPage(){
  const {incidents,residents,evacCenters}=useApp();
  const typeColors={Flood:'#4cc9f0',Fire:'#e63946',Landslide:'#f4a261',Storm:'#f9c74f',Earthquake:'#b39ddb'};
  const incByType=incidentByType.map(i=>({...i,count:incidents.filter(inc=>inc.type===i.type).length}));
  const maxDyn=Math.max(...incByType.map(i=>i.count),1);
  const maxTrend=Math.max(...incidentHistory.map(i=>i.count),1);
  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Reports & Analytics</div><div className="page-subtitle">Disaster management statistics and zone risk assessments</div></div>
        <button className="btn btn-secondary" onClick={()=>window.print()}><i className="fa-solid fa-file-pdf"></i> Export PDF</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        <div className="card">
          <div className="section-title"><i className="fa-solid fa-chart-pie"></i>Incidents by Type</div>
          {incByType.map(item=>(
            <div key={item.type} style={{marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:4}}><span style={{color:'var(--text-secondary)'}}>{item.type}</span><strong>{item.count}</strong></div>
              <div className="res-bar-wrap" style={{height:8}}><div className="res-bar" style={{width:`${(item.count/maxDyn)*100}%`,background:typeColors[item.type]}}></div></div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="section-title"><i className="fa-solid fa-chart-line"></i>Monthly Trend (Aug–Feb)</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:8,height:120}}>
            {incidentHistory.map(item=>(
              <div key={item.month} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4,height:'100%'}}>
                <div style={{flex:1,width:'100%',display:'flex',alignItems:'flex-end',background:'var(--bg-deep)',borderRadius:4,overflow:'hidden'}}>
                  <div style={{width:'100%',height:`${(item.count/maxTrend)*100}%`,background:'linear-gradient(180deg,var(--accent-blue),rgba(76,201,240,0.3))',borderRadius:4}}></div>
                </div>
                <span style={{fontSize:11,color:'var(--text-muted)'}}>{item.month}</span>
                <span style={{fontSize:11,fontWeight:700,color:'var(--accent-blue)'}}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{gridColumn:'span 2',padding:0}}>
          <div className="table-container">
            <table>
              <thead><tr><th>Zone</th><th>Risk Level</th><th>Total Incidents</th><th>Main Hazard</th><th>Recommendation</th></tr></thead>
              <tbody>
                {zoneRiskLevels.map(z=>(
                  <tr key={z.zone}>
                    <td><strong>{z.zone}</strong></td>
                    <td><span className={`badge badge-${z.riskLevel==='High'?'danger':z.riskLevel==='Medium'?'warning':'success'}`}>{z.riskLevel}</span></td>
                    <td style={{textAlign:'center',fontWeight:700}}>{z.incidents}</td>
                    <td style={{color:'var(--text-secondary)'}}>{z.mainHazard}</td>
                    <td style={{fontSize:12,color:'var(--text-muted)'}}>{z.riskLevel==='High'?'Pre-position rescue team. Prepare evacuation orders.':z.riskLevel==='Medium'?'Monitor closely. Issue advisory if conditions worsen.':'Continue regular monitoring.'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="section-title"><i className="fa-solid fa-users"></i>Resident Status</div>
          {[['Safe','var(--accent-green)'],['Evacuated','var(--accent-blue)'],['Unaccounted','var(--accent-red)']].map(([s,c])=>(
            <div key={s} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
              <span style={{color:'var(--text-secondary)'}}>{s}</span><strong style={{color:c}}>{residents.filter(r=>r.evacuationStatus===s).length}</strong>
            </div>
          ))}
          <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0'}}><span style={{color:'var(--text-secondary)'}}>Total Residents</span><strong>{residents.length}</strong></div>
        </div>
        <div className="card">
          <div className="section-title"><i className="fa-solid fa-house-flag"></i>Evacuation Centers</div>
          {evacCenters.map(c=>(
            <div key={c.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
              <span style={{fontSize:13}}>{c.name}</span>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <span style={{fontSize:12,color:'var(--text-secondary)'}}>{c.occupancy}/{c.capacity}</span>
                <span className={`badge badge-${c.status==='Open'?'success':c.status==='Full'?'danger':'neutral'}`}>{c.status}</span>
              </div>
            </div>
          ))}
          {evacCenters.length===0&&<p style={{color:'var(--text-muted)',fontSize:13,marginTop:8}}>No evacuation centers registered.</p>}
        </div>
      </div>
    </div>
  );
}

// RISK INTELLIGENCE
export function IntelligencePage(){
  const {incidents}=useApp();
  const [showInsights,setShowInsights]=useState(false);
  const activeCount=incidents.filter(i=>i.status==='Active').length;
  const highRisk=zoneRiskLevels.filter(z=>z.riskLevel==='High').length;
  const riskScore=Math.min(Math.round((activeCount/Math.max(incidents.length,1))*100+highRisk*10),99);
  const levelStyle={High:'badge-danger',Medium:'badge-warning',Low:'badge-success'};
  const predictions=zoneRiskLevels.map(z=>({id:z.zone,label:`${z.zone} — ${z.mainHazard} Risk`,level:z.riskLevel,result:z.riskLevel==='High'?'CRITICAL':z.riskLevel==='Medium'?'ELEVATED':'NORMAL',note:z.riskLevel==='High'?`Pre-position rescue teams. Prepare evacuation order for ${z.zone}.`:z.riskLevel==='Medium'?`Increase monitoring frequency in ${z.zone}.`:`Continue standard monitoring for ${z.zone}.`}));
  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Risk Intelligence</div><div className="page-subtitle">AI-assisted risk assessment and zone predictions for Barangay Kauswagan</div></div>
        <button className={`btn ${showInsights?'btn-success':'btn-primary'}`} onClick={()=>setShowInsights(!showInsights)}>
          <i className={`fa-solid ${showInsights?'fa-eye-slash':'fa-wand-magic-sparkles'}`}></i>{showInsights?'Hide Insights':'Run AI Analysis'}
        </button>
      </div>
      <div className="card" style={{marginBottom:20,borderColor:'rgba(244,162,97,.3)',background:'rgba(244,162,97,.04)'}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{flex:1}}>
            <div className="section-title" style={{marginBottom:4}}><i className="fa-solid fa-brain"></i>BDRRMC Risk Assessment Engine</div>
            <div style={{fontSize:12,color:'var(--text-secondary)',marginTop:4}}>Based on {incidents.length} incidents, weather data, and zone history. Updated: 09:00 AM</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:11,color:'var(--text-muted)'}}>Overall Risk Score</div>
            <div style={{fontSize:32,fontFamily:'var(--font-display)',fontWeight:800,color:riskScore>70?'var(--accent-red)':riskScore>40?'var(--accent-orange)':'var(--accent-green)'}}>{riskScore}%</div>
          </div>
        </div>
      </div>
      <div className="section-title"><i className="fa-solid fa-chart-column"></i>Zone Risk Predictions</div>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
        {predictions.map(pred=>(
          <div key={pred.id} style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:10,padding:16,display:'flex',alignItems:'center',gap:14}}>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}><strong style={{fontSize:14}}>{pred.label}</strong><span className={`badge ${levelStyle[pred.level]}`}>{pred.level}</span></div>
              <div style={{fontSize:22,fontFamily:'var(--font-display)',fontWeight:800,color:pred.level==='High'?'var(--accent-red)':pred.level==='Medium'?'var(--accent-orange)':'var(--accent-green)'}}>{pred.result}</div>
            </div>
            {showInsights&&(
              <div style={{maxWidth:300,fontSize:12,color:'var(--text-secondary)',background:'var(--bg-deep)',borderRadius:8,padding:'10px 14px',border:'1px solid var(--border)'}}>
                <i className="fa-solid fa-lightbulb" style={{color:'var(--accent-yellow)',marginRight:6}}></i>{pred.note}
              </div>
            )}
          </div>
        ))}
      </div>
      {showInsights&&(
        <div className="card" style={{borderColor:'rgba(76,201,240,.3)',background:'rgba(76,201,240,.04)'}}>
          <div className="section-title"><i className="fa-solid fa-wand-magic-sparkles"></i>Automatic Alert Suggestions</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {[
              {zone:'Zone 3',action:'Evacuate residents near creek. Send DANGER alert immediately.',urgent:true},
              {zone:'Zone 5',action:'Block hillside access road. Warn residents of landslide risk.',urgent:true},
              {zone:'All Zones',action:'Issue general heavy rainfall advisory for next 24 hours.',urgent:false},
            ].map((s,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',borderRadius:8,background:'var(--bg-deep)',border:`1px solid ${s.urgent?'rgba(230,57,70,.3)':'var(--border)'}`}}>
                <i className={`fa-solid ${s.urgent?'fa-circle-exclamation':'fa-circle-info'}`} style={{color:s.urgent?'var(--accent-red)':'var(--accent-blue)'}}></i>
                <div style={{flex:1}}><strong>{s.zone}</strong> — <span style={{color:'var(--text-secondary)',fontSize:13}}>{s.action}</span></div>
                <button className={`btn btn-sm ${s.urgent?'btn-primary':'btn-secondary'}`}><i className="fa-solid fa-bullhorn"></i> Send</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// USER MANAGEMENT
export function UsersPage(){
  const {users,addUser,updateUser,deleteUser}=useApp();
  const [showModal,setShowModal]=useState(false);
  const [editing,setEditing]=useState(null);
  const [deleteId,setDeleteId]=useState(null);
  const [form,setForm]=useState({name:'',role:'Staff',email:'',status:'Active',password:''});
  const roleBadge={Admin:'danger',Staff:'info'};
  const statusBadge={Active:'success',Inactive:'neutral'};
  const openAdd=()=>{setEditing(null);setForm({name:'',role:'Staff',email:'',status:'Active',password:''});setShowModal(true);};
  const openEdit=(u)=>{setEditing(u);setForm({...u,password:''});setShowModal(true);};
  const handleSave=()=>{
    if(!form.name.trim()||!form.email.trim())return;
    if(editing){updateUser(editing.id,form);}else{addUser({...form,lastLogin:new Date().toISOString()});}
    setShowModal(false);
  };
  const toggleStatus=(id,cur)=>updateUser(id,{status:cur==='Active'?'Inactive':'Active'});
  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">User Management</div><div className="page-subtitle">Manage admin and staff accounts with role-based access control</div></div>
        <button className="btn btn-primary" onClick={openAdd}><i className="fa-solid fa-user-plus"></i> Add User</button>
      </div>
      <div className="card" style={{padding:0}}>
        <div className="table-container">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Email</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.id}>
                  <td><span className="mono">{u.id}</span></td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:32,height:32,background:'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,color:'#fff',fontSize:13,flexShrink:0}}>{u.name.charAt(0)}</div>
                      {u.name}
                    </div>
                  </td>
                  <td><span className={`badge badge-${roleBadge[u.role]||'neutral'}`}>{u.role}</span></td>
                  <td style={{fontSize:12,color:'var(--text-secondary)'}}>{u.email}</td>
                  <td><span className={`badge badge-${statusBadge[u.status]}`}>{u.status}</span></td>
                  <td style={{fontSize:12,color:'var(--text-muted)'}}>{new Date(u.lastLogin).toLocaleString('en-PH',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-outline btn-sm" onClick={()=>openEdit(u)} title="Edit"><i className="fa-solid fa-pen"></i></button>
                      <button className={`btn btn-sm ${u.status==='Active'?'btn-outline':'btn-success'}`} onClick={()=>toggleStatus(u.id,u.status)} title={u.status==='Active'?'Deactivate':'Activate'}><i className={`fa-solid ${u.status==='Active'?'fa-ban':'fa-check'}`}></i></button>
                      <button className="btn btn-sm" style={{background:'rgba(230,57,70,.12)',color:'var(--accent-red)',border:'1px solid rgba(230,57,70,.25)'}} onClick={()=>setDeleteId(u.id)} title="Delete"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length===0&&<tr><td colSpan={7}><div className="empty-state"><i className="fa-solid fa-user-slash"></i><p>No users yet. Add one above.</p></div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {deleteId&&<ConfirmModal title="Delete User" message="Remove this user account? This cannot be undone." onConfirm={()=>{deleteUser(deleteId);setDeleteId(null);}} onCancel={()=>setDeleteId(null)}/>}
      {showModal&&(
        <div className="modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3><i className="fa-solid fa-user-shield" style={{color:'var(--accent-blue)',marginRight:8}}></i>{editing?'Edit User':'Add User'}</h3><button className="modal-close" onClick={()=>setShowModal(false)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="form-grid">
              <div className="form-group full"><label>Full Name</label><input className="form-control" placeholder="Full name..." value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
              <div className="form-group"><label>Role</label><select className="form-control" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option>Admin</option><option>Staff</option></select></div>
              <div className="form-group"><label>Status</label><select className="form-control" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Active</option><option>Inactive</option></select></div>
              <div className="form-group full"><label>Email Address</label><input className="form-control" type="email" placeholder="email@kauswagan.gov.ph" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
              <div className="form-group full"><label>Password {editing&&<span style={{fontWeight:400,textTransform:'none',letterSpacing:0}}>(leave blank to keep)</span>}</label><input className="form-control" type="password" placeholder="Password..." value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
            </div>
            <div style={{marginTop:16,display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}><i className="fa-solid fa-floppy-disk"></i>{editing?'Save Changes':'Add User'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ACTIVITY LOG
export function ActivityPage(){
  const {actLog}=useApp();
  const typeBadge={Alert:'danger',Incident:'warning',Evacuation:'success',Resource:'info',Resident:'purple'};
  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Activity Log</div><div className="page-subtitle">Full audit trail of all system actions for accountability and review</div></div>
        <button className="btn btn-secondary" onClick={()=>window.print()}><i className="fa-solid fa-download"></i> Export Log</button>
      </div>
      <div className="card" style={{padding:0}}>
        <div className="table-container">
          <table>
            <thead><tr><th>Log ID</th><th>Action</th><th>Type</th><th>User</th><th>Timestamp</th></tr></thead>
            <tbody>
              {actLog.map((log,i)=>(
                <tr key={log.id||i}>
                  <td><span className="mono">{log.id}</span></td>
                  <td>{log.action}</td>
                  <td><span className={`badge badge-${typeBadge[log.type]||'neutral'}`}>{log.type}</span></td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:24,height:24,background:'var(--bg-card-hover)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'var(--accent-blue)'}}>{log.user.charAt(0)}</div>
                      {log.user}
                    </div>
                  </td>
                  <td style={{fontSize:12,color:'var(--text-muted)'}}>{new Date(log.time).toLocaleString('en-PH',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</td>
                </tr>
              ))}
              {actLog.length===0&&<tr><td colSpan={5}><div className="empty-state"><i className="fa-solid fa-clock"></i><p>No activity recorded yet.</p></div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
