import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function ChecksPage() {
  const [receipts, setReceipts] = useState([]);
  const [items, setItems] = useState([]);
  const [warehouseStaff, setWarehouseStaff] = useState([]);
  const [form, setForm] = useState({ receipt_id: '', item_id: '', status: 'ok', quantity: 0, checked_by: '', remarks: '' });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const [recs, itms, staff, checks] = await Promise.all([
        supabase.from('warehouse_receipts').select('id').order('id', { ascending: false }).limit(50),
        supabase.from('items').select('id, name').order('name'),
        supabase.from('staffs').select('id, name').eq('role', 'warehouse').order('name'),
        supabase.from('warehouse_checks').select('id, receipt_id, item_id, status, quantity, checked_at').order('id', { ascending: false }).limit(20)
      ]);
      if (!recs.error) setReceipts(recs.data || []);
      if (!itms.error) setItems(itms.data || []);
      if (!staff.error) setWarehouseStaff(staff.data || []);
      if (!checks.error) setRows(checks.data || []);
    };
    load();
  }, []);

  const submit = async () => {
    setLoading(true);
    setError('');
    const payload = {
      receipt_id: Number(form.receipt_id),
      item_id: Number(form.item_id),
      status: form.status,
      quantity: Number(form.quantity),
      checked_by: form.checked_by ? Number(form.checked_by) : null,
      remarks: form.remarks || null
    };
    const { data, error } = await supabase.from('warehouse_checks').insert(payload).select().single();
    setLoading(false);
    if (error) { setError(error.message); return; }
    setRows(prev => [data, ...prev]);
    setForm({ receipt_id: '', item_id: '', status: 'ok', quantity: 0, checked_by: '', remarks: '' });
  };

  return (
    <div className="card">
      <h2>Warehouse Checks</h2>
      <div className="form-row" style={{ gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={form.receipt_id} onChange={e => setForm({ ...form, receipt_id: e.target.value })}>
          <option value="">Receipt</option>
          {receipts.map(r => <option key={r.id} value={r.id}>#{r.id}</option>)}
        </select>
        <select value={form.item_id} onChange={e => setForm({ ...form, item_id: e.target.value })}>
          <option value="">Item</option>
          {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          <option value="ok">ok</option>
          <option value="spoiled">spoiled</option>
          <option value="reject">reject</option>
          <option value="missing">missing</option>
          <option value="damaged">damaged</option>
        </select>
        <input type="number" min="0" placeholder="Qty" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
        <select value={form.checked_by} onChange={e => setForm({ ...form, checked_by: e.target.value })}>
          <option value="">Checked by</option>
          {warehouseStaff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input type="text" placeholder="Remarks" value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} />
        <button className="btn-primary" onClick={submit} disabled={loading}>{loading ? 'Saving...' : 'Add Check'}</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul className="user-list" style={{ marginTop: 12 }}>
        {rows.map(r => (
          <li key={r.id}>
            <span>#{r.id} • receipt {r.receipt_id} • item {r.item_id} • {r.status} • qty {r.quantity}</span>
          </li>
        ))}
        {rows.length === 0 && <li><span>No checks yet.</span></li>}
      </ul>
    </div>
  );
}


