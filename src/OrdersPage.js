import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function OrdersPage() {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [rows, setRows] = useState([]);

  const [orderForm, setOrderForm] = useState({ customer_id: '' });
  const [lineForm, setLineForm] = useState({ order_id: '', item_id: '', quantity: 1, unit_price: 0 });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      const [cust, itms, ords] = await Promise.all([
        supabase.from('customers').select('id, name').order('name'),
        supabase.from('items').select('id, name').order('name'),
        supabase.from('orders').select('id, customer_id, ordered_at, status').order('id', { ascending: false }).limit(20)
      ]);
      if (!cust.error) setCustomers(cust.data || []);
      if (!itms.error) setItems(itms.data || []);
      if (!ords.error) setRows(ords.data || []);
    };
    load();
  }, []);

  const createOrder = async () => {
    setMsg('');
    const { data, error } = await supabase.from('orders').insert({ customer_id: Number(orderForm.customer_id) }).select().single();
    if (error) { setMsg(error.message); return; }
    setRows(prev => [data, ...prev]);
    setOrderForm({ customer_id: '' });
  };

  const addLine = async () => {
    setMsg('');
    const payload = {
      order_id: Number(lineForm.order_id),
      item_id: Number(lineForm.item_id),
      quantity: Number(lineForm.quantity),
      unit_price: Number(lineForm.unit_price)
    };
    const { error } = await supabase.from('order_items').insert(payload);
    if (error) { setMsg(error.message); return; }
    setLineForm({ order_id: '', item_id: '', quantity: 1, unit_price: 0 });
  };

  return (
    <div className="card">
      <h2>Orders</h2>
      {msg && <p style={{ color: 'red' }}>{msg}</p>}
      <div className="form-row" style={{ gap: 8, flexWrap: 'wrap' }}>
        <select value={orderForm.customer_id} onChange={e => setOrderForm({ customer_id: e.target.value })}>
          <option value="">Customer</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn-primary" onClick={createOrder}>Create Order</button>
      </div>

      <div className="form-row" style={{ gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <select value={lineForm.order_id} onChange={e => setLineForm({ ...lineForm, order_id: e.target.value })}>
          <option value="">Order</option>
          {rows.map(o => <option key={o.id} value={o.id}>#{o.id}</option>)}
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
        {rows.map(o => (
          <li key={o.id}><span>#{o.id} • customer {o.customer_id} • {new Date(o.ordered_at).toLocaleString()} • {o.status}</span></li>
        ))}
        {rows.length === 0 && <li><span>No orders yet.</span></li>}
      </ul>
    </div>
  );
}


