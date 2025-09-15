import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function InvoicesPage() {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');
  const [invForm, setInvForm] = useState({ customer_id: '' });
  const [lineForm, setLineForm] = useState({ invoice_id: '', item_id: '', quantity: 1, unit_price: 0 });

  useEffect(() => {
    const load = async () => {
      const [cust, itms, invs] = await Promise.all([
        supabase.from('customers').select('id, name').order('name'),
        supabase.from('items').select('id, name').order('name'),
        supabase.from('invoices').select('id, customer_id, status, issued_at, total_amount').order('id', { ascending: false }).limit(20)
      ]);
      if (!cust.error) setCustomers(cust.data || []);
      if (!itms.error) setItems(itms.data || []);
      if (!invs.error) setRows(invs.data || []);
    };
    load();
  }, []);

  const createInvoice = async () => {
    setMsg('');
    const now = new Date();
    const due = new Date(Date.now() + 14*24*3600*1000);
    const { data, error } = await supabase.from('invoices').insert({ customer_id: Number(invForm.customer_id), status: 'issued', issued_at: now.toISOString(), due_at: due.toISOString(), total_amount: 0 }).select().single();
    if (error) { setMsg(error.message); return; }
    setRows(prev => [data, ...prev]);
    setInvForm({ customer_id: '' });
  };

  const addLine = async () => {
    setMsg('');
    const payload = {
      invoice_id: Number(lineForm.invoice_id),
      item_id: Number(lineForm.item_id),
      quantity: Number(lineForm.quantity),
      unit_price: Number(lineForm.unit_price)
    };
    const { error } = await supabase.from('invoice_items').insert(payload);
    if (error) { setMsg(error.message); return; }
    // Update total
    await supabase.rpc('sql', { sql: `update invoices set total_amount = (select coalesce(sum(line_total),0) from invoice_items where invoice_id = ${Number(lineForm.invoice_id)}) where id = ${Number(lineForm.invoice_id)};` });
    setLineForm({ invoice_id: '', item_id: '', quantity: 1, unit_price: 0 });
  };

  return (
    <div className="card">
      <h2>Invoices</h2>
      {msg && <p style={{ color: 'red' }}>{msg}</p>}

      <div className="form-row" style={{ gap: 8, flexWrap: 'wrap' }}>
        <select value={invForm.customer_id} onChange={e => setInvForm({ customer_id: e.target.value })}>
          <option value="">Customer</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn-primary" onClick={createInvoice}>Create Invoice</button>
      </div>

      <div className="form-row" style={{ gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <select value={lineForm.invoice_id} onChange={e => setLineForm({ ...lineForm, invoice_id: e.target.value })}>
          <option value="">Invoice</option>
          {rows.map(i => <option key={i.id} value={i.id}>#{i.id}</option>)}
        </select>
        <select value={lineForm.item_id} onChange={e => setLineForm({ ...lineForm, item_id: e.target.value })}>
          <option value="">Item</option>
          {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <input type="number" min="1" placeholder="Qty" value={lineForm.quantity} onChange={e => setLineForm({ ...lineForm, quantity: e.target.value })} />
        <input type="number" min="0" step="0.01" placeholder="Unit Price" value={lineForm.unit_price} onChange={e => setLineForm({ ...lineForm, unit_price: e.target.value })} />
        <button className="btn-secondary" onClick={addLine}>Add Line</button>
      </div>

      <ul className="user-list" style={{ marginTop: 12 }}>
        {rows.map(inv => (
          <li key={inv.id}><span>#{inv.id} • customer {inv.customer_id} • {inv.status} • total {Number(inv.total_amount).toFixed(2)}</span></li>
        ))}
        {rows.length === 0 && <li><span>No invoices yet.</span></li>}
      </ul>
    </div>
  );
}


