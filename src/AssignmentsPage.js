import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function AssignmentsPage() {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [csrStaff, setCsrStaff] = useState([]);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ customer_id: '', item_id: '', quantity: 1, assigned_by: '', notes: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      const [cust, itms, staff, asg] = await Promise.all([
        supabase.from('customers').select('id, name').order('name'),
        supabase.from('items').select('id, name').order('name'),
        supabase.from('staffs').select('id, name').eq('role', 'csr').order('name'),
        supabase.from('assignments').select('id, customer_id, item_id, quantity, assigned_at').order('id', { ascending: false }).limit(20)
      ]);
      if (!cust.error) setCustomers(cust.data || []);
      if (!itms.error) setItems(itms.data || []);
      if (!staff.error) setCsrStaff(staff.data || []);
      if (!asg.error) setRows(asg.data || []);
    };
    load();
  }, []);

  const submit = async () => {
    setMsg('');
    const payload = {
      customer_id: Number(form.customer_id),
      item_id: Number(form.item_id),
      quantity: Number(form.quantity),
      assigned_by: form.assigned_by ? Number(form.assigned_by) : null,
      notes: form.notes || null
    };
    const { data, error } = await supabase.from('assignments').insert(payload).select().single();
    if (error) { setMsg(error.message); return; }
    setRows(prev => [data, ...prev]);
    setForm({ customer_id: '', item_id: '', quantity: 1, assigned_by: '', notes: '' });
  };

  return (
    <div className="card">
      <h2>CSR Assignments</h2>
      {msg && <p style={{ color: 'red' }}>{msg}</p>}
      <div className="form-row" style={{ gap: 8, flexWrap: 'wrap' }}>
        <select value={form.customer_id} onChange={e => setForm({ ...form, customer_id: e.target.value })}>
          <option value="">Customer</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={form.item_id} onChange={e => setForm({ ...form, item_id: e.target.value })}>
          <option value="">Item</option>
          {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <input type="number" min="1" placeholder="Qty" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
        <select value={form.assigned_by} onChange={e => setForm({ ...form, assigned_by: e.target.value })}>
          <option value="">Assigned by (CSR)</option>
          {csrStaff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input type="text" placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
        <button className="btn-primary" onClick={submit}>Create Assignment</button>
      </div>

      <ul className="user-list" style={{ marginTop: 12 }}>
        {rows.map(a => (
          <li key={a.id}><span>#{a.id} • customer {a.customer_id} • item {a.item_id} • qty {a.quantity} • {new Date(a.assigned_at).toLocaleString()}</span></li>
        ))}
        {rows.length === 0 && <li><span>No assignments yet.</span></li>}
      </ul>
    </div>
  );
}


