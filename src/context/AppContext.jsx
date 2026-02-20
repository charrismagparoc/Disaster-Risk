import { createContext, useContext, useState } from 'react';
import {
  INITIAL_INCIDENTS, INITIAL_ALERTS, INITIAL_EVAC,
  INITIAL_RESIDENTS, INITIAL_RESOURCES, INITIAL_USERS, INITIAL_ACTIVITY,
  KAUSWAGAN_CENTER,
} from '../data/mockData';

const AppContext = createContext(null);
const genId = (p) => `${p}-${String(Date.now()).slice(-6)}`;

export function AppProvider({ children }) {
  const [incidents,   setIncidents]   = useState(INITIAL_INCIDENTS);
  const [alerts,      setAlerts]      = useState(INITIAL_ALERTS);
  const [evacCenters, setEvacCenters] = useState(INITIAL_EVAC);
  const [residents,   setResidents]   = useState(INITIAL_RESIDENTS);
  const [resources,   setResources]   = useState(INITIAL_RESOURCES);
  const [users,       setUsers]       = useState(INITIAL_USERS);
  const [actLog,      setActLog]      = useState(INITIAL_ACTIVITY);

  const log = (action, type, user = 'Admin') =>
    setActLog(p => [{ id: genId('LOG'), action, type, user, time: new Date().toISOString() }, ...p]);

  // INCIDENTS
  const addIncident = (d) => { const inc = { ...d, id: genId('INC'), status: 'Pending', dateReported: new Date().toISOString(), lat: KAUSWAGAN_CENTER[0] + (Math.random()-.5)*.01, lng: KAUSWAGAN_CENTER[1] + (Math.random()-.5)*.01 }; setIncidents(p=>[inc,...p]); log(`Incident ${inc.id}: ${inc.type} in ${inc.zone}`, 'Incident'); return inc; };
  const updateIncident = (id, d) => { setIncidents(p=>p.map(i=>i.id===id?{...i,...d}:i)); log(`Incident ${id} updated`,'Incident'); };
  const deleteIncident = (id)    => { setIncidents(p=>p.filter(i=>i.id!==id)); log(`Incident ${id} deleted`,'Incident'); };

  // ALERTS
  const addAlert = (d) => { const a = { ...d, id: genId('ALT'), sentAt: new Date().toISOString(), sentBy:'Admin', recipientsCount: d.zone==='All Zones'?1284:Math.floor(Math.random()*250+100) }; setAlerts(p=>[a,...p]); log(`${a.level} alert sent to ${a.zone}`,'Alert'); return a; };
  const deleteAlert = (id) => { setAlerts(p=>p.filter(a=>a.id!==id)); log(`Alert ${id} removed`,'Alert'); };

  // EVAC
  const addEvacCenter    = (d) => { const c={...d,id:genId('EVC'),lat:KAUSWAGAN_CENTER[0]+(Math.random()-.5)*.015,lng:KAUSWAGAN_CENTER[1]+(Math.random()-.5)*.015}; setEvacCenters(p=>[...p,c]); log(`Evac center "${c.name}" added`,'Evacuation'); return c; };
  const updateEvacCenter = (id,d) => { setEvacCenters(p=>p.map(c=>c.id===id?{...c,...d}:c)); log(`Evac center ${id} updated`,'Evacuation'); };
  const deleteEvacCenter = (id)   => { setEvacCenters(p=>p.filter(c=>c.id!==id)); log(`Evac center ${id} removed`,'Evacuation'); };

  // RESIDENTS
  const addResident    = (d) => { const r={...d,id:genId('RES')}; setResidents(p=>[...p,r]); log(`Resident ${r.name} added`,'Resident'); return r; };
  const updateResident = (id,d) => { setResidents(p=>p.map(r=>r.id===id?{...r,...d}:r)); log(`Resident ${id} updated`,'Resident'); };
  const deleteResident = (id)   => { setResidents(p=>p.filter(r=>r.id!==id)); log(`Resident ${id} removed`,'Resident'); };

  // RESOURCES
  const addResource    = (d) => { const r={...d,id:genId('RSC')}; setResources(p=>[...p,r]); log(`Resource "${r.name}" added`,'Resource'); return r; };
  const updateResource = (id,d) => { setResources(p=>p.map(r=>r.id===id?{...r,...d}:r)); log(`Resource ${id} updated`,'Resource'); };
  const deleteResource = (id)   => { setResources(p=>p.filter(r=>r.id!==id)); log(`Resource ${id} removed`,'Resource'); };

  // USERS
  const addUser    = (d) => { const u={...d,id:genId('USR'),lastLogin:new Date().toISOString()}; setUsers(p=>[...p,u]); log(`User "${u.name}" created`,'Resident'); return u; };
  const updateUser = (id,d) => { setUsers(p=>p.map(u=>u.id===id?{...u,...d}:u)); log(`User ${id} updated`,'Resident'); };
  const deleteUser = (id)   => { setUsers(p=>p.filter(u=>u.id!==id)); log(`User ${id} deleted`,'Resident'); };

  return (
    <AppContext.Provider value={{
      incidents, addIncident, updateIncident, deleteIncident,
      alerts, addAlert, deleteAlert,
      evacCenters, addEvacCenter, updateEvacCenter, deleteEvacCenter,
      residents, addResident, updateResident, deleteResident,
      resources, addResource, updateResource, deleteResource,
      users, addUser, updateUser, deleteUser,
      actLog,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
