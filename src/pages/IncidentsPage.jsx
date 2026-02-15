import { useState } from 'react';
import '../styles/Pages.css';
import { ZONES, INCIDENT_TYPES } from '../data/mockData';
import { useApp } from '../context/AppContext';
import ConfirmModal from '../components/ConfirmModal';

const typeIcon={Flood:'fa-water',Fire:'fa-fire',Landslide:'fa-hill-rockslide',Storm:'fa-cloud-bolt',Earthquake:'fa-circle-exclamation'};
const statusColor={Active:'danger',Pending:'warning',Verified:'info',Responded:'purple',Resolved:'success'};
const statuses=['All','Active','Pending','Verified','Responded','Resolved'];
const severityColor={High:'danger',Medium:'warning',Low:'info'};
const emptyForm={type:'Flood',zone:'Zone 1',location:'',severity:'Medium',reporter:'',description:''};

function IncidentsPage(){
  const {incidents,addIncident,updateIncident,deleteIncident}=useApp();
  const [filterStatus,setFilterStatus]=useState('All');
  const [filterType,setFilterType]=useState('All');
  const [search,setSearch]=useState('');
  const [showModal,setShowModal]=useState(false);
  const [selected,setSelected]=useState(null);
  const [isEditing,setIsEditing]=useState(false);
  const [form,setForm]=useState(emptyForm);
  const [deleteId,setDeleteId]=useState(null);

  const filtered=incidents.filter(i=>{
    const ms=filterStatus==='All'||i.status===filterStatus;
    const mt=filterType==='All'||i.type===filterType;
    const mq=i.location.toLowerCase().includes(search.toLowerCase())||i.zone.toLowerCase().includes(search.toLowerCase())||i.reporter.toLowerCase().includes(search.toLowerCase());
    return ms&&mt&&mq;
  });

  const openNew=()=>{setIsEditing(false);setSelected(null);setForm(emptyForm);setShowModal(true);};
  const openView=(inc)=>{setIsEditing(false);setSelected(inc);setForm({...inc});setShowModal(true);};
  const openEdit=(inc)=>{setIsEditing(true);setSelected(inc);setForm({...inc});setShowModal(true);};
  const handleSave=()=>{
    if(!form.location.trim()||!form.reporter.trim())return;
    if(isEditing&&selected){updateIncident(selected.id,form);}else{addIncident(form);}
    setShowModal(false);
  };
  const updateStatus=(id,s)=>{updateIncident(id,{status:s});setSelected(p=>p?{...p,status:s}:p);};
  const handleDelete=()=>{deleteIncident(deleteId);setDeleteId(null);setShowModal(false);};

  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Incident Management</div><div className="page-subtitle">Track, verify, and respond to reported disaster incidents</div></div>
        <button className="btn btn-primary" onClick={openNew}><i className="fa-solid fa-plus"></i> Report Incident</button>
      </div>

      <div className="summary-pills">
        {statuses.slice(1).map(s=>(
          <div key={s} className={`summary-pill badge badge-${statusColor[s]}`} style={{cursor:'pointer'}} onClick={()=>setFilterStatus(filterStatus===s?'All':s)}>
            {incidents.filter(i=>i.status===s).length} {s}
          </div>
        ))}
      </div>

      <div className="filter-row">
        <input className="form-control" placeholder="Search location, zone, reporter..." value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:280}}/>
        <select className="form-control" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{maxWidth:160}}>{statuses.map(s=><option key={s}>{s}</option>)}</select>
        <select className="form-control" value={filterType} onChange={e=>setFilterType(e.target.value)} style={{maxWidth:160}}><option>All</option>{INCIDENT_TYPES.map(t=><option key={t}>{t}</option>)}</select>
      </div>

      <div className="card" style={{padding:0}}>
        <div className="table-container">
          <table>
            <thead><tr><th>ID</th><th>Type</th><th>Zone / Location</th><th>Reporter</th><th>Severity</th><th>Status</th><th>Reported</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(inc=>(
                <tr key={inc.id}>
                  <td><span className="mono">{inc.id}</span></td>
                  <td><div style={{display:'flex',alignItems:'center',gap:7}}><i className={`fa-solid ${typeIcon[inc.type]}`} style={{color:'var(--accent-blue)'}}></i>{inc.type}</div></td>
                  <td><div>{inc.zone}</div><div style={{fontSize:11,color:'var(--text-muted)'}}>{inc.location}</div></td>
                  <td>{inc.reporter}</td>
                  <td><span className={`badge badge-${severityColor[inc.severity]}`}>{inc.severity}</span></td>
                  <td><span className={`badge badge-${statusColor[inc.status]}`}>{inc.status}</span></td>
                  <td style={{fontSize:12,color:'var(--text-muted)'}}>{new Date(inc.dateReported).toLocaleString('en-PH',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-secondary btn-sm" onClick={()=>openView(inc)} title="View"><i className="fa-solid fa-eye"></i></button>
                      <button className="btn btn-outline btn-sm" onClick={()=>openEdit(inc)} title="Edit"><i className="fa-solid fa-pen"></i></button>
                      {inc.status!=='Resolved'&&<button className="btn btn-success btn-sm" onClick={()=>updateStatus(inc.id,'Resolved')} title="Resolve"><i className="fa-solid fa-check"></i></button>}
                      <button className="btn btn-sm" style={{background:'rgba(230,57,70,.12)',color:'var(--accent-red)',border:'1px solid rgba(230,57,70,.3)'}} onClick={()=>setDeleteId(inc.id)} title="Delete"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={8}><div className="empty-state"><i className="fa-solid fa-inbox"></i><p>No incidents found.</p></div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId&&<ConfirmModal title="Delete Incident" message="Delete this incident? This cannot be undone." onConfirm={handleDelete} onCancel={()=>setDeleteId(null)}/>}

      {showModal&&(
        <div className="modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fa-solid fa-triangle-exclamation" style={{color:'var(--accent-orange)',marginRight:8}}></i>
                {isEditing?`Edit ${selected?.id}`:selected?`Incident ${selected.id}`:'Report New Incident'}
              </h3>
              <button className="modal-close" onClick={()=>setShowModal(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            {selected&&!isEditing?(
              <div>
                <div className="detail-grid">
                  <div className="detail-item"><span>Type</span><strong>{selected.type}</strong></div>
                  <div className="detail-item"><span>Zone</span><strong>{selected.zone}</strong></div>
                  <div className="detail-item"><span>Severity</span><span className={`badge badge-${severityColor[selected.severity]}`}>{selected.severity}</span></div>
                  <div className="detail-item"><span>Status</span><span className={`badge badge-${statusColor[selected.status]}`}>{selected.status}</span></div>
                  <div className="detail-item full"><span>Location</span><strong>{selected.location}</strong></div>
                  <div className="detail-item full"><span>Reporter</span><strong>{selected.reporter}</strong></div>
                  {selected.description&&<div className="detail-item full"><span>Description</span><p style={{color:'var(--text-primary)',fontSize:13,marginTop:4}}>{selected.description}</p></div>}
                </div>
                <div className="divider"></div>
                <div className="section-title"><i className="fa-solid fa-arrow-right-arrow-left"></i>Update Status</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16}}>
                  {['Pending','Verified','Responded','Resolved'].map(s=>(
                    <button key={s} className={`btn btn-sm ${selected.status===s?'btn-primary':'btn-secondary'}`} onClick={()=>updateStatus(selected.id,s)}>{s}</button>
                  ))}
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button className="btn btn-outline btn-sm" onClick={()=>openEdit(selected)}><i className="fa-solid fa-pen"></i> Edit</button>
                  <button className="btn btn-sm" style={{background:'rgba(230,57,70,.12)',color:'var(--accent-red)',border:'1px solid rgba(230,57,70,.3)'}} onClick={()=>{setDeleteId(selected.id);}}><i className="fa-solid fa-trash"></i> Delete</button>
                </div>
              </div>
            ):(
              <div className="form-grid">
                <div className="form-group"><label>Type</label><select className="form-control" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{INCIDENT_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                <div className="form-group"><label>Zone</label><select className="form-control" value={form.zone} onChange={e=>setForm({...form,zone:e.target.value})}>{ZONES.map(z=><option key={z}>{z}</option>)}</select></div>
                <div className="form-group full"><label>Location</label><input className="form-control" placeholder="Specific location..." value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></div>
                <div className="form-group"><label>Severity</label><select className="form-control" value={form.severity} onChange={e=>setForm({...form,severity:e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select></div>
                <div className="form-group"><label>Reporter</label><input className="form-control" placeholder="Full name..." value={form.reporter} onChange={e=>setForm({...form,reporter:e.target.value})}/></div>
                <div className="form-group full"><label>Description</label><textarea className="form-control" rows={3} placeholder="Describe the situation..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})}></textarea></div>
                <div className="form-group full" style={{flexDirection:'row',justifyContent:'flex-end',gap:8}}>
                  <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleSave}><i className="fa-solid fa-paper-plane"></i>{isEditing?'Save Changes':'Submit Report'}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default IncidentsPage;
