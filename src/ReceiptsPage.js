import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function ReceiptsPage() {
  const [distributors, setDistributors] = useState([]);
  const [warehouseStaff, setWarehouseStaff] = useState([]);
  const [form, setForm] = useState({ distributor_id: '', received_by: '', notes: '' });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const [dists, staff, recs] = await Promise.all([
        supabase.from('distributors').select('id, name').order('name'),
        supabase.from('staffs').select('id, name').eq('role', 'warehouse').order('name'),
        supabase.from('warehouse_receipts').select('id, distributor_id, received_by, received_at, notes').order('id', { ascending: false }).limit(20)
      ]);
      if (!dists.error) setDistributors(dists.data || []);
      if (!staff.error) setWarehouseStaff(staff.data || []);
      if (!recs.error) setRows(recs.data || []);
    };
    load();
  }, []);

  const submit = async () => {
    setLoading(true);
    setError('');
    const payload = {
      distributor_id: form.distributor_id ? Number(form.distributor_id) : null,
      received_by: form.received_by ? Number(form.received_by) : null,
      notes: form.notes || null
    };
    const { data, error } = await supabase.from('warehouse_receipts').insert(payload).select().single();
    setLoading(false);
    if (error) { setError(error.message); return; }
    setRows(prev => [data, ...prev]);
    setForm({ distributor_id: '', received_by: '', notes: '' });
  };

  return (
    <div className="card">
      <h2>Warehouse Receipts</h2>
      <div className="form-row" style={{ gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={form.distributor_id} onChange={e => setForm({ ...form, distributor_id: e.target.value })}>
          <option value="">Select distributor</option>
          {distributors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select value={form.received_by} onChange={e => setForm({ ...form, received_by: e.target.value })}>
          <option value="">Received by (warehouse)</option>
          {warehouseStaff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input type="text" placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
        <button className="btn-primary" onClick={submit} disabled={loading}>{loading ? 'Saving...' : 'Create Receipt'}</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul className="user-list" style={{ marginTop: 12 }}>
        {rows.map(r => (
          <li key={r.id}>
            <span>#{r.id} • Distributor {r.distributor_id || '—'} • By {r.received_by || '—'} • {new Date(r.received_at).toLocaleString()}</span>
          </li>
        ))}
        {rows.length === 0 && <li><span>No receipts yet.</span></li>}
      </ul>
    </div>
  );
}


