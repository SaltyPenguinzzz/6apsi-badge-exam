import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function ApprovalsPage() {
  const [pending, setPending] = useState([]);
  const [tlStaff, setTlStaff] = useState([]);
  const [tlId, setTlId] = useState('');
  const [msg, setMsg] = useState('');

  const load = async () => {
    const [asg, tls] = await Promise.all([
      supabase.from('assignments').select('id, customer_id, item_id, quantity').order('id', { ascending: false }).limit(30),
      supabase.from('staffs').select('id, name').eq('role', 'tl').order('name')
    ]);
    const { data: existing } = await supabase.from('approvals').select('assignment_id');
    const approvedIds = new Set((existing || []).map(a => a.assignment_id));
    if (!asg.error) setPending((asg.data || []).filter(a => !approvedIds.has(a.id)));
    if (!tls.error) setTlStaff(tls.data || []);
  };

  useEffect(() => { load(); }, []);

  const approve = async (assignment_id, status) => {
    setMsg('');
    const { error } = await supabase.from('approvals').insert({ assignment_id, tl_id: tlId ? Number(tlId) : null, status });
    if (error) { setMsg(error.message); return; }
    await load();
  };

  return (
    <div className="card">
      <h2>Approvals</h2>
      {msg && <p style={{ color: 'red' }}>{msg}</p>}
      <div className="form-row" style={{ gap: 8 }}>
        <select value={tlId} onChange={e => setTlId(e.target.value)}>
          <option value="">TL approver</option>
          {tlStaff.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <ul className="user-list" style={{ marginTop: 12 }}>
        {pending.map(a => (
          <li key={a.id}>
            <span>Assignment #{a.id} • customer {a.customer_id} • item {a.item_id} • qty {a.quantity}</span>
            <div>
              <button className="btn-secondary" onClick={() => approve(a.id, 'approved')}>Approve</button>
              <button className="btn-danger" onClick={() => approve(a.id, 'rejected')}>Reject</button>
            </div>
          </li>
        ))}
        {pending.length === 0 && <li><span>No assignments waiting for approval.</span></li>}
      </ul>
    </div>
  );
}


